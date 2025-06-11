package com.spa.dto;

public class ReporteProfesionalDTO {
    private String profesional;
    private Double totalPagado;

    public ReporteProfesionalDTO(String profesional, Double totalPagado) {
        this.profesional = profesional;
        this.totalPagado = totalPagado;
    }

    public String getProfesional() {
        return profesional;
    }

    public void setProfesional(String profesional) {
        this.profesional = profesional;
    }

    public Double getTotalPagado() {
        return totalPagado;
    }

    public void setTotalPagado(Double totalPagado) {
        this.totalPagado = totalPagado;
    }
}
