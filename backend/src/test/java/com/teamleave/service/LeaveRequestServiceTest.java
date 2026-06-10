package com.teamleave.service;

import com.teamleave.dto.CreateLeaveRequestDto;
import com.teamleave.dto.LeaveRequestDto;
import com.teamleave.dto.UpdateLeaveStatusDto;
import com.teamleave.exception.ApiException;
import com.teamleave.model.LeaveRequest;
import com.teamleave.model.LeaveStatus;
import com.teamleave.model.TeamMember;
import com.teamleave.repository.LeaveRequestRepository;
import com.teamleave.repository.TeamMemberRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeaveRequestServiceTest {

    @Mock
    private LeaveRequestRepository leaveRequestRepository;

    @Mock
    private TeamMemberRepository teamMemberRepository;

    private LeaveRequestService leaveRequestService;
    private TeamMember testMember;
    private LeaveRequest testLeaveRequest;

    @BeforeEach
    void setUp() {
        leaveRequestService = new LeaveRequestService(leaveRequestRepository, teamMemberRepository);
        
        testMember = new TeamMember();
        testMember.setId(1L);
        testMember.setName("Test User");
        testMember.setEmail("test@example.com");
        testMember.setRotationOrder(0);

        testLeaveRequest = new LeaveRequest();
        testLeaveRequest.setId(1L);
        testLeaveRequest.setTeamMember(testMember);
        testLeaveRequest.setStartDate(LocalDate.now().plusDays(1));
        testLeaveRequest.setEndDate(LocalDate.now().plusDays(3));
        testLeaveRequest.setReason("Vacation");
        testLeaveRequest.setStatus(LeaveStatus.PENDING);
    }

    @Test
    void testGetAll() {
        when(leaveRequestRepository.findAllByOrderByStartDateDesc())
                .thenReturn(List.of(testLeaveRequest));

        List<LeaveRequestDto> result = leaveRequestService.getAll();

        assertEquals(1, result.size());
        assertEquals("Test User", result.get(0).teamMemberName());
        verify(leaveRequestRepository, times(1)).findAllByOrderByStartDateDesc();
    }

    @Test
    void testCreateLeaveRequest_Success() {
        CreateLeaveRequestDto dto = new CreateLeaveRequestDto(
                1L,
                LocalDate.now().plusDays(1),
                LocalDate.now().plusDays(3),
                "Vacation");

        when(teamMemberRepository.findById(1L)).thenReturn(Optional.of(testMember));
        when(leaveRequestRepository.existsOverlappingLeave(
                eq(1L),
                any(LocalDate.class),
                any(LocalDate.class),
                isNull()))
                .thenReturn(false);
        when(leaveRequestRepository.save(any(LeaveRequest.class)))
                .thenReturn(testLeaveRequest);

        LeaveRequestDto result = leaveRequestService.create(dto);

        assertNotNull(result);
        assertEquals("Test User", result.teamMemberName());
        assertEquals("Vacation", result.reason());
        verify(leaveRequestRepository, times(1)).save(any(LeaveRequest.class));
    }

    @Test
    void testCreateLeaveRequest_InvalidDateRange() {
        CreateLeaveRequestDto dto = new CreateLeaveRequestDto(
                1L,
                LocalDate.now(),
                LocalDate.now().minusDays(1),
                "Vacation");

        ApiException exception = assertThrows(
                ApiException.class,
                () -> leaveRequestService.create(dto));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    }

    @Test
    void testGetByTeamMember() {
        when(leaveRequestRepository.findByTeamMemberIdOrderByStartDateDesc(1L))
                .thenReturn(List.of(testLeaveRequest));

        List<LeaveRequestDto> result = leaveRequestService.getByTeamMember(1L);

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).teamMemberId());
        verify(leaveRequestRepository, times(1)).findByTeamMemberIdOrderByStartDateDesc(1L);
    }

    @Test
    void testGetByStatus() {
        when(leaveRequestRepository.findByStatusOrderByStartDateDesc(LeaveStatus.PENDING))
                .thenReturn(List.of(testLeaveRequest));

        List<LeaveRequestDto> result = leaveRequestService.getByStatus(LeaveStatus.PENDING);

        assertEquals(1, result.size());
        assertEquals(LeaveStatus.PENDING, result.get(0).status());
        verify(leaveRequestRepository, times(1)).findByStatusOrderByStartDateDesc(LeaveStatus.PENDING);
    }

    @Test
    void testUpdateStatus_Approve() {
        TeamMember approver = new TeamMember();
        approver.setId(2L);
        approver.setName("Approver");

        UpdateLeaveStatusDto dto = new UpdateLeaveStatusDto(LeaveStatus.APPROVED, 2L);

        when(leaveRequestRepository.findById(1L)).thenReturn(Optional.of(testLeaveRequest));
        when(leaveRequestRepository.existsOverlappingLeave(
                eq(1L),
                any(LocalDate.class),
                any(LocalDate.class),
                eq(1L)))
                .thenReturn(false);
        when(teamMemberRepository.findById(2L)).thenReturn(Optional.of(approver));
        when(leaveRequestRepository.save(any(LeaveRequest.class)))
                .thenReturn(testLeaveRequest);

        LeaveRequestDto result = leaveRequestService.updateStatus(1L, dto);

        assertNotNull(result);
        assertEquals(LeaveStatus.APPROVED, result.status());
        verify(leaveRequestRepository, times(1)).save(any(LeaveRequest.class));
    }

    @Test
    void testUpdateStatus_Reject() {
        UpdateLeaveStatusDto dto = new UpdateLeaveStatusDto(LeaveStatus.REJECTED, null);

        when(leaveRequestRepository.findById(1L)).thenReturn(Optional.of(testLeaveRequest));
        when(leaveRequestRepository.save(any(LeaveRequest.class)))
                .thenReturn(testLeaveRequest);

        LeaveRequestDto result = leaveRequestService.updateStatus(1L, dto);

        assertNotNull(result);
        verify(leaveRequestRepository, times(1)).save(any(LeaveRequest.class));
    }
}
