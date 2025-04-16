package com.spa.Security;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    public static SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    public String generarToken(String email) {
        return Jwts.builder()
                .setSubject(email) // El email del usuario, asegúrate de que esté bien formateado.
                .setIssuedAt(new Date()) // Fecha de emisión del token
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // Expiración de 1 día
                .signWith(key) // Usamos 'key' que es un SecretKey generado automáticamente
                .compact();
    }

    public String extraerEmail(String token) {
        return Jwts.parser()
                .setSigningKey(key) // Usamos 'key' aquí también
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parser().setSigningKey(key).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}


