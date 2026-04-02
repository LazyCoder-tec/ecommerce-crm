package com.ecommerce.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
public class CourseRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    private String imageUrl;
    @NotNull @Positive(message = "Price must be positive")
    private Double price;
    private String instructor;
    private String duration;
    private String level;
}
