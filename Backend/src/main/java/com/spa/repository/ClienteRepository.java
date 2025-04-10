package com.spa.repository;

import java.util.Optional;
import com.spa.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    boolean existsByEmail(String email);
    Optional<Cliente> findByEmail(String email);
}

