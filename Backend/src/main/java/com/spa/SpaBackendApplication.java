package com.spa;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpaBackendApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(SpaBackendApplication.class, args);
    }

    @Override
    public void run(String... args) {
        String smtpUser = System.getenv("SMTP_USER");
        String smtpPass = System.getenv("SMTP_PASS");

        if (smtpUser == null || smtpPass == null) {
            System.out.println("❌ [ERROR] Las variables de entorno SMTP_USER o SMTP_PASS no están disponibles.");
        } else {
            System.out.println("✅ [INFO] Variables de entorno cargadas correctamente.");
            System.out.println("SMTP_USER: " + smtpUser);
            System.out.println("SMTP_PASS: [OCULTO]");
        }
    }
}