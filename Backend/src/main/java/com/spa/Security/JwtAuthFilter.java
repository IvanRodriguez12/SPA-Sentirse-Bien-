package com.spa.Security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

public class JwtAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = JwtUtil.extraerClaims(token);

                String email = claims.getSubject();
                String rol = claims.get("rol", String.class); // Obtenemos el rol desde el token

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());

                // Podrías usar el rol como autoridad si lo necesitás más adelante

                SecurityContextHolder.getContext().setAuthentication(auth);
                request.setAttribute("rol", rol); // ✅ lo guardamos para usar después
            } catch (Exception e) {
                // Token inválido, seguimos sin autenticación
            }
        }

        filterChain.doFilter(request, response);
    }
}
