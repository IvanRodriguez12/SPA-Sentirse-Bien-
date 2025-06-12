package com.spa.config;

import java.util.Arrays;
import java.util.List;

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

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider clienteAuthenticationProvider;
    private final AuthenticationProvider adminAuthenticationProvider;

    public SecurityConfig(
            @Lazy JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationProvider clienteAuthenticationProvider,
            AuthenticationProvider adminAuthenticationProvider) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.clienteAuthenticationProvider = clienteAuthenticationProvider;
        this.adminAuthenticationProvider = adminAuthenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/clientes/registro",
                                "/api/clientes/login",
                                "/api/servicios/listar",
                                "/api/categorias/**",
                                "/api/admin/registrar",
                                "/api/admin/login",
                                "/api/clientes/verificar-email"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/turnos/listar").hasAnyRole("CLIENTE", "ADMIN")
                        .requestMatchers(
                                "/api/turnos/crear",
                                "/api/turnos/{id}"
                        ).hasRole("CLIENTE")
                        .requestMatchers(
                                "/api/admin/**",
                                "/api/turnos/eliminar/**",
                                "/api/turnos/editar/**",
                                "/api/servicios/crear",
                                "/api/servicios/editar/**",
                                "/api/servicios/eliminar/**"
                        ).hasAuthority("ROLE_ADMIN")
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(clienteAuthenticationProvider)
                .authenticationProvider(adminAuthenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("https://spa-sentirse-bien-green.vercel.app"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
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
