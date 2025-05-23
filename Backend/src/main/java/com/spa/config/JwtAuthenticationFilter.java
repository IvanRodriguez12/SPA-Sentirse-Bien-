package com.spa.config;

import com.spa.Security.JwtUtil;
import com.spa.service.ClienteService;
import com.spa.service.AdministradorService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final ClienteService clienteService;
    private final AdministradorService administradorService;

    public JwtAuthenticationFilter(
            JwtUtil jwtUtil,
            ClienteService clienteService,
            AdministradorService administradorService) {
        this.jwtUtil = jwtUtil;
        this.clienteService = clienteService;
        this.administradorService = administradorService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Permitir solicitudes OPTIONS para CORS
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        try {
            final String authorizationHeader = request.getHeader("Authorization");

            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String jwt = authorizationHeader.substring(7);
            String userEmail = jwtUtil.extraerEmail(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = loadUserByEmail(userEmail);

                if (userDetails != null && jwtUtil.validarToken(jwt)) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            logger.error("Error en el filtro de autenticación JWT", e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Error de autenticación");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private UserDetails loadUserByEmail(String email) {
        try {
            UserDetails adminDetails = administradorService.loadUserByUsername(email);
            logger.debug("Usuario autenticado como ADMIN: {}", email);
            return adminDetails;
        } catch (UsernameNotFoundException adminException) {
            UserDetails clientDetails = clienteService.loadUserByUsername(email);
            logger.debug("Usuario autenticado como CLIENTE: {}", email);
            return clientDetails;
        }
    }
}