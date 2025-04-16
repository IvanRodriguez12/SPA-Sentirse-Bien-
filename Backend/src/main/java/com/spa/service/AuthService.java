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
            if (clienteRepository.existsByEmail(request.getEmail())) {
                return new AuthResponse("Email ya registrado", null);
            }

            Cliente cliente = new Cliente();
            cliente.setNombre(request.getNombre());
            cliente.setEmail(request.getEmail());
            cliente.setTelefono(request.getTelefono());

            // 🔒 Encriptar contraseña antes de guardar
            cliente.setContrasena(passwordEncoder.encode(request.getContrasena()));

            clienteRepository.save(cliente);

            return new AuthResponse("Registro exitoso", null);
        } catch (Exception e) {
            e.printStackTrace();
            return new AuthResponse("Error interno del servidor", null);
        }
    }

    public AuthResponse login(LoginRequest request) {
        return clienteRepository.findByEmail(request.getEmail())
                .filter(cliente -> passwordEncoder.matches(request.getContrasena(), cliente.getContrasena())) // ✅ Validación segura
                .map(cliente -> {
                    String token = jwtUtil.generarToken(cliente.getEmail());
                    return new AuthResponse("Inicio de sesión exitoso", token);
                })
                .orElse(new AuthResponse("Credenciales inválidas", null));
    }
}




