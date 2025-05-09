# Etapa 1: Compilación
FROM maven:3.9.2-eclipse-temurin AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN mvn clean install -DskipTests

# Etapa 2: Ejecución
FROM eclipse-temurin:17
WORKDIR /app
COPY --from=build /app/target/spa-backend-1.0.0.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
