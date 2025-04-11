package com.spa.controller;

import com.spa.dto.ContactoRequest;
import com.spa.model.Contacto;
import com.spa.service.ContactoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacto")
@CrossOrigin(origins = "*")
public class ContactoController {

    @Autowired
    private ContactoService contactoService;

    @PostMapping
    public String recibirContacto(@RequestBody ContactoRequest request) {
        contactoService.guardarContacto(request);
        return "¡Gracias por contactarnos! Te responderemos a la brevedad.";
    }

    @GetMapping("/listar")
    public List<Contacto> listarMensajes() {
        return contactoService.obtenerTodosLosMensajes();
    }
}

