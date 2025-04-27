package com.spa.service;

import com.spa.model.Cliente;
import com.spa.repository.ClienteRepository;
import com.spa.repository.TurnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteService implements UserDetailsService {

    private final ClienteRepository clienteRepository;
    private final TurnoRepository turnoRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public ClienteService(ClienteRepository clienteRepository,
                          TurnoRepository turnoRepository) {
        this.clienteRepository = clienteRepository;
        this.turnoRepository = turnoRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public Cliente registrarCliente(Cliente cliente) {
        cliente.setContrasena(passwordEncoder.encode(cliente.getContrasena()));
        return clienteRepository.save(cliente);
    }

    public Optional<Cliente> buscarPorEmail(String email) {
        return clienteRepository.findByEmail(email);
    }

    public  List<Cliente> obtenerTodosLosClientes() {
        return clienteRepository.findAll();
    }

    public Cliente obtenerClientePorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + id));
    }

    public void eliminarCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + id));

        // Verificar si el cliente tiene turnos antes de eliminar
        if (!turnoRepository.findByClienteId(id).isEmpty()) {
            throw new IllegalStateException("No se puede eliminar el cliente porque tiene turnos asociados");
        }

        clienteRepository.delete(cliente);
    }

    // Métodos para autenticación
    public Cliente login(String email, String password) {
        return clienteRepository.findByEmail(email)
                .filter(c -> passwordEncoder.matches(password, c.getContrasena()))
                .orElse(null);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Cliente no encontrado con email: " + email));

        return new User(
                cliente.getEmail(),
                cliente.getContrasena(),
                Collections.emptyList()
        );
    }
}


