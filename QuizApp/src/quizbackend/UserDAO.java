package quizbackend;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class UserDAO {

    public static boolean addUser(User user) {
        String sql = "INSERT INTO users (username, email, isAdmin) VALUES (?, ?, ?)";
        Connection con = DBConnection.getConnection();
        if (con == null) return false;
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getEmail());
            ps.setBoolean(3, user.getIsAdmin()); // set admin flag
            return ps.executeUpdate() > 0;
        } catch (Exception e) { e.printStackTrace(); return false; }
    }

    public static User getUserByUsernameEmail(String username, String email) {
        String sql = "SELECT * FROM users WHERE username = ? AND email = ?";
        Connection con = DBConnection.getConnection();
        if (con == null) return null;
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, username);
            ps.setString(2, email);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new User(
                        rs.getInt("id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getBoolean("isAdmin") // read admin flag
                );
            }
        } catch (Exception e) { e.printStackTrace(); }
        return null;
    }
}
