package com.spa.service;

import com.spa.dto.TurnoRequest;
import com.spa.model.Cliente;
import com.spa.model.Servicio;
import com.spa.model.Turno;
import com.spa.repository.ClienteRepository;
import com.spa.repository.ServicioRepository;
import com.spa.repository.TurnoRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class TurnoService {

    private final TurnoRepository turnoRepository;
    private final ClienteRepository clienteRepository;
    private final ServicioRepository servicioRepository;

    public TurnoService(TurnoRepository turnoRepository, ClienteRepository clienteRepository, ServicioRepository servicioRepository) {
        this.turnoRepository = turnoRepository;
        this.clienteRepository = clienteRepository;
        this.servicioRepository = servicioRepository;
    }

    @Transactional
    public Turno guardarTurno(TurnoRequest turnoRequest) {
        // Obtener email desde el contexto de seguridad
        String emailCliente = SecurityContextHolder.getContext().getAuthentication().getName();

        Optional<Cliente> clienteOptional = clienteRepository.findByEmail(emailCliente);
        if (clienteOptional.isEmpty()) {
            throw new IllegalArgumentException("Cliente no encontrado con email: " + emailCliente);
        }

        List<Servicio> servicios = servicioRepository.findAllById(turnoRequest.getServicioIds());
        if (servicios.size() != turnoRequest.getServicioIds().size()) {
            throw new IllegalArgumentException("Algunos servicios no fueron encontrados.");
        }

        Turno turno = new Turno();
        turno.setCliente(clienteOptional.get());
        turno.setFechaHora(turnoRequest.getFechaHora());
        turno.setServicios(new HashSet<>(servicios));

        return turnoRepository.save(turno);
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

        List<Servicio> servicios = servicioRepository.findAllById(
                turnoActualizado.getServicios().stream().map(Servicio::getId).toList()
        );

        if (servicios.isEmpty()) {
            throw new RuntimeException("No se encontraron los servicios proporcionados.");
        }

        turnoExistente.setServicios(new HashSet<>(servicios));
        turnoExistente.setFechaHora(turnoActualizado.getFechaHora());

        return turnoRepository.save(turnoExistente);
    }

    private void validarTurno(Turno turno) {
        if (!clienteRepository.existsById(turno.getCliente().getId())) {
            throw new RuntimeException("Cliente no encontrado");
        }

        if (turno.getServicios() == null || turno.getServicios().isEmpty()) {
            throw new RuntimeException("Debe seleccionar al menos un servicio.");
        }

        List<Long> servicioIds = turno.getServicios().stream().map(Servicio::getId).toList();
        long serviciosEncontrados = servicioRepository.countByIdIn(servicioIds);

        if (serviciosEncontrados != servicioIds.size()) {
            throw new RuntimeException("Uno o más servicios no fueron encontrados.");
        }

        LocalDateTime fecha = turno.getFechaHora();
        if (fecha.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("No se puede reservar en fechas pasadas.");
        }

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