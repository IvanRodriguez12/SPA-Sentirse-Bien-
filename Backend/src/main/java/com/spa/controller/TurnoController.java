package com.spa.controller;

import com.spa.model.Turno;
import com.spa.service.TurnoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turnos")
@CrossOrigin(origins = "*")
public class TurnoController {

    private final TurnoService turnoService;

    public TurnoController(TurnoService turnoService) {
        this.turnoService = turnoService;
    }

    @PostMapping("/crear")
    public Turno crearTurno(@RequestBody Turno turno) {
        return turnoService.guardarTurno(turno);
    }


    @GetMapping("/listar")
    public List<Turno> listarTurnos() {
        return turnoService.listarTurnos();
    }


    @GetMapping("/{id}")
    public Turno obtenerTurnoPorId(@PathVariable Long id) {
        return turnoService.obtenerTurnoPorId(id);
    }


    @DeleteMapping("/eliminar/{id}")
    public void eliminarTurno(@PathVariable Long id) {
        turnoService.eliminarTurno(id);
    }


    @PutMapping("/editar/{id}")
    public Turno editarTurno(@PathVariable Long id, @RequestBody Turno turnoActualizado) {
        return turnoService.actualizarTurno(id, turnoActualizado);
    }
}

