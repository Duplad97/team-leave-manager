package com.teamleave.dto;

import com.teamleave.model.LeaveStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateLeaveStatusDto(
        @NotNull LeaveStatus status,
        Long approverId) {
}
