package com.spa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;

@SpringBootApplication
public class SpaBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpaBackendApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void init() {
        // Aquí puedes agregar lógica de inicialización liviana
        // Evitamos usar hilos bloqueantes o sleeps largos innecesarios
        System.out.println("✅ SpaBackendApplication está listo y levantado correctamente.");
    }
}
