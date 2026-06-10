package com.teamleave.dto;

import com.teamleave.model.LeaveRequest;
import com.teamleave.model.LeaveStatus;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record LeaveRequestDto(
        Long id,
        Long teamMemberId,
        String teamMemberName,
        Long approverId,
        String approverName,
        LocalDate startDate,
        LocalDate endDate,
        String reason,
        LeaveStatus status,
        Instant createdAt,
        Instant approvedAt,
        List<LeaveCommentDto> comments) {

    public static LeaveRequestDto from(LeaveRequest request) {
        return new LeaveRequestDto(
                request.getId(),
                request.getTeamMember().getId(),
                request.getTeamMember().getName(),
                request.getApprover() != null ? request.getApprover().getId() : null,
                request.getApprover() != null ? request.getApprover().getName() : null,
                request.getStartDate(),
                request.getEndDate(),
                request.getReason(),
                request.getStatus(),
                request.getCreatedAt(),
                request.getApprovedAt(),
                request.getComments() != null
                        ? request.getComments().stream()
                                .map(LeaveCommentDto::from)
                                .toList()
                        : List.of());
    }
}
