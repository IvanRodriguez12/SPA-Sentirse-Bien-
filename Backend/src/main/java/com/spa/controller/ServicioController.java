package com.spa.controller;

import com.spa.model.Servicio;
import com.spa.service.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin("*")
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    @GetMapping
    public List<Servicio> listarServicios() {
        return servicioService.obtenerTodos();
    }

    @PostMapping
    public Servicio crearServicio(@RequestBody Servicio servicio) {
        return servicioService.crearServicio(servicio);
    }

    @GetMapping("/{id}")
    public Optional<Servicio> obtenerServicio(@PathVariable Long id) {
        return servicioService.obtenerPorId(id);
    }

    @PutMapping("/{id}")
    public Servicio actualizarServicio(@PathVariable Long id, @RequestBody Servicio servicio) {
        return servicioService.actualizarServicio(id, servicio);
    }

    @DeleteMapping("/{id}")
    public void eliminarServicio(@PathVariable Long id) {
        servicioService.eliminarServicio(id);
    }
}

