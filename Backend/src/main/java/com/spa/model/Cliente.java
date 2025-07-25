package com.spa.model;

import jakarta.persistence.*;

import java.util.Optional;

@Entity
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String telefono;


    @Column(nullable = false)
    private String contrasena;

    @Column(nullable = true)
    private String profesion;

    @Column(nullable = false)
    private boolean emailVerificado = false;

    @Column(nullable = true, length = 64)
    private String verificacionToken;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public String getProfesion() { return profesion;}
    public void setProfesion(String profesion) { this.profesion = profesion; }

    public boolean isEmailVerificado() { return emailVerificado; }
    public void setEmailVerificado(boolean emailVerificado) { this.emailVerificado = emailVerificado; }

    public String getVerificacionToken() { return verificacionToken; }
    public void setVerificacionToken(String verificacionToken) { this.verificacionToken = verificacionToken; }
}

