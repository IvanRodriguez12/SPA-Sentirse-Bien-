package com.spa.service;

import com.spa.model.Cliente;
import com.spa.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Cliente registrarCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public Optional<Cliente> buscarPorEmail(String email) { return clienteRepository.findByEmail(email);
    }

    public Cliente login(String email, String password) {
        return clienteRepository.findByEmail(email)
                .filter(c -> c.getContrasena().equals(password))
                .orElse(null);
    }
}

