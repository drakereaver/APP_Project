package quizbackend;

import java.util.List;
import java.util.Scanner;

public class QuestionManager {

    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        while (true) {
            System.out.println("\n--- Question Manager ---");
            System.out.println("1. View all questions");
            System.out.println("2. Add a question");
            System.out.println("3. Delete a question");
            System.out.println("4. Exit");
            System.out.print("Choose an option: ");
            int choice = Integer.parseInt(scanner.nextLine());

            switch (choice) {
                case 1 -> viewAllQuestions();
                case 2 -> addQuestion();
                case 3 -> deleteQuestion();
                case 4 -> {
                    System.out.println("Exiting...");
                    return;
                }
                default -> System.out.println("Invalid option! Try again.");
            }
        }
    }

    private static void viewAllQuestions() {
        List<Question> questions = QuestionDAO.getAllQuestions();
        if (questions.isEmpty()) {
            System.out.println("No questions found.");
            return;
        }
        for (Question q : questions) {
            System.out.printf("ID: %d | %s\n1) %s 2) %s 3) %s 4) %s | Answer: %s\n",
                    q.getId(), q.getQuestion(),
                    q.getOption1(), q.getOption2(), q.getOption3(), q.getOption4(),
                    q.getAnswer());
        }
    }

    private static void addQuestion() {
        System.out.print("Enter question: ");
        String question = scanner.nextLine();
        System.out.print("Option 1: ");
        String o1 = scanner.nextLine();
        System.out.print("Option 2: ");
        String o2 = scanner.nextLine();
        System.out.print("Option 3: ");
        String o3 = scanner.nextLine();
        System.out.print("Option 4: ");
        String o4 = scanner.nextLine();
        System.out.print("Answer: ");
        String ans = scanner.nextLine();

        Question q = new Question(0, question, o1, o2, o3, o4, ans);
        boolean added = QuestionDAO.addQuestion(q);

        if (added) System.out.println("Question added successfully!");
        else System.out.println("Failed to add question.");
    }

    private static void deleteQuestion() {
        System.out.print("Enter ID of question to delete: ");
        int id = Integer.parseInt(scanner.nextLine());
        boolean deleted = QuestionDAO.deleteQuestion(id);
        if (deleted) System.out.println("Question deleted successfully!");
        else System.out.println("Failed to delete question. Check ID.");
    }
}
