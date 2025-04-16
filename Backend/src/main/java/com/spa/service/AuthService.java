package com.spa.service;

import com.spa.dto.AuthResponse;
import com.spa.dto.LoginRequest;
import com.spa.dto.RegisterRequest;
import com.spa.model.Cliente;
import com.spa.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private ClienteRepository clienteRepository;

    public AuthResponse register(RegisterRequest request) {
        try {
            if (clienteRepository.existsByEmail(request.getEmail())) {
                return new AuthResponse("Email ya registrado");
            }
    
            Cliente cliente = new Cliente();
            cliente.setNombre(request.getNombre());
            cliente.setEmail(request.getEmail());
            cliente.setTelefono(request.getTelefono());
            cliente.setContrasena(request.getContrasena());
    
            clienteRepository.save(cliente);
    
            return new AuthResponse("Registro exitoso");
        } catch (Exception e) {
            // Log del error para depuración
            e.printStackTrace();
            return new AuthResponse("Error interno del servidor");
        }
    }

    public AuthResponse login(LoginRequest request) {
        return clienteRepository.findByEmail(request.getEmail())
                .filter(c -> c.getContrasena().equals(request.getContrasena()))
                .map(c -> new AuthResponse("Inicio de sesión exitoso"))
                .orElse(new AuthResponse("Credenciales inválidas"));
    }
}



