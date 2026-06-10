package com.teamleave.service;

import com.teamleave.model.LeaveRequest;
import com.teamleave.model.LeaveStatus;
import com.teamleave.model.TeamMember;
import com.teamleave.repository.LeaveRequestRepository;
import com.teamleave.repository.TeamMemberRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OnCallReplacementSuggestionService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final TeamMemberRepository teamMemberRepository;

    public OnCallReplacementSuggestionService(
            LeaveRequestRepository leaveRequestRepository,
            TeamMemberRepository teamMemberRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    @Transactional(readOnly = true)
    public List<TeamMember> getSuggestedReplacements(
            Long onCallMemberId, LocalDate startDate, LocalDate endDate) {
        List<TeamMember> allMembers = teamMemberRepository.findAll();

        return allMembers.stream()
                .filter(member -> !member.getId().equals(onCallMemberId))
                .filter(member -> !hasConflictingLeave(member.getId(), startDate, endDate))
                .toList();
    }

    private boolean hasConflictingLeave(Long memberId, LocalDate startDate, LocalDate endDate) {
        List<LeaveRequest> leaves = leaveRequestRepository.findApprovedLeaveInRange(
                memberId, LeaveStatus.APPROVED, startDate, endDate);
        return !leaves.isEmpty();
    }
}
