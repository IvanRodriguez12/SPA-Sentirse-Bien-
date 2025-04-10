package com.spa.controller;

import com.spa.model.Servicio;
import com.spa.service.ServicioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {

    private final ServicioService servicioService;

    public ServicioController(ServicioService servicioService) {
        this.servicioService = servicioService;
    }

    @GetMapping
    public List<Servicio> listarServicios() {
        return servicioService.listarServicios();
    }

    @PostMapping
    public Servicio crearServicio(@RequestBody Servicio servicio) {
        return servicioService.guardarServicio(servicio);
    }
}
