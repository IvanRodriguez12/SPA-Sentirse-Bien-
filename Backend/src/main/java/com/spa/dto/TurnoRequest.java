package com.spa.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TurnoRequest {
    private LocalDateTime fechaHora;
    private List<Long> servicioIds;
    private String metodoPago;
    private boolean pagado;

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

    public String getMetodoPago() { return metodoPago; }

    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

    public boolean isPagado() { return pagado; }

    public void setPagado(boolean pagado) { this.pagado = pagado; }
}
