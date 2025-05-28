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

    public JwtAuthenticationFilter(JwtUtil jwtUtil,
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
        
        logger.debug("🔍 Entró al filtro JWT. Path: {}", request.getRequestURI());

        final String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logger.debug("🔒 No se encontró token Bearer. Continuando sin autenticar.");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = authorizationHeader.substring(7);
            String userEmail = jwtUtil.extraerEmail(jwt);

            logger.debug("🔐 Token recibido: {}", jwt);
            logger.debug("📧 Email extraído: {}", userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = loadUserByEmail(userEmail);

                if (jwtUtil.validarToken(jwt)) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    logger.info("✅ Token válido. Usuario autenticado: {}", userDetails.getUsername());
                    logger.info("🎭 Roles: {}", userDetails.getAuthorities());
                } else {
                    logger.warn("❌ Token inválido para el usuario: {}", userEmail);
                }
            }

        } catch (Exception e) {
            logger.error("❌ Error procesando autenticación JWT", e);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Token inválido o no autorizado.");
            return;
        }

        logger.debug("🔎 Contexto actual de seguridad: {}", SecurityContextHolder.getContext().getAuthentication());
        filterChain.doFilter(request, response);
    }

    private UserDetails loadUserByEmail(String email) {
        try {
            return administradorService.loadUserByUsername(email);
        } catch (UsernameNotFoundException e) {
            return clienteService.loadUserByUsername(email);
        }
    }
}
