package com.ecommerce.service;

import com.ecommerce.dto.CourseDto;
import com.ecommerce.dto.CourseRequest;
import com.ecommerce.entity.Course;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    public List<CourseDto> getAllActiveCourses() {
        return courseRepository.findByActiveTrue()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public CourseDto getCourseById(Long id) {
        return toDto(courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id)));
    }

    public CourseDto createCourse(CourseRequest request) {
        Course course = Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .price(request.getPrice())
                .instructor(request.getInstructor())
                .duration(request.getDuration())
                .level(request.getLevel())
                .build();
        return toDto(courseRepository.save(course));
    }

    public CourseDto updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setImageUrl(request.getImageUrl());
        course.setPrice(request.getPrice());
        course.setInstructor(request.getInstructor());
        course.setDuration(request.getDuration());
        course.setLevel(request.getLevel());

        return toDto(courseRepository.save(course));
    }

    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        courseRepository.delete(course);
    }

    public CourseDto toDto(Course course) {
        return CourseDto.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .imageUrl(course.getImageUrl())
                .price(course.getPrice())
                .instructor(course.getInstructor())
                .duration(course.getDuration())
                .level(course.getLevel())
                .active(course.isActive())
                .createdAt(course.getCreatedAt())
                .build();
    }
}
