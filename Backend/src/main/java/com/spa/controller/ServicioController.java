package com.spa.controller;

import com.spa.model.Servicio;
import com.spa.service.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin("*")
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    @GetMapping("/listar")
    public ResponseEntity<List<Servicio>> listarServiciosPorCategoria(@RequestParam(required = false) Long categoriaId) {
        List<Servicio> servicios;
        if (categoriaId != null) {
            servicios = servicioService.obtenerServiciosPorCategoria(categoriaId);
        } else {
            servicios = servicioService.obtenerTodos();
        }
        return ResponseEntity.ok(servicios);
    }

    @PostMapping("/crear")
    public ResponseEntity<Servicio> crearServicio(@RequestBody Servicio servicio) {
        if (servicio.getDuracion() == null || servicio.getDuracion() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        Servicio nuevoServicio = servicioService.crearServicio(servicio);
        if (nuevoServicio != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoServicio);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @GetMapping("/detalle/{id}")
    public ResponseEntity<Servicio> obtenerServicio(@PathVariable Long id) {
        Optional<Servicio> servicio = servicioService.obtenerPorId(id);
        if (servicio.isPresent()) {
            return ResponseEntity.ok(servicio.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Servicio> actualizarServicio(@PathVariable Long id, @RequestBody Servicio servicio) {
        if (servicio.getDuracion() == null || servicio.getDuracion() <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        Servicio servicioActualizado = servicioService.actualizarServicio(id, servicio);
        if (servicioActualizado != null) {
            return ResponseEntity.ok(servicioActualizado);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarServicio(@PathVariable Long id) {
        servicioService.eliminarServicio(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}