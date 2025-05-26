package com.spa.repository;

import com.spa.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {
    List<Servicio> findByCategoriaId(Long categoriaId);

    // Nuevo método para contar los servicios en una lista de IDs
    long countByIdIn(List<Long> ids);
}


