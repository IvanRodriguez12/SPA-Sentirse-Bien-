package com.spa.Security;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    public static SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    // ✅ Método que genera el token con el rol incluido
    public static String generarToken(String email, String rol) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", rol); // Añadir el rol al payload

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // Expira en 1 día
                .signWith(key)
                .compact();
    }

    // 👉 Extraer solo el email (subject)
    public static String extraerEmail(String token) {
        return Jwts.parser()
                .setSigningKey(key.getEncoded())
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 👉 Extraer el rol
    public static String extraerRol(String token) {
        return Jwts.parser()
                .setSigningKey(key.getEncoded())
                .parseClaimsJws(token)
                .getBody()
                .get("rol", String.class);
    }

    // ✅ NUEVO: Método para obtener todos los claims (usado en filtros)
    public static Claims extraerClaims(String token) {
        return Jwts.parser()
                .setSigningKey(key.getEncoded())
                .parseClaimsJws(token)
                .getBody();
    }

    // 👉 Verificar si el token es válido
    public boolean validarToken(String token) {
        try {
            Jwts.parser().setSigningKey(key.getEncoded()).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}