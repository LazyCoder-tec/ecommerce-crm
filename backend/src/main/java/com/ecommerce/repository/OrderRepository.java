package com.ecommerce.repository;

import com.ecommerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByStatus(String status);

    Optional<Order> findByPaymentIntentId(String paymentIntentId);

    boolean existsByUserIdAndCourseIdAndStatus(Long userId, Long courseId, String status);

    @Query("SELECT o FROM Order o WHERE o.status = 'SUCCESS' ORDER BY o.purchasedAt DESC")
    List<Order> findAllSuccessfulOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'SUCCESS'")
    long countSuccessfulOrders();

    @Query("SELECT COALESCE(SUM(o.amount), 0) FROM Order o WHERE o.status = 'SUCCESS'")
    double sumTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'SUCCESS' AND o.purchasedAt >= :startOfDay")
    long countTodayOrders(@Param("startOfDay") LocalDateTime startOfDay);

    @Query("SELECT COALESCE(SUM(o.amount), 0) FROM Order o WHERE o.status = 'SUCCESS' AND o.purchasedAt >= :startOfDay")
    double sumTodayRevenue(@Param("startOfDay") LocalDateTime startOfDay);

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.status = 'SUCCESS'")
    List<Order> findSuccessfulOrdersByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId AND o.status = 'SUCCESS'")
    long countPurchasedCoursesByUserId(@Param("userId") Long userId);
}
