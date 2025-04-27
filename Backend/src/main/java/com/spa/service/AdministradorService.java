package com.spa.service;

import com.spa.Security.JwtUtil;
import com.spa.dto.AuthResponse;
import com.spa.dto.RegisterRequest;
import com.spa.model.Administrador;
import com.spa.model.Cliente;
import com.spa.repository.AdministradorRepository;
import com.spa.repository.ClienteRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdministradorService implements UserDetailsService {

    private final AdministradorRepository administradorRepository;
    private final ClienteRepository clienteRepository; // Añadir esta referencia
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AdministradorService(AdministradorRepository administradorRepository,
                                ClienteRepository clienteRepository, // Añadir este parámetro
                                PasswordEncoder passwordEncoder,
                                JwtUtil jwtUtil) {
        this.administradorRepository = administradorRepository;
        this.clienteRepository = clienteRepository; // Inicializar la referencia
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Primero busca como administrador
        Optional<Administrador> admin = administradorRepository.findByEmail(email);
        if (admin.isPresent()) {
            return User.builder()
                    .username(admin.get().getEmail())
                    .password(admin.get().getContrasena())
                    .roles("ADMIN") // Fuerza el rol en mayúsculas
                    .build();
        }

        // Si no es admin, busca como cliente
        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        return User.builder()
                .username(cliente.getEmail())
                .password(cliente.getContrasena())
                .roles("CLIENTE")
                .build();
    }

    public AuthResponse registrarAdmin(RegisterRequest request) {
        // Validaciones
        if (request.getContrasena().length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }

        if (administradorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        // Crear y guardar administrador
        Administrador admin = new Administrador();
        admin.setEmail(request.getEmail());
        admin.setContrasena(passwordEncoder.encode(request.getContrasena()));
        admin.setRol("ADMIN");
        administradorRepository.save(admin);

        // Generar token
        String token = jwtUtil.generarToken(admin.getEmail(), admin.getRol());

        return new AuthResponse(
                "Registro de administrador exitoso",
                token,
                null // Cliente null para indicar que es admin
        );
    }

    public Optional<Administrador> buscarPorEmail(String email) {
        return administradorRepository.findByEmail(email);
    }

    public List<Administrador> listarTodos() {
        return administradorRepository.findAll();
    }

    public void eliminarAdmin(Long id) {
        administradorRepository.deleteById(id);
    }

    public boolean existePorEmail(String email) {
        return administradorRepository.existsByEmail(email);
    }
}