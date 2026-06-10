package com.teamleave.dto;

import java.time.LocalDate;
import java.util.List;

public record OnCallWeekDto(
        int weekNumber,
        LocalDate weekStart,
        LocalDate weekEnd,
        TeamMemberDto onCallMember,
        boolean hasConflict,
        List<LeaveRequestDto> conflictingLeave) {
}
