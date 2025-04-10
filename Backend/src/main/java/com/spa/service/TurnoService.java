package com.spa.service;

import com.spa.model.Turno;
import com.spa.repository.TurnoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TurnoService {

    private final TurnoRepository turnoRepository;

    public TurnoService(TurnoRepository turnoRepository) {
        this.turnoRepository = turnoRepository;
    }

    public Turno guardarTurno(Turno turno) {
        return turnoRepository.save(turno);
    }

    public List<Turno> listarTurnos() {
        return turnoRepository.findAll();
    }
}
