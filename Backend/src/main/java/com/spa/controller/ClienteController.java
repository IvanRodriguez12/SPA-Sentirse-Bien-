package com.spa.controller;

import com.spa.Security.JwtUtil;
import com.spa.dto.AuthResponse;
import com.spa.dto.LoginRequest;
import com.spa.dto.RegisterRequest;
import com.spa.model.Administrador;
import com.spa.model.Cliente;
import com.spa.repository.ClienteRepository;
import com.spa.service.AdministradorService;
import com.spa.service.AuthService;
import com.spa.service.ClienteService;
import com.spa.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteService clienteService;
    private final AuthService authService;
    private final AdministradorService administradorService;
    private final BCryptPasswordEncoder passwordEncoder;

    public ClienteController(ClienteService clienteService, AuthService authService,
                             AdministradorService administradorService,
                             BCryptPasswordEncoder passwordEncoder) {
        this.clienteService = clienteService;
        this.authService = authService;
        this.administradorService = administradorService;
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    private ClienteRepository clienteRepo;

    @Autowired
    private EmailService emailService;

    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registrar(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);

        if (response.getToken() == null) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            // Primero intenta como administrador
            Optional<Administrador> adminOptional = administradorService.buscarPorEmail(request.getEmail());
            if (adminOptional.isPresent()) {
                Administrador admin = adminOptional.get();
                if (passwordEncoder.matches(request.getContrasena(), admin.getContrasena())) {
                    // Ahora pasamos el rol "ADMIN" como segundo parámetro
                    String token = JwtUtil.generarToken(admin.getEmail(), "ADMIN");
                    AuthResponse response = new AuthResponse(
                            "Login exitoso como administrador",
                            token,
                            null // No hay cliente en este caso
                    );

                    // IMPRIMIR EL TOKEN
                    System.out.println("Token generado para CLIENTE: " + token);

                    return ResponseEntity.ok(response);
                }
            }

            // Si no es admin, intenta como cliente
            Optional<Cliente> clienteOptional = clienteService.buscarPorEmail(request.getEmail());
            if (clienteOptional.isPresent()) {
                Cliente cliente = clienteOptional.get();
                if (passwordEncoder.matches(request.getContrasena(), cliente.getContrasena())) {
                    // Ahora pasamos el rol "CLIENTE" como segundo parámetro
                    String token = JwtUtil.generarToken(cliente.getEmail(), "CLIENTE");
                    AuthResponse response = new AuthResponse(
                            "Login exitoso como cliente",
                            token,
                            cliente
                    );
                    return ResponseEntity.ok(response);
                }
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new AuthResponse("Credenciales inválidas", null, null)
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    new AuthResponse("Error en autenticación: " + e.getMessage(), null, null)
            );
        }
    }

    @GetMapping("/listar")
    public List<Cliente> obtenerTodos() {
        return clienteService.obtenerTodosLosClientes();
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            String email = JwtUtil.extraerEmail(token);
            Cliente cliente = clienteService.buscarPorEmail(email).orElse(null);
            if (cliente == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(cliente);
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/enviar-verificacion/{id}")
    public ResponseEntity<?> enviarVerificacion(@PathVariable Long id) {
        Optional<Cliente> opt = clienteRepo.findById(id);
        if (!opt.isPresent()) return ResponseEntity.notFound().build();

        Cliente cliente = opt.get();
        String token = UUID.randomUUID().toString();

        cliente.setVerificacionToken(token);
        clienteRepo.save(cliente);

        emailService.enviarVerificacionEmail(cliente.getEmail(), cliente.getNombre(), token);

        return ResponseEntity.ok("Correo de verificación enviado.");
    }

    @GetMapping("/verificar-email")
    public ResponseEntity<?> verificarEmail(@RequestParam("token") String token) {
        Optional<Cliente> opt = clienteRepo.findByVerificacionToken(token);
        if (!opt.isPresent()) {
            return ResponseEntity.status(404).body("Token inválido o expirado.");
        }

        Cliente cliente = opt.get();
        cliente.setEmailVerificado(true);
        cliente.setVerificacionToken(null); // Limpia el token
        clienteRepo.save(cliente);

        return ResponseEntity.ok("Correo verificado correctamente.");
    }
}