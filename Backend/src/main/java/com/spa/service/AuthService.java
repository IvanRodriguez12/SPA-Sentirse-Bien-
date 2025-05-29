package com.spa.service;

import com.spa.Security.JwtUtil;
import com.spa.dto.AuthResponse;
import com.spa.dto.LoginRequest;
import com.spa.dto.RegisterRequest;
import com.spa.model.Cliente;
import com.spa.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        try {
            if (request.getNombre() == null || request.getEmail() == null || 
            request.getTelefono() == null || request.getContrasena() == null) {
            return new AuthResponse("Todos los campos son obligatorios", null, null);
            }

            if (clienteRepository.existsByEmail(request.getEmail())) {
                return new AuthResponse("Email ya registrado", null, null);
            }

            Cliente cliente = new Cliente();
            cliente.setNombre(request.getNombre());
            cliente.setEmail(request.getEmail());
            cliente.setTelefono(request.getTelefono());
            cliente.setContrasena(passwordEncoder.encode(request.getContrasena()));
            cliente.setProfesion(request.getProfesion());
            System.out.println("Profesión recibida: " + request.getProfesion());

            clienteRepository.save(cliente);

            // Generate token with CLIENT role
            String token = jwtUtil.generarToken(cliente.getEmail(), "CLIENTE");

            return new AuthResponse("Registro exitoso", token, cliente);
        } catch (Exception e) {
            e.printStackTrace();
             System.err.println("Error en registro: " + e.getMessage());
            return new AuthResponse("Error interno del servidor", null, null);
        }
    }

    public AuthResponse login(LoginRequest request) {
        return clienteRepository.findByEmail(request.getEmail())
                .filter(cliente -> passwordEncoder.matches(request.getContrasena(), cliente.getContrasena()))
                .map(cliente -> {
                    // Generate token with CLIENT role
                    String token = jwtUtil.generarToken(cliente.getEmail(), "CLIENTE");
                    return new AuthResponse("Inicio de sesión exitoso", token, cliente);
                })
                .orElse(new AuthResponse("Credenciales inválidas", null, null));
    }
}