package com.spa.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fechaHora;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties({"telefono", "contrasena", "hibernateLazyInitializer", "handler"})
    private Cliente cliente;

    @ManyToMany(fetch = FetchType.EAGER) // 🔹 Cambiado a EAGER para evitar LazyInitializationException
    @JoinTable(
            name = "turno_servicio",
            joinColumns = @JoinColumn(name = "turno_id"),
            inverseJoinColumns = @JoinColumn(name = "servicio_id")
    )
    @JsonIgnoreProperties({"descripcion", "turnos", "hibernateLazyInitializer", "handler"})
    private Set<Servicio> servicios = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "turno_profesional",
            joinColumns = @JoinColumn(name = "turno_id"),
            inverseJoinColumns = @JoinColumn(name = "profesional_id")
    )
    @JsonIgnoreProperties({"telefono", "contrasena", "hibernateLazyInitializer", "handler"})
    private Set<Cliente> profesionales = new HashSet<>();

    @Column(nullable = false)
    private String metodoPago; // "tarjeta", "efectivo", etc.

    @Column(nullable = false)
    private boolean pagado;

    // Getters y Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public Set<Servicio> getServicios() { return servicios; }
    public void setServicios(Set<Servicio> servicios) { this.servicios = servicios; }

    public Set<Cliente> getProfesionales() { return profesionales; }
    public void setProfesionales(Set<Cliente> profesionales) { this.profesionales = profesionales; }

    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

    public boolean isPagado() { return pagado; }
    public void setPagado(boolean pagado) { this.pagado = pagado; }
}
