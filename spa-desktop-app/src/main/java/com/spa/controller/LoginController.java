package com.spa.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

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

public class LoginController {

    @FXML
    private TextField emailField;

    @FXML
    private PasswordField passwordField;

    private void mostrarAlerta(String titulo, String cabecera, String mensaje) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(titulo);
        alert.setHeaderText(cabecera);
        alert.setContentText(mensaje);
        alert.showAndWait();
    }

    @FXML
    protected void onLogin(ActionEvent event) {
        try {
            String email = emailField.getText();
            String password = passwordField.getText();

            String url = AppConfig.BASE_URL + "/api/auth/login-profesional";
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setDoOutput(true);

            // Enviar JSON
            String json = String.format("{\"email\":\"%s\", \"contrasena\":\"%s\"}", email, password);
            try (OutputStream os = con.getOutputStream()) {
                byte[] input = json.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            // Leer respuesta
            int responseCode = con.getResponseCode();
            BufferedReader in = new BufferedReader(new InputStreamReader(
                responseCode >= 200 && responseCode < 300
                    ? con.getInputStream()
                    : con.getErrorStream()
            ));
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

                // Verificar si es administrador
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

                // Verificar si es profesional
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

                mostrarAlerta("Login", "Usuario válido", "Login correcto, pero sin panel asignado.");
            } else {
                mostrarAlerta("Error", "Login fallido", response.toString());
            }

        } catch (Exception e) {
            mostrarAlerta("Error", "No se pudo iniciar sesión", e.getMessage());
        }
    }

    @FXML
    protected void abrirRegistroProfesional(ActionEvent event) {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/spa/view/RegisterProfesional.fxml"));
            Parent root = loader.load();
            Stage stage = (Stage) emailField.getScene().getWindow();
            stage.setScene(new Scene(root));
        } catch (Exception e) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("Error");
            alert.setHeaderText("No se pudo cargar la vista de registro de profesional");
            alert.setContentText(e.getMessage());
            alert.showAndWait();
        }
    }

    protected void mostrarErrorDesdeConexion(HttpURLConnection conn) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getErrorStream()))) {
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("Error en registro");
            alert.setHeaderText("Respuesta del servidor");
            alert.setContentText(response.toString());
            alert.showAndWait();
        } catch (Exception e) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("Error inesperado");
            alert.setHeaderText("No se pudo leer el mensaje de error del servidor");
            alert.setContentText(e.getMessage());
            alert.showAndWait();
        }
    }
}
