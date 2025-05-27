package com.spa.repository;

import com.spa.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {
    @Query("SELECT s FROM Servicio s WHERE s.categoria.id = :categoriaId")
    List<Servicio> findByCategoriaId(@Param("categoriaId") Long categoriaId);


    // Nuevo método para contar los servicios en una lista de IDs
    long countByIdIn(List<Long> ids);
}


