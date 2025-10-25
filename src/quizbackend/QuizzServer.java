package quizbackend;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.*;
import java.net.InetSocketAddress;
import java.util.List;

public class QuizzServer {

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/questions", new QuestionsHandler());
        server.createContext("/register", new RegisterHandler());

        server.setExecutor(null);
        server.start();
        System.out.println("✅ Quiz API running at http://localhost:8080");
        System.out.println("📡 Endpoints available:");
        System.out.println("   - GET    http://localhost:8080/questions");
        System.out.println("   - POST   http://localhost:8080/questions");
        System.out.println("   - PUT    http://localhost:8080/questions/{id}");
        System.out.println("   - DELETE http://localhost:8080/questions/{id}");
        System.out.println("   - POST   http://localhost:8080/register");
    }

    // --- Improved CORS Handler ---
    static void handleCORS(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }
    }

    // --- /questions endpoint ---
    static class QuestionsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            handleCORS(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) return;

            String method = exchange.getRequestMethod();
            String path = exchange.getRequestURI().getPath();
            String[] parts = path.split("/");

            System.out.println("📥 Request: " + method + " " + path);

            try {
                switch (method.toUpperCase()) {
                    case "GET":
                        handleGetQuestions(exchange);
                        break;
                    case "POST":
                        handlePostQuestion(exchange);
                        break;
                    case "PUT":
                        if (parts.length == 3) {
                            handlePutQuestion(exchange, Integer.parseInt(parts[2]));
                        } else {
                            sendError(exchange, 400, "Invalid URL format for PUT");
                        }
                        break;
                    case "DELETE":
                        if (parts.length == 3) {
                            handleDeleteQuestion(exchange, Integer.parseInt(parts[2]));
                        } else {
                            sendError(exchange, 400, "Invalid URL format for DELETE");
                        }
                        break;
                    default:
                        sendError(exchange, 405, "Method not allowed");
                }
            } catch (NumberFormatException e) {
                sendError(exchange, 400, "Invalid question ID");
            } catch (Exception e) {
                e.printStackTrace();
                sendError(exchange, 500, "Server error: " + e.getMessage());
            }
        }

        private void handleGetQuestions(HttpExchange exchange) throws IOException {
            List<Question> questions = QuestionDAO.getAllQuestions();
            JSONArray arr = new JSONArray();
            for (Question q : questions) {
                JSONObject obj = new JSONObject();
                obj.put("id", q.getId());
                obj.put("question", q.getQuestion());
                obj.put("option1", q.getOption1());
                obj.put("option2", q.getOption2());
                obj.put("option3", q.getOption3());
                obj.put("option4", q.getOption4());
                obj.put("answer", q.getAnswer());
                arr.put(obj);
            }
            System.out.println("✅ Returned " + questions.size() + " questions");
            sendResponse(exchange, 200, arr.toString());
        }

        private void handlePostQuestion(HttpExchange exchange) throws IOException {
            String body = new String(exchange.getRequestBody().readAllBytes());
            JSONObject obj = new JSONObject(body);

            Question q = new Question(
                    0,
                    obj.getString("question"),
                    obj.getString("option1"),
                    obj.getString("option2"),
                    obj.getString("option3"),
                    obj.getString("option4"),
                    obj.getString("answer")
            );

            boolean added = QuestionDAO.addQuestion(q);
            JSONObject response = new JSONObject();
            response.put("success", added);
            response.put("message", added ? "Question added!" : "Error adding question.");
            System.out.println(added ? "✅ Question added" : "❌ Failed to add question");
            sendResponse(exchange, 200, response.toString());
        }

        private void handlePutQuestion(HttpExchange exchange, int id) throws IOException {
            String body = new String(exchange.getRequestBody().readAllBytes());
            JSONObject obj = new JSONObject(body);

            Question q = new Question(
                    id,
                    obj.getString("question"),
                    obj.getString("option1"),
                    obj.getString("option2"),
                    obj.getString("option3"),
                    obj.getString("option4"),
                    obj.getString("answer")
            );

            boolean updated = QuestionDAO.updateQuestion(q);
            JSONObject response = new JSONObject();
            response.put("success", updated);
            response.put("message", updated ? "Question updated!" : "Error updating question.");
            System.out.println(updated ? "✅ Question " + id + " updated" : "❌ Failed to update question " + id);
            sendResponse(exchange, 200, response.toString());
        }

        private void handleDeleteQuestion(HttpExchange exchange, int id) throws IOException {
            boolean deleted = QuestionDAO.deleteQuestion(id);
            JSONObject response = new JSONObject();
            response.put("success", deleted);
            response.put("message", deleted ? "Question deleted!" : "Error deleting question.");
            System.out.println(deleted ? "✅ Question " + id + " deleted" : "❌ Failed to delete question " + id);
            sendResponse(exchange, 200, response.toString());
        }
    }

    // --- /register endpoint ---
    static class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            handleCORS(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) return;

            System.out.println("📥 Request: " + exchange.getRequestMethod() + " /register");

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendError(exchange, 405, "Method not allowed");
                return;
            }

            try {
                String body = new String(exchange.getRequestBody().readAllBytes());
                System.out.println("📨 Received body: " + body);

                JSONObject obj = new JSONObject(body);
                String username = obj.optString("username", "").trim();
                String email = obj.optString("email", "").trim();

                JSONObject response = new JSONObject();

                if (username.isEmpty() || email.isEmpty()) {
                    response.put("success", false);
                    response.put("message", "Username and email cannot be empty.");
                    System.out.println("❌ Empty credentials");
                } else {
                    User user = UserDAO.getUserByUsernameEmail(username, email);

                    if (user != null) {
                        // ✅ Login success
                        response.put("success", true);
                        response.put("username", user.getUsername());
                        response.put("email", user.getEmail());
                        response.put("isAdmin", user.getIsAdmin());
                        response.put("message", "Login successful!");
                        System.out.println("✅ User logged in: " + username);
                    } else {
                        // 🆕 Auto-register normal user
                        User newUser = new User(0, username, email, false);
                        boolean added = UserDAO.addUser(newUser);

                        if (added) {
                            response.put("success", true);
                            response.put("username", username);
                            response.put("email", email);
                            response.put("isAdmin", false);
                            response.put("message", "User registered successfully!");
                            System.out.println("🆕 New user registered: " + username);
                        } else {
                            response.put("success", false);
                            response.put("message", "Failed to register user.");
                            System.out.println("❌ Failed to register: " + username);
                        }
                    }
                }

                sendResponse(exchange, 200, response.toString());
            } catch (Exception e) {
                e.printStackTrace();
                sendError(exchange, 500, "Server error: " + e.getMessage());
            }
        }
    }

    // --- Utility methods ---
    private static void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        byte[] bytes = response.getBytes("UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static void sendError(HttpExchange exchange, int statusCode, String message) throws IOException {
        JSONObject error = new JSONObject();
        error.put("success", false);
        error.put("message", message);
        sendResponse(exchange, statusCode, error.toString());
    }
}
