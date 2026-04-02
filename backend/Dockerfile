FROM eclipse-temurin:17-jdk-alpine 
WORKDIR /app 
COPY . . 
RUN mvn clean package -DskipTests 
EXPOSE 8080 
ENTRYPOINT ["java", "-jar", "target/ecommerce-crm-1.0.0.jar"]
