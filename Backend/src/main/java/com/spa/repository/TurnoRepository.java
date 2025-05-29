package com.spa.repository;

import com.spa.model.Cliente;
import com.spa.model.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface TurnoRepository extends JpaRepository<Turno, Long> {
    @Query("SELECT DISTINCT t FROM Turno t JOIN FETCH t.cliente LEFT JOIN FETCH t.servicios WHERE t.id = :id")
    Optional<Turno> findByIdWithDetails(@Param("id") Long id);

    @Transactional
    @Modifying
    @Query("DELETE FROM Turno t WHERE t.cliente.id = :clienteId")
    void deleteByClienteId(@Param("clienteId") Long clienteId);

    List<Turno> findByClienteId(Long clienteId);
    List<Turno> findByProfesionalesContaining(Cliente profesional);
}

