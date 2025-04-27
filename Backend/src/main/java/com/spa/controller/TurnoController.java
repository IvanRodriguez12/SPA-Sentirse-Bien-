package com.spa.controller;

import com.spa.model.Servicio;
import com.spa.model.Turno;
import com.spa.model.Cliente;
import com.spa.repository.ClienteRepository;
import com.spa.repository.ServicioRepository;
import com.spa.service.TurnoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turnos")
@CrossOrigin(origins = "*")
public class TurnoController {

    private final TurnoService turnoService;
    private final ClienteRepository clienteRepository;
    private final ServicioRepository servicioRepository;

    public TurnoController(TurnoService turnoService,
                           ClienteRepository clienteRepository,
                           ServicioRepository servicioRepository) {
        this.turnoService = turnoService;
        this.clienteRepository = clienteRepository;
        this.servicioRepository = servicioRepository;
    }

    @PostMapping("/crear")
    public Turno crearTurno(@RequestBody Turno turno) {
        // Buscar cliente y servicio por ID antes de guardar el turno
        Cliente cliente = clienteRepository.findById(turno.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + turno.getCliente().getId()));
        Servicio servicio = servicioRepository.findById(turno.getServicio().getId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + turno.getServicio().getId()));

        turno.setCliente(cliente);
        turno.setServicio(servicio);

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

