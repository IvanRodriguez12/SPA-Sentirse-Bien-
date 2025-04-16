package com.spa.service;

import com.spa.model.Cliente;
import com.spa.model.Servicio;
import com.spa.model.Turno;
import com.spa.repository.ClienteRepository;
import com.spa.repository.ServicioRepository;
import com.spa.repository.TurnoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    // Crear turno
    public Turno guardarTurno(Turno turno) {
        Optional<Cliente> cliente = clienteRepository.findById(turno.getCliente().getId());
        Optional<Servicio> servicio = servicioRepository.findById(turno.getServicio().getId());

        if (cliente.isPresent() && servicio.isPresent()) {
            turno.setCliente(cliente.get());
            turno.setServicio(servicio.get());
            return turnoRepository.save(turno);
        }

        throw new RuntimeException("Cliente o Servicio no encontrado");
    }

    // Listar todos los turnos
    public List<Turno> listarTurnos() {
        return turnoRepository.findAll();
    }

    // Obtener turno por ID
    public Turno obtenerTurnoPorId(Long id) {
        return turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado con ID: " + id));
    }

    // Eliminar turno
    public void eliminarTurno(Long id) {
        if (!turnoRepository.existsById(id)) {
            throw new RuntimeException("No se encontró el turno con ID: " + id);
        }
        turnoRepository.deleteById(id);
    }

    // Actualizar turno
    public Turno actualizarTurno(Long id, Turno turnoActualizado) {
        Turno turnoExistente = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado con ID: " + id));

        Optional<Cliente> cliente = clienteRepository.findById(turnoActualizado.getCliente().getId());
        Optional<Servicio> servicio = servicioRepository.findById(turnoActualizado.getServicio().getId());

        if (cliente.isPresent() && servicio.isPresent()) {
            turnoExistente.setCliente(cliente.get());
            turnoExistente.setServicio(servicio.get());
            turnoExistente.setFechaHora(turnoActualizado.getFechaHora());
            return turnoRepository.save(turnoExistente);
        }

        throw new RuntimeException("Cliente o Servicio no encontrado para la actualización");
    }
}


