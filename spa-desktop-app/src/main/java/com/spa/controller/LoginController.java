package com.spa.controller;

import com.google.gson.Gson;
import com.spa.Main;
import com.spa.util.AppConfig;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.http.ClassicHttpResponse;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class LoginController {

    @FXML private TextField usernameField;
    @FXML private PasswordField passwordField;
    @FXML private Label errorLabel;

    @FXML
    private void handleLogin() {
        String user = usernameField.getText();
        String pass = passwordField.getText();

        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(AppConfig.LOGIN_URL);
            request.setHeader("Content-Type", "application/json");

            String json = new Gson().toJson(new LoginRequest(user, pass));
            request.setEntity(new StringEntity(json, StandardCharsets.UTF_8));

            ClassicHttpResponse response = (ClassicHttpResponse) client.execute(request);

            int statusCode = response.getCode();
            if (statusCode == 200) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
                AuthResponse auth = new Gson().fromJson(reader, AuthResponse.class);
                System.out.println("Login exitoso. Token: " + auth.token);
                errorLabel.setVisible(false);

                // Cargar vista según el rol
                String viewPath = auth.rol.equals("ADMIN") ? "/com/spa/view/AdminDashboard.fxml" : "/com/spa/view/ProfesionalDashboard.fxml";
                FXMLLoader loader = new FXMLLoader(getClass().getResource(viewPath));
                Parent dashboard = loader.load();

                // Pasar token y datos si es profesional
                if (!auth.rol.equals("ADMIN")) {
                    ProfesionalDashboardController controller = loader.getController();
                    controller.setAuthToken(auth.token);
                    controller.setNombreProfesional(auth.nombre);
                }

                Main.mainStage.setScene(new Scene(dashboard));
                Main.mainStage.setTitle("SPA - Panel " + auth.rol);

            } else {
                errorLabel.setText("Credenciales incorrectas (" + statusCode + ")");
                errorLabel.setVisible(true);
            }
        } catch (Exception e) {
            e.printStackTrace();
            errorLabel.setText("Error al conectar con el servidor");
            errorLabel.setVisible(true);
        }
    }

    // Clases auxiliares internas
    private static class LoginRequest {
        String email;
        String password;

        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }
    }

    private static class AuthResponse {
        String token;
        String rol;
        String nombre;
    }
}
