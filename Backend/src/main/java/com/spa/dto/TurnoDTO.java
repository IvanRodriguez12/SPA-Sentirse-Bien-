package com.spa.dto;

import com.spa.model.Turno;
import com.spa.model.Cliente;
import com.spa.model.Servicio;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public class TurnoDTO {
    private Long id;
    private String horaInicio;
    private String clienteNombre;
    private List<String> servicios;
    private String profesionalNombre;

    public TurnoDTO(Turno turno) {
        this.id = turno.getId();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        this.horaInicio = turno.getFechaHora() != null
            ? turno.getFechaHora().format(formatter)
            : "Sin hora";

        this.clienteNombre = turno.getCliente() != null
            ? turno.getCliente().getNombre()
            : "Sin cliente";

        this.profesionalNombre = turno.getProfesionales() != null
            ? turno.getProfesionales().stream()
                .map(Cliente::getNombre)
                .collect(Collectors.joining(", "))
            : "Sin profesional";

        this.servicios = turno.getServicios() != null
            ? turno.getServicios().stream()
                .map(Servicio::getNombre)
                .collect(Collectors.toList())
            : List.of();
    }

    // Getters y setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getHoraInicio() { return horaInicio; }
    public void setHoraInicio(String horaInicio) { this.horaInicio = horaInicio; }

    public String getClienteNombre() { return clienteNombre; }
    public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }

    public List<String> getServicios() { return servicios; }
    public void setServicios(List<String> servicios) { this.servicios = servicios; }

    public String getProfesionalNombre() { return profesionalNombre; }
    public void setProfesionalNombre(String profesionalNombre) { this.profesionalNombre = profesionalNombre; }
}
