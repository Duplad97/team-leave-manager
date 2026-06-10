package com.teamleave.service;

import com.teamleave.dto.CreateLeaveCommentDto;
import com.teamleave.dto.LeaveCommentDto;
import com.teamleave.exception.ApiException;
import com.teamleave.model.LeaveComment;
import com.teamleave.model.LeaveRequest;
import com.teamleave.model.TeamMember;
import com.teamleave.repository.LeaveCommentRepository;
import com.teamleave.repository.LeaveRequestRepository;
import com.teamleave.repository.TeamMemberRepository;
import java.time.Instant;
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
class LeaveCommentServiceTest {

    @Mock
    private LeaveCommentRepository leaveCommentRepository;

    @Mock
    private LeaveRequestRepository leaveRequestRepository;

    @Mock
    private TeamMemberRepository teamMemberRepository;

    private LeaveCommentService leaveCommentService;
    private TeamMember author;
    private LeaveRequest leaveRequest;
    private LeaveComment testComment;

    @BeforeEach
    void setUp() {
        leaveCommentService = new LeaveCommentService(
                leaveCommentRepository,
                leaveRequestRepository,
                teamMemberRepository);

        author = new TeamMember();
        author.setId(1L);
        author.setName("John Doe");
        author.setEmail("john@example.com");

        TeamMember member = new TeamMember();
        member.setId(2L);
        member.setName("Jane Doe");

        leaveRequest = new LeaveRequest();
        leaveRequest.setId(1L);
        leaveRequest.setTeamMember(member);
        leaveRequest.setStartDate(LocalDate.now());
        leaveRequest.setEndDate(LocalDate.now().plusDays(2));

        testComment = new LeaveComment();
        testComment.setId(1L);
        testComment.setLeaveRequest(leaveRequest);
        testComment.setAuthor(author);
        testComment.setCommentText("This is a test comment");
        testComment.setCreatedAt(Instant.now());
    }

    @Test
    void testGetCommentsByLeaveRequest() {
        when(leaveCommentRepository.findByLeaveRequestIdOrderByCreatedAtDesc(1L))
                .thenReturn(List.of(testComment));

        List<LeaveCommentDto> result = leaveCommentService.getCommentsByLeaveRequest(1L);

        assertEquals(1, result.size());
        assertEquals("John Doe", result.get(0).authorName());
        assertEquals("This is a test comment", result.get(0).commentText());
        verify(leaveCommentRepository, times(1))
                .findByLeaveRequestIdOrderByCreatedAtDesc(1L);
    }

    @Test
    void testAddComment_Success() {
        CreateLeaveCommentDto dto = new CreateLeaveCommentDto(
                1L,
                1L,
                "This is a test comment");

        when(leaveRequestRepository.findById(1L)).thenReturn(Optional.of(leaveRequest));
        when(teamMemberRepository.findById(1L)).thenReturn(Optional.of(author));
        when(leaveCommentRepository.save(any(LeaveComment.class)))
                .thenReturn(testComment);

        LeaveCommentDto result = leaveCommentService.addComment(dto);

        assertNotNull(result);
        assertEquals("John Doe", result.authorName());
        assertEquals("This is a test comment", result.commentText());
        verify(leaveCommentRepository, times(1)).save(any(LeaveComment.class));
    }

    @Test
    void testAddComment_LeaveRequestNotFound() {
        CreateLeaveCommentDto dto = new CreateLeaveCommentDto(
                999L,
                1L,
                "This is a test comment");

        when(leaveRequestRepository.findById(999L)).thenReturn(Optional.empty());

        ApiException exception = assertThrows(
                ApiException.class,
                () -> leaveCommentService.addComment(dto));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatus());
    }

    @Test
    void testAddComment_AuthorNotFound() {
        CreateLeaveCommentDto dto = new CreateLeaveCommentDto(
                1L,
                999L,
                "This is a test comment");

        when(leaveRequestRepository.findById(1L)).thenReturn(Optional.of(leaveRequest));
        when(teamMemberRepository.findById(999L)).thenReturn(Optional.empty());

        ApiException exception = assertThrows(
                ApiException.class,
                () -> leaveCommentService.addComment(dto));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatus());
    }
}
