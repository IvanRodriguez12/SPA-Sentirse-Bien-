package com.spa.dto;

import com.spa.model.Cliente;

public class AuthResponse {
    private String mensaje;
    private String token;
    private Cliente cliente;

    public AuthResponse(String mensaje, String token, Cliente cliente) {
        this.mensaje = mensaje;
        this.token = token;
        this.cliente = cliente;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public String getProfesion() {
        return cliente != null ? cliente.getProfesion() : null;
    }
}





