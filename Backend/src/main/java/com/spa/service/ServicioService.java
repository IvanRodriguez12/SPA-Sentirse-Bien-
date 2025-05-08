package com.spa.service;

import com.spa.model.Servicio;
import com.spa.model.Categoria;
import com.spa.repository.ServicioRepository;
import com.spa.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioService {

    private final ServicioRepository servicioRepository;
    private final CategoriaRepository categoriaRepository;

    public ServicioService(ServicioRepository servicioRepository,
                           CategoriaRepository categoriaRepository) {
        this.servicioRepository = servicioRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public List<Servicio> obtenerTodos() {
        return servicioRepository.findAll();
    }

    public Servicio crearServicio(Servicio servicio) {
        if (servicio.getDuracion() == null || servicio.getDuracion() <= 0) {
            throw new RuntimeException("La duración debe ser un valor positivo");
        }
        Categoria categoria = categoriaRepository.findById(servicio.getCategoria().getId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        servicio.setCategoria(categoria);
        return servicioRepository.save(servicio);
    }

    public Optional<Servicio> obtenerPorId(Long id) {
        return servicioRepository.findById(id);
    }

    public Servicio actualizarServicio(Long id, Servicio servicioActualizado) {
        return servicioRepository.findById(id)
                .map(servicio -> {
                    if (servicioActualizado.getDuracion() == null || servicioActualizado.getDuracion() <= 0) {
                        throw new RuntimeException("La duración debe ser un valor positivo");
                    }
                    Categoria categoria = categoriaRepository.findById(servicioActualizado.getCategoria().getId())
                            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

                    servicio.setNombre(servicioActualizado.getNombre());
                    servicio.setCategoria(categoria);
                    servicio.setDescripcion(servicioActualizado.getDescripcion());
                    servicio.setPrecio(servicioActualizado.getPrecio());
                    servicio.setTipo(servicioActualizado.getTipo());
                    servicio.setImagen(servicioActualizado.getImagen());
                    servicio.setDuracion(servicioActualizado.getDuracion());

                    return servicioRepository.save(servicio);
                })
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));
    }

    public void eliminarServicio(Long id) {
        if (!servicioRepository.existsById(id)) {
            throw new RuntimeException("Servicio no encontrado con ID: " + id);
        }
        servicioRepository.deleteById(id);
    }

    public List<Servicio> obtenerServiciosPorCategoria(Long categoriaId) {
        if (!categoriaRepository.existsById(categoriaId)) {
            throw new RuntimeException("Categoría no encontrada con ID: " + categoriaId);
        }
        return servicioRepository.findByCategoriaId(categoriaId);
    }

    public Servicio obtenerServicioPorId(Long id) {
        return servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));
    }
}