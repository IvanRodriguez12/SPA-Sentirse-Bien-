package com.spa.service;

import com.spa.model.Cliente;
import com.spa.model.Servicio;
import com.spa.model.Turno;
import com.spa.repository.ClienteRepository;
import com.spa.repository.ServicioRepository;
import com.spa.repository.TurnoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TurnoService {

    private final TurnoRepository turnoRepository;
    private final ClienteRepository clienteRepository;
    private final ServicioRepository servicioRepository;
    private final ClienteService clienteService;
    private final ServicioService servicioService;

    public TurnoService(TurnoRepository turnoRepository,
                        ClienteRepository clienteRepository,
                        ServicioRepository servicioRepository,
                        ClienteService clienteService,
                        ServicioService servicioService) {
        this.turnoRepository = turnoRepository;
        this.clienteRepository = clienteRepository;
        this.servicioRepository = servicioRepository;
        this.clienteService = clienteService;
        this.servicioService = servicioService;
    }

    public Turno guardarTurno(Turno turno) {
        Cliente cliente = clienteRepository.findById(turno.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + turno.getCliente().getId()));

        Servicio servicio = servicioRepository.findById(turno.getServicio().getId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + turno.getServicio().getId()));

        turno.setCliente(cliente);
        turno.setServicio(servicio);

        validarTurno(turno);
        Turno turnoGuardado = turnoRepository.save(turno);

        // FORZAR CARGA COMPLETA ANTES DE RETORNARLO
        turnoGuardado.setCliente(cliente);
        turnoGuardado.setServicio(servicio);

        return turnoGuardado;
    }

    public List<Turno> listarTurnos() {
        return turnoRepository.findAll();
    }

    public List<Turno> listarTurnosPorCliente(Long clienteId) {
        if (!clienteRepository.existsById(clienteId)) {
            throw new RuntimeException("Cliente no encontrado con ID: " + clienteId);
        }
        return turnoRepository.findByClienteId(clienteId);
    }

    public Turno obtenerTurnoPorId(Long id) {
        return turnoRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado con ID: " + id));
    }

    public void eliminarTurno(Long id) {
        if (!turnoRepository.existsById(id)) {
            throw new RuntimeException("No se encontró el turno con ID: " + id);
        }
        turnoRepository.deleteById(id);
    }

    public Turno actualizarTurno(Long id, Turno turnoActualizado) {
        Turno turnoExistente = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado con ID: " + id));

        validarTurno(turnoActualizado);

        turnoExistente.setCliente(clienteRepository.findById(turnoActualizado.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado")));
        turnoExistente.setServicio(servicioRepository.findById(turnoActualizado.getServicio().getId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado")));
        turnoExistente.setFechaHora(turnoActualizado.getFechaHora());

        return turnoRepository.save(turnoExistente);
    }

    private void validarTurno(Turno turno) {
        // Validar que existan cliente y servicio
        if (!clienteRepository.existsById(turno.getCliente().getId())) {
            throw new RuntimeException("Cliente no encontrado");
        }
        if (!servicioRepository.existsById(turno.getServicio().getId())) {
            throw new RuntimeException("Servicio no encontrado");
        }

        // Validar fecha y hora
        LocalDateTime fecha = turno.getFechaHora();
        if (fecha.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("No se puede reservar en fechas pasadas");
        }

        // Validar horario de atención (8am a 8pm)
        int hora = fecha.getHour();
        if (hora < 8 || hora >= 20) {
            throw new IllegalArgumentException("Horario no válido (8:00 - 20:00)");
        }
    }

    public Cliente buscarClientePorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + id));
    }

    public Servicio buscarServicioPorId(Long id) {
        return servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));
    }
}