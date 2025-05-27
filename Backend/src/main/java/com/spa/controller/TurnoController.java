package com.spa.controller;

import com.spa.model.Servicio;
import com.spa.model.Turno;
import com.spa.model.Cliente;
import com.spa.repository.ClienteRepository;
import com.spa.repository.ServicioRepository;
import com.spa.service.TurnoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.spa.dto.TurnoRequest;

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
    public Turno crearTurno(@RequestBody TurnoRequest request) {
        System.out.println("⚙️ RECIBIDO: clienteId=" + request.getClienteId()
                + ", fechaHora=" + request.getFechaHora()
                + ", servicioIds=" + request.getServicioIds());
        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + request.getClienteId()));

        List<Servicio> servicios = servicioRepository.findAllById(request.getServicioIds());

        if (servicios.isEmpty()) {
            throw new RuntimeException("No se encontraron los servicios proporcionados.");
        }

        Turno turno = new Turno();
        turno.setCliente(cliente);
        turno.setServicios(servicios);
        turno.setFechaHora(request.getFechaHora());

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

