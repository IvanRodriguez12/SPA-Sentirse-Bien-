package com.spa.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TurnoRequest {
    private LocalDateTime fechaHora;
    private List<Long> servicioIds;

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public List<Long> getServicioIds() {
        return servicioIds;
    }

    public void setServicioIds(List<Long> servicioIds) {
        this.servicioIds = servicioIds;
    }
}
