package com.spa.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONObject;

public class RegisterProfesionalController {

    @FXML
    private TextField nombreField;
    @FXML
    private TextField emailField;
    @FXML
    private TextField telefonoField;
    @FXML
    private PasswordField contrasenaField;
    @FXML
    private TextField profesionField;

    private final String apiUrl = "https://spa-sentirse-bien-production.up.railway.app/api/auth/registrar-profesional";

    @FXML
    protected void onRegistrarProfesional(ActionEvent event) {
        try {
            JSONObject requestJson = new JSONObject();
            requestJson.put("nombre", nombreField.getText());
            requestJson.put("email", emailField.getText());
            requestJson.put("telefono", telefonoField.getText());
            requestJson.put("contrasena", contrasenaField.getText());
            requestJson.put("profesion", profesionField.getText());

            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(requestJson.toString().getBytes());
                os.flush();
            }

            int responseCode = conn.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                showAlert("Registro exitoso", "El profesional fue registrado correctamente.");
                volverAlLogin();
            } else {
                mostrarErrorDesdeConexion(conn);
            }

        } catch (Exception e) {
            e.printStackTrace();
            showAlert("Error", "Ocurrió un error: " + e.getMessage());
        }
    }

    @FXML
    protected void volverAlLogin() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/spa/view/LoginView.fxml"));
            Parent root = loader.load();
            Stage stage = (Stage) nombreField.getScene().getWindow();
            stage.setScene(new Scene(root));
        } catch (Exception e) {
            showAlert("Error", "No se pudo volver al login: " + e.getMessage());
        }
    }

    private void showAlert(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    private void mostrarErrorDesdeConexion(HttpURLConnection conn) {
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