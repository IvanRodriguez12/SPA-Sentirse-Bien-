package com.spa.service;

import com.spa.model.Cliente;
import com.spa.repository.ClienteRepository;
import com.spa.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Cliente registrar(RegisterRequest request) {
        Cliente cliente = new Cliente();
        cliente.setNombre(request.getNombre());
        cliente.setEmail(request.getEmail());
        cliente.setContrasena(passwordEncoder.encode(request.getPassword()));
        return clienteRepository.save(cliente);
    }

    public Optional<Cliente> buscarPorEmail(String email) {
        return clienteRepository.findByEmail(email);
    }

    public boolean verificarCredenciales(String email, String password) {
        Optional<Cliente> clienteOpt = clienteRepository.findByEmail(email);
        return clienteOpt.isPresent() &&
                passwordEncoder.matches(password, clienteOpt.get().getContrasena());
    }
}


