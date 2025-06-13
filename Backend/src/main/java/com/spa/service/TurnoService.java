package com.spa.service;

import com.spa.dto.TurnoRequest;
import com.spa.model.Cliente;
import com.spa.model.Servicio;
import com.spa.model.Turno;
import com.spa.repository.ClienteRepository;
import com.spa.repository.ServicioRepository;
import com.spa.repository.TurnoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;
import com.spa.dto.ReporteServicioDTO;
import com.spa.dto.ReporteProfesionalDTO;

@Service
public class TurnoService {

    private final TurnoRepository turnoRepository;
    private final ClienteRepository clienteRepository;
    private final ServicioRepository servicioRepository;
    @Autowired
    private EmailService emailService;

    // Zona horaria de Argentina
    private static final ZoneId ZONA_ARGENTINA = ZoneId.of("America/Argentina/Buenos_Aires");

    public TurnoService(TurnoRepository turnoRepository, ClienteRepository clienteRepository, ServicioRepository servicioRepository) {
        this.turnoRepository = turnoRepository;
        this.clienteRepository = clienteRepository;
        this.servicioRepository = servicioRepository;
    }

    // Método para ajustar LocalDateTime desde frontend a hora argentina
    private LocalDateTime ajustarAHoraArgentina(LocalDateTime fechaFromFrontend) {
        // El frontend envía la fecha como si fuera UTC, pero en realidad es hora argentina
        // Necesitamos restar 3 horas para compensar
        return fechaFromFrontend.minusHours(3);
    }

    @Transactional
    public Turno guardarTurnoConAsignacion(TurnoRequest turnoRequest) {
        String emailCliente = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Cliente> clienteOptional = clienteRepository.findByEmail(emailCliente);
        if (clienteOptional.isEmpty()) {
            throw new IllegalArgumentException("Cliente no encontrado con email: " + emailCliente);
        }

        List<Servicio> servicios = servicioRepository.findAllById(turnoRequest.getServicioIds());
        if (servicios.size() != turnoRequest.getServicioIds().size()) {
            throw new IllegalArgumentException("Algunos servicios no fueron encontrados.");
        }

        Set<String> categorias = servicios.stream()
                .map(servicio -> servicio.getCategoria().getNombre())
                .collect(Collectors.toSet());

        Set<Cliente> profesionalesAsignados = new HashSet<>();
        for (String categoria : categorias) {
            List<Cliente> candidatos = clienteRepository.findByProfesion(categoria);
            if (!candidatos.isEmpty()) {
                Cliente elegido = candidatos.get(new Random().nextInt(candidatos.size()));
                profesionalesAsignados.add(elegido);
            }
        }

        Turno turno = new Turno();
        turno.setCliente(clienteOptional.get());

        // Ajustar la fecha a hora argentina
        LocalDateTime fechaAjustada = ajustarAHoraArgentina(turnoRequest.getFechaHora());
        turno.setFechaHora(fechaAjustada);

        turno.setServicios(new HashSet<>(servicios));
        turno.setProfesionales(profesionalesAsignados);
        turno.setMetodoPago(turnoRequest.getMetodoPago());

        Turno turnoGuardado = turnoRepository.save(turno);

        emailService.enviarComprobanteAutomatico(clienteOptional.get(), turnoGuardado, servicios);

        return turnoGuardado;
    }

    @Transactional
    public List<Turno> listarTurnos() {
        return turnoRepository.findAll();
    }

    public List<Turno> listarTurnosPorCliente(Long clienteId) {
        if (!clienteRepository.existsById(clienteId)) {
            throw new RuntimeException("Cliente no encontrado con ID: " + clienteId);
        }
        return turnoRepository.findByClienteId(clienteId);
    }

    public Turno obtenerTurnoPorId(Long id) {
        return turnoRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado con ID: " + id));
    }

    public void eliminarTurno(Long id) {
        if (!turnoRepository.existsById(id)) {
            throw new RuntimeException("No se encontró el turno con ID: " + id);
        }
        turnoRepository.deleteById(id);
    }

