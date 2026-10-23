
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mkdir -p src/main/java
RUN for f in ./*.java; do if [ -f "$f" ]; then cp "$f" src/main/java/; fi; done
RUN mvn -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
CMD ["sh", "-c", "java -jar app.jar --server.port=${PORT:-10000}"]
