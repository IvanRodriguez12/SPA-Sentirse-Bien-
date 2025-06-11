package com.spa.controller;

import com.spa.dto.TurnoRequest;
import com.spa.model.Turno;
import com.spa.service.TurnoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.spa.dto.ReporteProfesionalDTO;
import com.spa.dto.ReporteServicioDTO;
import java.time.LocalDate;

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

    @GetMapping("/reportes/servicios")
    public List<ReporteServicioDTO> reportePorServicio(@RequestParam LocalDate desde, @RequestParam LocalDate hasta) {
        return turnoService.calcularTotalesPorServicio(desde, hasta);
    }

    @GetMapping("/reportes/profesionales")
    public List<ReporteProfesionalDTO> reportePorProfesional(@RequestParam LocalDate desde, @RequestParam LocalDate hasta) {
        return turnoService.calcularTotalesPorProfesional(desde, hasta);
    }
}
