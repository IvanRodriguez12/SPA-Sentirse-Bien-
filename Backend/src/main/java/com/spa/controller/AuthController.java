package com.spa.controller;

import com.spa.dto.AuthResponse;
import com.spa.dto.LoginRequest;
import com.spa.dto.RegisterRequest;
import com.spa.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
    AuthResponse response = authService.register(request);
    
    if (response.getToken() == null) {
        // Manejar diferentes tipos de errores
        if (response.getMensaje().equals("Email ya registrado")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    return ResponseEntity.ok(response);
}

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/registrar-profesional")
    public ResponseEntity<AuthResponse> registrarProfesional(@RequestBody RegisterRequest request) {
        request.setProfesion(request.getProfesion() != null ? request.getProfesion() : "Sin especificar");
        AuthResponse response = authService.register(request);

        if (response.getToken() == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login-profesional")
    public ResponseEntity<AuthResponse> loginProfesional(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);

        if (response.getToken() == null || response.getProfesion() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        return ResponseEntity.ok(response);
    }
}




