package com.teamleave.service;

import com.teamleave.model.LeaveRequest;
import com.teamleave.model.LeaveStatus;
import com.teamleave.model.TeamMember;
import com.teamleave.repository.LeaveRequestRepository;
import com.teamleave.repository.TeamMemberRepository;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OnCallReplacementSuggestionServiceTest {

    @Mock
    private LeaveRequestRepository leaveRequestRepository;

    @Mock
    private TeamMemberRepository teamMemberRepository;

    private OnCallReplacementSuggestionService replacementSuggestionService;
    private List<TeamMember> allMembers;

    @BeforeEach
    void setUp() {
        replacementSuggestionService =
                new OnCallReplacementSuggestionService(
                        leaveRequestRepository, teamMemberRepository);

        // Create test members
        TeamMember member1 = new TeamMember();
        member1.setId(1L);
        member1.setName("Alice");

        TeamMember member2 = new TeamMember();
        member2.setId(2L);
        member2.setName("Bob");

        TeamMember member3 = new TeamMember();
        member3.setId(3L);
        member3.setName("Charlie");

        allMembers = List.of(member1, member2, member3);
    }

    @Test
    void testGetSuggestedReplacements_AllAvailable() {
        when(teamMemberRepository.findAll()).thenReturn(allMembers);
        when(leaveRequestRepository.findApprovedLeaveInRange(
                anyLong(),
                eq(LeaveStatus.APPROVED),
                any(LocalDate.class),
                any(LocalDate.class)))
                .thenReturn(List.of());

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = LocalDate.now().plusDays(5);

        List<TeamMember> result = replacementSuggestionService
                .getSuggestedReplacements(1L, startDate, endDate);

        assertEquals(2, result.size()); // Should exclude member 1
        assertTrue(result.stream().noneMatch(m -> m.getId().equals(1L)));
        verify(leaveRequestRepository, times(2)).findApprovedLeaveInRange(
                anyLong(),
                eq(LeaveStatus.APPROVED),
                eq(startDate),
                eq(endDate));
    }

    @Test
    void testGetSuggestedReplacements_SomeOnLeave() {
        when(teamMemberRepository.findAll()).thenReturn(allMembers);

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = LocalDate.now().plusDays(5);

        // Member 2 has leave during this period
        LeaveRequest leaveRequest = new LeaveRequest();
        when(leaveRequestRepository.findApprovedLeaveInRange(2L, LeaveStatus.APPROVED, startDate, endDate))
                .thenReturn(List.of(leaveRequest));

        when(leaveRequestRepository.findApprovedLeaveInRange(3L, LeaveStatus.APPROVED, startDate, endDate))
                .thenReturn(List.of());

        List<TeamMember> result = replacementSuggestionService
                .getSuggestedReplacements(1L, startDate, endDate);

        assertEquals(1, result.size());
        assertEquals(3L, result.get(0).getId());
    }

    @Test
    void testGetSuggestedReplacements_AllOnLeave() {
        when(teamMemberRepository.findAll()).thenReturn(allMembers);

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = LocalDate.now().plusDays(5);

        LeaveRequest leaveRequest = new LeaveRequest();
        when(leaveRequestRepository.findApprovedLeaveInRange(
                anyLong(),
                eq(LeaveStatus.APPROVED),
                eq(startDate),
                eq(endDate)))
                .thenReturn(List.of(leaveRequest));

        List<TeamMember> result = replacementSuggestionService
                .getSuggestedReplacements(1L, startDate, endDate);

        assertEquals(0, result.size());
    }
}
