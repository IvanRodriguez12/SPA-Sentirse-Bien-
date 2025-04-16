package com.spa.controller;

import com.spa.model.Cliente;
import java.util.List;
import com.spa.service.ClienteService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping("/registro")
    public Cliente registrar(@RequestBody Cliente cliente) {
        return clienteService.registrarCliente(cliente);
    }

    @PostMapping("/login")
    public Cliente login(@RequestBody Cliente cliente) {
        return clienteService.login(cliente.getEmail(), cliente.getContrasena());
    }

    @GetMapping("/listar")
    public List<Cliente> obtenerTodos() {
        return clienteService.obtenerTodosLosClientes();
    }

}
