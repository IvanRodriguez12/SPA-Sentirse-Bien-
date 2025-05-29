package com.spa.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.control.Alert;
import javafx.stage.Stage;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;

public class LoginController {

    @FXML
    private TextField emailField;

    @FXML
    private PasswordField passwordField;

    @FXML
    protected void onLogin(ActionEvent event) {
        // Lógica de login existente
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
