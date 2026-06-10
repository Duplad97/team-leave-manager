package com.teamleave.repository;

import com.teamleave.model.LeaveRequest;
import com.teamleave.model.LeaveStatus;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findAllByOrderByStartDateDesc();

    @Query("""
            SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END
            FROM LeaveRequest l
            WHERE l.teamMember.id = :memberId
              AND l.status <> 'REJECTED'
              AND l.startDate <= :endDate
              AND l.endDate >= :startDate
              AND (:excludeId IS NULL OR l.id <> :excludeId)
            """)
    boolean existsOverlappingLeave(
            @Param("memberId") Long memberId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("excludeId") Long excludeId);

    @Query("""
            SELECT l FROM LeaveRequest l
            WHERE l.teamMember.id = :memberId
              AND l.status = :status
              AND l.startDate <= :weekEnd
              AND l.endDate >= :weekStart
            """)
    List<LeaveRequest> findApprovedLeaveInRange(
            @Param("memberId") Long memberId,
            @Param("status") LeaveStatus status,
            @Param("weekStart") LocalDate weekStart,
            @Param("weekEnd") LocalDate weekEnd);
}
