package com.spa.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider clienteAuthenticationProvider;
    private final AuthenticationProvider adminAuthenticationProvider;

    public SecurityConfig(
            @Lazy JwtAuthenticationFilter jwtAuthFilter,
            AuthenticationProvider clienteAuthenticationProvider,
            AuthenticationProvider adminAuthenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.clienteAuthenticationProvider = clienteAuthenticationProvider;
        this.adminAuthenticationProvider = adminAuthenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/clientes/registro",
                                "/api/clientes/login",
                                "/api/servicios/listar",
                                "/api/categorias/**",
                                "/api/admin/registrar",
                                "/api/admin/login",
                                "/api/admin/existeAdmin"
                        ).permitAll()

                        // Endpoints GET públicos
                        .requestMatchers(HttpMethod.GET, "/api/turnos/listar").permitAll()

                        // Endpoints específicos para administradores (definidos primero)
                        .requestMatchers(HttpMethod.PUT, "/api/admin/turnos/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/admin/turnos/**").hasAuthority("ROLE_ADMIN")

                        // Endpoints generales para administradores
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")

                        // Endpoints para clientes
                        .requestMatchers(
                                "/api/turnos/crear",
                                "/api/turnos/mis-turnos"
                        ).hasAuthority("ROLE_CLIENTE")

                        // Endpoints para servicios (admin only)
                        .requestMatchers("/api/servicios/**").hasAuthority("ROLE_ADMIN")

                        // Endpoints compartidos
                        .requestMatchers(
                                "/api/turnos/{id}"
                        ).hasAnyAuthority("ROLE_CLIENTE", "ROLE_ADMIN")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(clienteAuthenticationProvider)
                .authenticationProvider(adminAuthenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}