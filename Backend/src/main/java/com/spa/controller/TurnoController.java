package com.spa.controller;

import com.spa.dto.TurnoRequest;
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
    public Turno crearTurno(@RequestBody TurnoRequest request) {
        return turnoService.guardarTurnoConAsignacion(request);
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

    @GetMapping("/profesional")
    public List<Turno> listarTurnosAsignadosAlProfesional(
            @RequestParam(name = "fecha", required = false, defaultValue = "ambos") String filtroFecha) {
        return turnoService.listarTurnosPorProfesionalAutenticado(filtroFecha);
    }
}
