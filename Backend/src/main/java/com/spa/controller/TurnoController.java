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

    @PostMapping
    public Turno crearTurno(@RequestBody Turno turno) {
        return turnoService.guardarTurno(turno);
    }

    @GetMapping
    public List<Turno> listarTurnos() {
        return turnoService.listarTurnos();
    }
}
