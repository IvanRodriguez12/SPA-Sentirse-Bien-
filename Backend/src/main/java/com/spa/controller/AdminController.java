package com.spa.controller;

import com.spa.Security.JwtUtil;
import com.spa.dto.AuthResponse;
import com.spa.dto.LoginRequest;
import com.spa.dto.RegisterRequest;
import com.spa.model.*;
import com.spa.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ServicioService servicioService;
    private final TurnoService turnoService;
    private final ClienteService clienteService;
    private final AdministradorService administradorService;
    private final BCryptPasswordEncoder passwordEncoder;

    public AdminController(ServicioService servicioService,
                           TurnoService turnoService,
                           ClienteService clienteService,
                           BCryptPasswordEncoder passwordEncoder,
                           AdministradorService administradorService) {
        this.servicioService = servicioService;
        this.turnoService = turnoService;
        this.clienteService = clienteService;
        this.passwordEncoder = passwordEncoder;
        this.administradorService = administradorService;

    }

    // ========== Gestión de Servicios ==========
    @PostMapping("/servicios")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Servicio> crearServicio(@RequestBody Servicio servicio) {
        return ResponseEntity.ok(servicioService.crearServicio(servicio));
    }

    @PutMapping("/servicios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Servicio> actualizarServicio(
            @PathVariable Long id,
            @RequestBody Servicio servicio) {
        return ResponseEntity.ok(servicioService.actualizarServicio(id, servicio));
    }

    @DeleteMapping("/servicios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarServicio(@PathVariable Long id) {
        servicioService.eliminarServicio(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/servicios/categoria/{categoriaId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Servicio>> obtenerServiciosPorCategoria(
            @PathVariable Long categoriaId) {
        return ResponseEntity.ok(servicioService.obtenerServiciosPorCategoria(categoriaId));
    }

    // ========== Gestión de Turnos ==========
    @GetMapping("/turnos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Turno>> obtenerTodosTurnos() {
        return ResponseEntity.ok(turnoService.listarTurnos());
    }

    @GetMapping("/turnos/cliente/{clienteId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Turno>> obtenerTurnosPorCliente(
            @PathVariable Long clienteId) {
        return ResponseEntity.ok(turnoService.listarTurnosPorCliente(clienteId));
    }

    @DeleteMapping("/turnos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarTurno(@PathVariable Long id) {
        turnoService.eliminarTurno(id);
        return ResponseEntity.noContent().build();
    }

    // ========== Gestión de Clientes ==========
    @GetMapping("/clientes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Cliente>> obtenerTodosClientes() {
        return ResponseEntity.ok(clienteService.obtenerTodosLosClientes());
    }

    @GetMapping("/clientes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Cliente> obtenerClientePorId(
            @PathVariable Long id) {
        return ResponseEntity.ok(clienteService.obtenerClientePorId(id));
    }

    @DeleteMapping("/clientes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarCliente(@PathVariable Long id) {
        try {
            clienteService.eliminarCliente(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(e.getMessage());
        }
    }

    // ========== Gestión de Administradores ==========
    // ========== Autenticación ==========
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Optional<Administrador> adminOptional = administradorService.buscarPorEmail(request.getEmail());

        if (adminOptional.isPresent()) {
            Administrador admin = adminOptional.get();
            if (passwordEncoder.matches(request.getContrasena(), admin.getContrasena())) {
                String token = JwtUtil.generarToken(admin.getEmail(), "ROLE_ADMIN");
                return ResponseEntity.ok(new AuthResponse("Login exitoso como administrador", token, null));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("Credenciales inválidas", null, null));
    }

    @PostMapping("/registrar")
    public ResponseEntity<AuthResponse> registrarAdmin(@RequestBody RegisterRequest request) {
        AuthResponse response = administradorService.registrarAdmin(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/administradores")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Administrador>> listarAdministradores() {
        return ResponseEntity.ok(administradorService.listarTodos());
    }

    @DeleteMapping("/administradores/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarAdministrador(@PathVariable Long id) {
        administradorService.eliminarAdministrador(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/perfil")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Administrador> obtenerPerfilAdmin(
            @RequestHeader("Authorization") String token) {
        String email = JwtUtil.extraerEmail(token.substring(7));
        Administrador admin = administradorService.buscarPorEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin no encontrado"));
        return ResponseEntity.ok(admin);
    }

    @GetMapping("/existeAdmin")
    public ResponseEntity<Boolean> existeAdmin() {
        boolean existe = !administradorService.listarTodos().isEmpty();
        return ResponseEntity.ok(existe);
    }
}