    public Turno actualizarTurno(Long id, Turno turnoActualizado) {
        Turno turnoExistente = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado con ID: " + id));

        validarTurno(turnoActualizado);

        turnoExistente.setCliente(clienteRepository.findById(turnoActualizado.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado")));

        List<Servicio> servicios = servicioRepository.findAllById(
                turnoActualizado.getServicios().stream().map(Servicio::getId).toList()
        );

        if (servicios.isEmpty()) {
            throw new RuntimeException("No se encontraron los servicios proporcionados.");
        }

        turnoExistente.setServicios(new HashSet<>(servicios));

        // Ajustar la fecha actualizada
        LocalDateTime fechaAjustada = ajustarAHoraArgentina(turnoActualizado.getFechaHora());
        turnoExistente.setFechaHora(fechaAjustada);

        return turnoRepository.save(turnoExistente);
    }

    private void validarTurno(Turno turno) {
        if (!clienteRepository.existsById(turno.getCliente().getId())) {
            throw new RuntimeException("Cliente no encontrado");
        }

        if (turno.getServicios() == null || turno.getServicios().isEmpty()) {
            throw new RuntimeException("Debe seleccionar al menos un servicio.");
        }

        List<Long> servicioIds = turno.getServicios().stream().map(Servicio::getId).toList();
        long serviciosEncontrados = servicioRepository.countByIdIn(servicioIds);

        if (serviciosEncontrados != servicioIds.size()) {
            throw new RuntimeException("Uno o más servicios no fueron encontrados.");
        }

        // Para validación, usar la fecha ajustada
        LocalDateTime fecha = ajustarAHoraArgentina(turno.getFechaHora());
        ZonedDateTime ahoraArgentina = ZonedDateTime.now(ZONA_ARGENTINA);

        if (fecha.isBefore(ahoraArgentina.toLocalDateTime())) {
            throw new IllegalArgumentException("No se puede reservar en fechas pasadas.");
        }

        int hora = fecha.getHour();
        if (hora < 8 || hora >= 20) {
            throw new IllegalArgumentException("Horario no válido (8:00 - 20:00)");
        }
    }

    public Cliente buscarClientePorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + id));
    }

    public Servicio buscarServicioPorId(Long id) {
        return servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));
    }

    public List<Turno> listarTurnosPorProfesionalAutenticado(String filtroFecha) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Cliente> profesionalOptional = clienteRepository.findByEmail(email);

        if (profesionalOptional.isEmpty()) {
            throw new RuntimeException("Profesional no encontrado con email: " + email);
        }

        Cliente profesional = profesionalOptional.get();

        if (profesional.getProfesion() == null) {
            throw new RuntimeException("Este usuario no tiene una profesión asignada.");
        }

        List<Turno> turnosAsignados = turnoRepository.buscarTurnosPorProfesional(profesional);

        ZonedDateTime ahoraArgentina = ZonedDateTime.now(ZONA_ARGENTINA);
        LocalDate hoyInicio = ahoraArgentina.toLocalDate();
        LocalDate mañana = hoyInicio.plusDays(1);

        return turnosAsignados.stream().filter(turno -> {
            LocalDate fechaTurno = turno.getFechaHora().toLocalDate();
            return switch (filtroFecha.toLowerCase()) {
                case "hoy" -> fechaTurno.equals(hoyInicio);
                case "mañana" -> fechaTurno.equals(mañana);
                case "ambos" -> fechaTurno.equals(hoyInicio) || fechaTurno.equals(mañana);
                default -> false;
            };
        }).collect(Collectors.toList());
    }

    public List<ReporteServicioDTO> calcularTotalesPorServicio(LocalDate desde, LocalDate hasta) {
        List<Turno> turnos = listarTurnos().stream()
            .filter(t -> {
                LocalDate fecha = t.getFechaHora().toLocalDate();
                return (fecha.isEqual(desde) || fecha.isAfter(desde)) &&
                    (fecha.isEqual(hasta) || fecha.isBefore(hasta));
            })
            .collect(Collectors.toList());

        Map<String, Double> totales = new HashMap<>();

        for (Turno turno : turnos) {
            for (Servicio servicio : turno.getServicios()) {
                totales.put(servicio.getNombre(),
                    totales.getOrDefault(servicio.getNombre(), 0.0) + servicio.getPrecio());
            }
        }

        return totales.entrySet().stream()
            .map(e -> new ReporteServicioDTO(e.getKey(), e.getValue()))
            .collect(Collectors.toList());
    }

    public List<ReporteProfesionalDTO> calcularTotalesPorProfesional(LocalDate desde, LocalDate hasta) {
        List<Turno> turnos = listarTurnos().stream()
            .filter(t -> {
                LocalDate fecha = t.getFechaHora().toLocalDate();
                return (fecha.isEqual(desde) || fecha.isAfter(desde)) &&
                    (fecha.isEqual(hasta) || fecha.isBefore(hasta));
            })
            .collect(Collectors.toList());

        Map<String, Double> totales = new HashMap<>();

        for (Turno turno : turnos) {
            double subtotal = turno.getServicios().stream()
                .mapToDouble(Servicio::getPrecio)
                .sum();

            for (Cliente prof : turno.getProfesionales()) {
                totales.put(prof.getNombre(),
                    totales.getOrDefault(prof.getNombre(), 0.0) + subtotal);
            }
        }

        return totales.entrySet().stream()
            .map(e -> new ReporteProfesionalDTO(e.getKey(), e.getValue()))
            .collect(Collectors.toList());
    }

}