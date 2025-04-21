package com.spa.service;

import com.spa.model.Servicio;
import com.spa.model.Categoria;  // Asegúrate de importar la clase Categoria
import com.spa.repository.ServicioRepository;
import com.spa.repository.CategoriaRepository;  // Necesitarás este repositorio para acceder a las categorías
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;  // Este repositorio te permitirá manejar categorías


    public List<Servicio> obtenerTodos() {
        return servicioRepository.findAll();
    }

    public Servicio crearServicio(Servicio servicio) {
        Categoria categoria = categoriaRepository.findById(servicio.getCategoria().getId())
                .orElseThrow(() -> new RuntimeException("Categoría no válida"));

        servicio.setCategoria(categoria);
        return servicioRepository.save(servicio);
    }

    public Optional<Servicio> obtenerPorId(Long id) {
        return servicioRepository.findById(id);
    }

    public Servicio actualizarServicio(Long id, Servicio datosActualizados) {
        return servicioRepository.findById(id).map(servicio -> {
            // Si la categoría es válida, asignarla
            Categoria categoria = categoriaRepository.findById(datosActualizados.getCategoria().getId())
                    .orElseThrow(() -> new RuntimeException("Categoría no válida"));

            servicio.setNombre(datosActualizados.getNombre());
            servicio.setCategoria(categoria);  // Asignar la categoría
            servicio.setDescripcion(datosActualizados.getDescripcion());
            servicio.setPrecio(datosActualizados.getPrecio());
            return servicioRepository.save(servicio);
        }).orElse(null);
    }

    public void eliminarServicio(Long id) {
        servicioRepository.deleteById(id);
    }

    public List<Servicio> obtenerServiciosPorCategoria(Long categoriaId) {
        return servicioRepository.findByCategoriaId(categoriaId);
    }
}


