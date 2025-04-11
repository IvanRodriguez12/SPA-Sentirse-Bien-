package com.spa.service;

import com.spa.dto.ContactoRequest;
import com.spa.model.Contacto;
import com.spa.repository.ContactoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactoService {

    @Autowired
    private ContactoRepository contactoRepository;

    public void guardarContacto(ContactoRequest request) {
        Contacto contacto = new Contacto();
        contacto.setNombre(request.getNombre());
        contacto.setEmail(request.getEmail());
        contacto.setTelefono(request.getTelefono());
        contacto.setMensaje(request.getMensaje());

        contactoRepository.save(contacto);
    }

    public List<Contacto> obtenerTodosLosMensajes() {
        return contactoRepository.findAll();
    }
}
