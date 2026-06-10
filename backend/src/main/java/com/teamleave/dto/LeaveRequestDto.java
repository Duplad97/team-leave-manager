package com.teamleave.dto;

import com.teamleave.model.LeaveRequest;
import com.teamleave.model.LeaveStatus;
import java.time.Instant;
import java.time.LocalDate;

public record LeaveRequestDto(
        Long id,
        Long teamMemberId,
        String teamMemberName,
        LocalDate startDate,
        LocalDate endDate,
        String reason,
        LeaveStatus status,
        Instant createdAt) {

    public static LeaveRequestDto from(LeaveRequest request) {
        return new LeaveRequestDto(
                request.getId(),
                request.getTeamMember().getId(),
                request.getTeamMember().getName(),
                request.getStartDate(),
                request.getEndDate(),
                request.getReason(),
                request.getStatus(),
                request.getCreatedAt());
    }
}
