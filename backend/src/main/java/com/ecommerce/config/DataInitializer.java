package com.ecommerce.config;

import com.ecommerce.entity.Course;
import com.ecommerce.entity.User;
import com.ecommerce.repository.CourseRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedCourses();
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail("admin@app.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@app.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ROLE_ADMIN")
                    .build();
            userRepository.save(admin);
            log.info("Admin user created: admin@app.com / admin123");
        }
    }

    private void seedCourses() {
        if (courseRepository.count() == 0) {
            courseRepository.save(Course.builder()
                    .title("Spring Boot Masterclass")
                    .description("Complete Spring Boot course with real-world projects. Covers REST APIs, Security, JPA, Microservices and more.")
                    .price(2999.0).instructor("John Doe")
                    .duration("40 hours").level("Intermediate")
                    .imageUrl("https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400")
                    .build());

            courseRepository.save(Course.builder()
                    .title("React for Beginners")
                    .description("Learn React from scratch. Covers hooks, context, routing, state management and building production apps.")
                    .price(1999.0).instructor("Jane Smith")
                    .duration("30 hours").level("Beginner")
                    .imageUrl("https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400")
                    .build());

            courseRepository.save(Course.builder()
                    .title("PostgreSQL Essentials")
                    .description("Master PostgreSQL database design, advanced queries, indexing, optimization and administration.")
                    .price(1499.0).instructor("Bob Lee")
                    .duration("20 hours").level("Beginner")
                    .imageUrl("https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400")
                    .build());

            courseRepository.save(Course.builder()
                    .title("Microservices with Spring Cloud")
                    .description("Build scalable microservices with Spring Cloud, Docker, Kubernetes, service discovery and API gateways.")
                    .price(3499.0).instructor("Alice Kumar")
                    .duration("50 hours").level("Advanced")
                    .imageUrl("https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400")
                    .build());

            courseRepository.save(Course.builder()
                    .title("Full Stack Development")
                    .description("End-to-end full stack development with React, Spring Boot, PostgreSQL and cloud deployment.")
                    .price(4999.0).instructor("Raj Patel")
                    .duration("80 hours").level("Intermediate")
                    .imageUrl("https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400")
                    .build());

            courseRepository.save(Course.builder()
                    .title("Docker & Kubernetes")
                    .description("Containerize your applications with Docker and orchestrate them with Kubernetes in production.")
                    .price(2499.0).instructor("Sam Wilson")
                    .duration("25 hours").level("Advanced")
                    .imageUrl("https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400")
                    .build());

            log.info("Sample courses seeded successfully");
        }
    }
}
