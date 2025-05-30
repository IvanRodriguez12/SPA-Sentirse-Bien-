package com.spa.controller;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.spa.util.AppConfig;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import java.io.OutputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class LoginController {

    @FXML
    private TextField emailField;

    @FXML
    private PasswordField passwordField;

    @FXML
    protected void onLogin(ActionEvent event) {
        try {
            String email = emailField.getText();
            String password = passwordField.getText();

            String url = AppConfig.BASE_URL + "/api/auth/login-profesional";
            HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setDoOutput(true);

            // JSON
            String json = String.format("{\"email\":\"%s\", \"contrasena\":\"%s\"}", email, password);
            try (OutputStream os = con.getOutputStream()) {
                byte[] input = json.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            int responseCode = con.getResponseCode();
            BufferedReader in = new BufferedReader(new InputStreamReader(
                    responseCode >= 200 && responseCode < 300 ? con.getInputStream() : con.getErrorStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                response.append(line);
            }
            in.close();

            if (responseCode == 200) {
                Gson gson = new Gson();
                JsonObject jsonObject = gson.fromJson(response.toString(), JsonObject.class);

                String token = jsonObject.get("token").getAsString();
                JsonObject cliente = jsonObject.getAsJsonObject("cliente");
                String nombre = cliente.get("nombre").getAsString();
                JsonElement profesionElement = jsonObject.get("profesion");

                // Lógica de tipo de usuario
                if (nombre.equalsIgnoreCase("Ana Felicidad")) {
                    FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/spa/view/AdminDashboard.fxml"));
                    Parent root = loader.load();
                    AdminDashboardController controller = loader.getController();
                    controller.setAuthToken(token);
                    Stage stage = (Stage) emailField.getScene().getWindow();
                    stage.setScene(new Scene(root));
                    stage.setTitle("Panel Administrador");
                    stage.show();
                    return;
                }

                if (profesionElement != null && !profesionElement.isJsonNull()) {
                    FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/spa/view/ProfesionalDashboard.fxml"));
                    Parent root = loader.load();
                    ProfesionalDashboardController controller = loader.getController();
                    controller.setAuthToken(token);
                    controller.setNombreProfesional(nombre);
                    Stage stage = (Stage) emailField.getScene().getWindow();
                    stage.setScene(new Scene(root));
                    stage.setTitle("Panel Profesional");
                    stage.show();
                    return;
                }

                mostrarAlerta("Login válido", "Cliente autenticado", "Login correcto, sin vista específica configurada.");

            } else {
                mostrarAlerta("Login fallido", "Respuesta del servidor", response.toString());
            }
        } catch (Exception e) {
            mostrarAlerta("Error", "No se pudo iniciar sesión", e.getMessage());
        }
    }

    private void mostrarAlerta(String titulo, String cabecera, String mensaje) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(titulo);
        alert.setHeaderText(cabecera);
        alert.setContentText(mensaje);
        alert.showAndWait();
    }

    @FXML
    protected void abrirRegistroProfesional(ActionEvent event) {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/spa/view/RegisterProfesional.fxml"));
            Parent root = loader.load();
            Stage stage = (Stage) emailField.getScene().getWindow();
            stage.setScene(new Scene(root));
        } catch (Exception e) {
            mostrarAlerta("Error", "No se pudo abrir el registro", e.getMessage());
        }
    }
}
