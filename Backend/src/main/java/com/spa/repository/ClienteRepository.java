package com.spa.repository;

import java.util.List;
import java.util.Optional;
import com.spa.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Cliente> findByProfesion(String profesion);
    Optional<Cliente> findByVerificacionToken(String token);
}

