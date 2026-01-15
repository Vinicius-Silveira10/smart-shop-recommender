# Use a versão do JDK especificada no pom.xml
FROM openjdk:21-jdk-slim

# Argumento para o JAR file
ARG JAR_FILE=target/*.jar

# Copia o JAR file para dentro do container
COPY ${JAR_FILE} app.jar

# Expõe a porta que a aplicação vai rodar
EXPOSE 8080

# Comando para executar a aplicação
ENTRYPOINT ["java", "-jar", "/app.jar"]