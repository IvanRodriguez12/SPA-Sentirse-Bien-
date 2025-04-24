package com.spa.service;

import com.spa.Security.JwtUtil;
import com.spa.dto.AuthResponse;
import com.spa.dto.LoginRequest;
import com.spa.dto.RegisterRequest;
import com.spa.model.Cliente;
import com.spa.model.Rol;
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
            if (clienteRepository.existsByEmail(request.getEmail())) {
                return new AuthResponse("Email ya registrado", null, null);
            }

            Cliente cliente = new Cliente();
            cliente.setNombre(request.getNombre());
            cliente.setEmail(request.getEmail());
            cliente.setTelefono(request.getTelefono());

            // Encriptar contraseña
            cliente.setContrasena(passwordEncoder.encode(request.getContrasena()));

            cliente.setRol("CLIENTE");
            clienteRepository.save(cliente);

            // Generar token
            String token = JwtUtil.generarToken(cliente.getEmail(), cliente.getRol());

            return new AuthResponse("Registro exitoso", token, cliente);
        } catch (Exception e) {
            e.printStackTrace();
            return new AuthResponse("Error interno del servidor", null, null);
        }
    }

    public AuthResponse login(LoginRequest request) {
        System.out.println("Email recibido: " + request.getEmail());
        System.out.println("Contraseña recibida: " + request.getContrasena());

        clienteRepository.findByEmail(request.getEmail()).ifPresent(c -> {
            System.out.println("Contraseña en base de datos: " + c.getContrasena());
            System.out.println("PasswordEncoder match: " + passwordEncoder.matches(request.getContrasena(), c.getContrasena()));
        });

        return clienteRepository.findByEmail(request.getEmail())
                .filter(cliente -> passwordEncoder.matches(request.getContrasena(), cliente.getContrasena()))
                .map(cliente -> {
                    String token = JwtUtil.generarToken(cliente.getEmail(), cliente.getRol());
                    return new AuthResponse("Inicio de sesión exitoso", token, cliente);
                })
                .orElse(new AuthResponse("Credenciales inválidas", null, null));
    }
}