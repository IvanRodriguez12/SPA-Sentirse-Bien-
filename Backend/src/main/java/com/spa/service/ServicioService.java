package com.spa.service;

import com.spa.model.Servicio;
import com.spa.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    public List<Servicio> obtenerTodos() {
        return servicioRepository.findAll();
    }

    public Servicio crearServicio(Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    public Optional<Servicio> obtenerPorId(Long id) {
        return servicioRepository.findById(id);
    }

    public Servicio actualizarServicio(Long id, Servicio datosActualizados) {
        return servicioRepository.findById(id).map(servicio -> {
            servicio.setNombre(datosActualizados.getNombre());
            servicio.setCategoria(datosActualizados.getCategoria());
            servicio.setDescripcion(datosActualizados.getDescripcion());
            servicio.setPrecio(datosActualizados.getPrecio());
            return servicioRepository.save(servicio);
        }).orElse(null);
    }

    public void eliminarServicio(Long id) {
        servicioRepository.deleteById(id);
    }
}

