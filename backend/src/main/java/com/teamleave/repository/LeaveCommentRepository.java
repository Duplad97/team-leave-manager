package com.teamleave.repository;

import com.teamleave.model.LeaveComment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaveCommentRepository extends JpaRepository<LeaveComment, Long> {
    List<LeaveComment> findByLeaveRequestIdOrderByCreatedAtDesc(Long leaveRequestId);
}
