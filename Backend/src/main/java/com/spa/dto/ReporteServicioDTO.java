package com.spa.dto;

public class ReporteServicioDTO {
    private String servicio;
    private Double totalPagado;

    public ReporteServicioDTO(String servicio, Double totalPagado) {
        this.servicio = servicio;
        this.totalPagado = totalPagado;
    }

    public String getServicio() {
        return servicio;
    }

    public void setServicio(String servicio) {
        this.servicio = servicio;
    }

    public Double getTotalPagado() {
        return totalPagado;
    }

    public void setTotalPagado(Double totalPagado) {
        this.totalPagado = totalPagado;
    }
}
