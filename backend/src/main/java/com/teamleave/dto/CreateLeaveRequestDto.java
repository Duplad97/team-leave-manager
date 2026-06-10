package com.teamleave.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CreateLeaveRequestDto(
        @NotNull Long teamMemberId,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        @NotBlank String reason) {
}
