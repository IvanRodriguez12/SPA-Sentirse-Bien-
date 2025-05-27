package com.spa.controller;

import com.google.gson.reflect.TypeToken;
import com.google.gson.Gson;
import com.spa.util.AppConfig;
import javafx.fxml.FXML;
import javafx.scene.control.ListView;
import javafx.scene.control.Label;
import javafx.print.PrinterJob;
import javafx.scene.text.Text;
import javafx.scene.text.TextFlow;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ClassicHttpResponse;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class ProfesionalDashboardController {

    @FXML private Label labelProfesional;
    @FXML private ListView<String> turnosList;

    private String authToken;
    private String nombreProfesional;

    public void setAuthToken(String token) {
        this.authToken = token;
        cargarTurnosManana();
    }

    public void setNombreProfesional(String nombre) {
        this.nombreProfesional = nombre;
        labelProfesional.setText("Bienvenido, " + nombre);
    }

    private void cargarTurnosManana() {
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpGet request = new HttpGet(AppConfig.TURNOS_MANANA_URL);
            request.setHeader("Authorization", "Bearer " + authToken);

            ClassicHttpResponse response = (ClassicHttpResponse) client.execute(request);
            int statusCode = response.getCode();
            if (statusCode == 200) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
                Type listType = new TypeToken<List<String>>(){}.getType();
                List<String> turnos = new Gson().fromJson(reader, listType);
                turnosList.getItems().setAll(turnos);
            } else {
                turnosList.getItems().add("Error al cargar turnos (" + statusCode + ")");
            }
        } catch (Exception e) {
            turnosList.getItems().add("Error al conectar con el servidor");
        }
    }

    @FXML
    private void handlePrint() {
        TextFlow content = new TextFlow();
        for (String turno : turnosList.getItems()) {
            content.getChildren().add(new Text(turno + "\n"));
        }

        PrinterJob job = PrinterJob.createPrinterJob();
        if (job != null && job.showPrintDialog(turnosList.getScene().getWindow())) {
            boolean success = job.printPage(content);
            if (success) {
                job.endJob();
            }
        }
    }

    @FXML
    private void handleVerTurnosDelDia() {
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpGet request = new HttpGet(AppConfig.TURNOS_DEL_DIA_URL);
            request.setHeader("Authorization", "Bearer " + authToken);

            ClassicHttpResponse response = (ClassicHttpResponse) client.execute(request);
            int statusCode = response.getCode();
            if (statusCode == 200) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
                Type listType = new TypeToken<List<TurnoDetalle>>(){}.getType();
                List<TurnoDetalle> turnos = new Gson().fromJson(reader, listType);

                List<String> formateados = turnos.stream()
                        .sorted(Comparator.comparing(t -> t.servicio))
                        .map(t -> String.format("%s - %s - Cliente: %s - Profesional: %s", t.fecha, t.servicio, t.cliente, t.profesional))
                        .collect(Collectors.toList());

                turnosList.getItems().setAll(formateados);
            } else {
                turnosList.getItems().add("Error al cargar turnos del día (" + statusCode + ")");
            }
        } catch (Exception e) {
            turnosList.getItems().add("Error al conectar con el servidor");
        }
    }

    private static class TurnoDetalle {
        String fecha;
        String servicio;
        String cliente;
        String profesional;
    }
}