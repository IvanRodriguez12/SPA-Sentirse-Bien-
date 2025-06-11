package com.spa.service;

import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.spa.model.Cliente;
import com.spa.model.Servicio;
import com.spa.model.Turno;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarVerificacionEmail(String destinatario, String nombreCliente, String token) {
        String asunto = "Verificación de correo electrónico";
        String mensaje = "Hola " + nombreCliente + ",\n\n" +
                "Por favor verifica tu correo haciendo clic en el siguiente enlace:\n\n" +
                "https://tusitio.com/verificar-email?token=" + token + "\n\n" +
                "Gracias.";

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(destinatario);
        email.setSubject(asunto);
        email.setText(mensaje);

        mailSender.send(email);
    }
    
    public void enviarComprobantePagoTarjeta(Cliente cliente, Turno turno, List<Servicio> servicios) {
        StringBuilder cuerpo = new StringBuilder();
        cuerpo.append("Hola ").append(cliente.getNombre()).append(",\n\n");
        cuerpo.append("Gracias por tu compra. A continuación los detalles del turno:\n");
        cuerpo.append("Fecha: ").append(turno.getFechaHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))).append("\n");
        cuerpo.append("Hora: ").append(turno.getFechaHora()).append("\n\n");

        double total = 0;
        for (Servicio s : servicios) {
            cuerpo.append("- ").append(s.getNombre()).append(" ($").append(s.getPrecio()).append(")\n");
            total += s.getPrecio();
        }

        cuerpo.append("\nTotal pagado: $").append(total).append("\n");
        cuerpo.append("\nNos vemos pronto en el Spa.\n");

        enviarEmail(cliente.getEmail(), "Comprobante de compra - Spa Sentirse Bien", cuerpo.toString());
    }

    public void enviarTicketPagoEfectivo(Cliente cliente, Turno turno, List<Servicio> servicios) {
        StringBuilder cuerpo = new StringBuilder();
        cuerpo.append("Hola ").append(cliente.getNombre()).append(",\n\n");
        cuerpo.append("Has reservado un turno con pago en efectivo. Detalles:\n");
        cuerpo.append("Fecha: ").append(turno.getFechaHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))).append("\n");
        cuerpo.append("Hora: ").append(turno.getFechaHora()).append("\n\n");

        double total = 0;
        for (Servicio s : servicios) {
            cuerpo.append("- ").append(s.getNombre()).append(" ($").append(s.getPrecio()).append(")\n");
            total += s.getPrecio();
        }

        cuerpo.append("\nTotal a abonar en el spa: $").append(total).append("\n");
        cuerpo.append("\nPor favor presentate 10 minutos antes.\n");

        enviarEmail(cliente.getEmail(), "Ticket de pago en efectivo - Spa Sentirse Bien", cuerpo.toString());
    }

    private void enviarEmail(String destinatario, String asunto, String cuerpo) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject(asunto);
        mensaje.setText(cuerpo);
        mailSender.send(mensaje);
    }

    public void enviarComprobanteAutomatico(Cliente cliente, Turno turno, List<Servicio> servicios) {
        if (turno.getMetodoPago().equalsIgnoreCase("TARJETA")) {
            enviarComprobantePagoTarjeta(cliente, turno, servicios);
        } else if (turno.getMetodoPago().equalsIgnoreCase("EFECTIVO")) {
            enviarTicketPagoEfectivo(cliente, turno, servicios);
        }
    }
}