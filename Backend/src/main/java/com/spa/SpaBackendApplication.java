package com.spa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@SpringBootApplication
public class SpaBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpaBackendApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void init() {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        executor.submit(() -> {
            try {
                Thread.sleep(10000); // Máximo 10 segundos de espera
            } catch (InterruptedException ignored) {}
        });
    }
}
