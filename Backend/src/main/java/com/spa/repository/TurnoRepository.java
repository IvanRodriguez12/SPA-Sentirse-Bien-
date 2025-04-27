package com.spa.repository;

import com.spa.model.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TurnoRepository extends JpaRepository<Turno, Long> {
    @Query("SELECT t FROM Turno t JOIN FETCH t.cliente JOIN FETCH t.servicio WHERE t.id = :id")
    Optional<Turno> findByIdWithDetails(@Param("id") Long id);

    List<Turno> findByClienteId(Long clienteId);
}

