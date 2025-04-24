package com.spa.controller;

import com.spa.model.Turno;
import com.spa.service.TurnoService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/turnos")
@CrossOrigin("*")
public class TurnoController {

    private final TurnoService turnoService;

    public TurnoController(TurnoService turnoService) {
        this.turnoService = turnoService;
    }

    // Crear turno (CLIENTE)
    @PostMapping("/crear")
    @PreAuthorize("hasRole('CLIENTE')")
    public Turno crearTurno(@RequestBody Turno turno) {
        return turnoService.guardarTurno(turno);
    }

    @GetMapping("/listar")
    public List<Turno> listarTodosLosTurnos() {
        return turnoService.listarTurnos();
    }

    // Ver turno por ID (ADMIN)
    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Turno obtenerTurnoPorId(@PathVariable Long id) {
        return turnoService.obtenerTurnoPorId(id);
    }

    // Eliminar turno (ADMIN)
    @DeleteMapping("/admin/eliminar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminarTurno(@PathVariable Long id) {
        turnoService.eliminarTurno(id);
    }

    // Editar turno (ADMIN)
    @PutMapping("/admin/editar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Turno editarTurno(@PathVariable Long id, @RequestBody Turno turnoActualizado) {
        return turnoService.actualizarTurno(id, turnoActualizado);
    }
}


