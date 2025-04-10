package com.spa.controller;

import com.spa.dto.LoginRequest;
import com.spa.dto.RegisterRequest;
import com.spa.model.Cliente;
import com.spa.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        Cliente cliente = authService.registrar(request);
        return ResponseEntity.ok(cliente);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        boolean valid = authService.verificarCredenciales(request.getEmail(), request.getPassword());
        if (valid) {
            return ResponseEntity.ok("Inicio de sesión exitoso");
        } else {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }
}


