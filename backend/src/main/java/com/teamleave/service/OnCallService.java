package com.teamleave.service;

import com.teamleave.dto.LeaveRequestDto;
import com.teamleave.dto.OnCallWeekDto;
import com.teamleave.dto.TeamMemberDto;
import com.teamleave.model.LeaveStatus;
import com.teamleave.model.TeamMember;
import com.teamleave.repository.LeaveRequestRepository;
import com.teamleave.repository.TeamMemberRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class OnCallService {

    private final TeamMemberRepository teamMemberRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final LocalDate epochWeek;

    public OnCallService(
            TeamMemberRepository teamMemberRepository,
            LeaveRequestRepository leaveRequestRepository,
            @Value("${app.on-call.epoch-week}") LocalDate epochWeek) {
        this.teamMemberRepository = teamMemberRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.epochWeek = epochWeek.with(DayOfWeek.MONDAY);
    }

    public List<OnCallWeekDto> getSchedule(int weeks) {
        List<TeamMember> members = teamMemberRepository.findAllByOrderByRotationOrderAsc();
        if (members.isEmpty()) {
            return List.of();
        }

        LocalDate currentWeekStart = LocalDate.now().with(DayOfWeek.MONDAY);
        List<OnCallWeekDto> schedule = new ArrayList<>();

        for (int i = 0; i < weeks; i++) {
            LocalDate weekStart = currentWeekStart.plusWeeks(i);
            LocalDate weekEnd = weekStart.plusDays(6);
            int weekIndex = weekOffset(weekStart) % members.size();
            TeamMember onCall = members.get(weekIndex);

            List<LeaveRequestDto> conflicts = leaveRequestRepository
                    .findApprovedLeaveInRange(
                            onCall.getId(), LeaveStatus.APPROVED, weekStart, weekEnd)
                    .stream()
                    .map(LeaveRequestDto::from)
                    .toList();

            schedule.add(new OnCallWeekDto(
                    i + 1,
                    weekStart,
                    weekEnd,
                    TeamMemberDto.from(onCall),
                    !conflicts.isEmpty(),
                    conflicts));
        }

        return schedule;
    }

    private int weekOffset(LocalDate weekStart) {
        long weeksBetween = ChronoUnit.WEEKS.between(epochWeek, weekStart);
        int offset = (int) (weeksBetween % Integer.MAX_VALUE);
        if (offset < 0) {
            offset += ((Math.abs(offset) / membersCount()) + 1) * membersCount();
        }
        return offset;
    }

    private int membersCount() {
        return Math.max(1, teamMemberRepository.findAllByOrderByRotationOrderAsc().size());
    }
}
