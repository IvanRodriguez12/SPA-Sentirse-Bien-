package com.spa.controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ClassicHttpResponse;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.spa.util.AppConfig;

import javafx.fxml.FXML;
import javafx.print.PrinterJob;
import javafx.scene.control.ListView;
import javafx.scene.text.Text;
import javafx.scene.text.TextFlow;

public class AdminDashboardController {

    @FXML
    private ListView<String> turnosListAdmin;

    private String authToken;

    public void setAuthToken(String token) {
        this.authToken = token;
    }

    @FXML
    private void handleVerTodosLosTurnos() {
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            String url = AppConfig.BASE_URL + "/api/turnos/listar";
            HttpGet request = new HttpGet(url);
            request.setHeader("Authorization", "Bearer " + authToken);

            ClassicHttpResponse response = (ClassicHttpResponse) client.execute(request);
            int statusCode = response.getCode();

            if (statusCode == 200) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
                Type listType = new TypeToken<List<TurnoDTO>>() {}.getType();
                List<TurnoDTO> turnos = new Gson().fromJson(reader, listType);

                List<String> formateados = turnos.stream()
                        .sorted(Comparator.comparing(t -> t.fechaHora))
                        .map(t -> {
                            String servicios = String.join(", ", t.servicios.stream().map(s -> s.nombre).collect(Collectors.toList()));
                            String profesionales = String.join(", ", t.profesionales.stream().map(p -> p.nombre + " (" + p.profesion + ")").collect(Collectors.toList()));
                            return String.format("[%s] Servicios: %s | Cliente: %s | Profesionales: %s",
                                    t.fechaHora, servicios, t.cliente.nombre, profesionales);
                        })
                        .collect(Collectors.toList());

                turnosListAdmin.getItems().setAll(formateados);
            } else {
                turnosListAdmin.getItems().add("Error al cargar turnos (código " + statusCode + ")");
            }
        } catch (Exception e) {
            turnosListAdmin.getItems().add("Error al conectar con el servidor: " + e.getMessage());
        }
    }

    @FXML
    private void handlePrint() {
        TextFlow content = new TextFlow();
        for (String turno : turnosListAdmin.getItems()) {
            content.getChildren().add(new Text(turno + "\n"));
        }

        PrinterJob job = PrinterJob.createPrinterJob();
        if (job != null && job.showPrintDialog(turnosListAdmin.getScene().getWindow())) {
            boolean success = job.printPage(content);
            if (success) {
                job.endJob();
            }
        }
    }

    // Clases internas DTO para deserialización

    private static class TurnoDTO {
        String fechaHora;
        ClienteDTO cliente;
        Set<ServicioDTO> servicios;
        Set<ProfesionalDTO> profesionales;
    }

    private static class ClienteDTO {
        String nombre;
    }

    private static class ServicioDTO {
        String nombre;
    }

    private static class ProfesionalDTO {
        String nombre;
        String profesion;
    }
}
