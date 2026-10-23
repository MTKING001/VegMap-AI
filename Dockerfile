
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw -DskipTests package
CMD ["sh", "-c", "java -jar target/*.jar --server.port=${PORT:-10000}"]
