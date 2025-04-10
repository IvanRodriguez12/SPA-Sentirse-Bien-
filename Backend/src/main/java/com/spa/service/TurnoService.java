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

    public List<Turno> listarTurnos() {
        return turnoRepository.findAll();
    }
}

