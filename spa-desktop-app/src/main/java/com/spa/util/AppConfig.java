package com.spa.util;

public class AppConfig {
    public static final String BASE_URL = "https://spa-backend-production.up.railway.app"; // reemplazar con tu URL real
    public static final String LOGIN_URL = BASE_URL + "/api/auth/login";
    public static final String TURNOS_MANANA_URL = BASE_URL + "/api/turnos/profesional/manana";
    public static final String TURNOS_DEL_DIA_URL = BASE_URL + "/api/turnos/profesional/hoy";
}