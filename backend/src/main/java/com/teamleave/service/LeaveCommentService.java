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
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LeaveCommentService {

    private final LeaveCommentRepository leaveCommentRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final TeamMemberRepository teamMemberRepository;

    public LeaveCommentService(
            LeaveCommentRepository leaveCommentRepository,
            LeaveRequestRepository leaveRequestRepository,
            TeamMemberRepository teamMemberRepository) {
        this.leaveCommentRepository = leaveCommentRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    @Transactional(readOnly = true)
    public List<LeaveCommentDto> getCommentsByLeaveRequest(Long leaveRequestId) {
        return leaveCommentRepository.findByLeaveRequestIdOrderByCreatedAtDesc(leaveRequestId)
                .stream()
                .map(LeaveCommentDto::from)
                .toList();
    }

    @Transactional
    public LeaveCommentDto addComment(CreateLeaveCommentDto dto) {
        LeaveRequest leaveRequest = leaveRequestRepository
                .findById(dto.leaveRequestId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Leave request not found"));

        TeamMember author = teamMemberRepository
                .findById(dto.authorId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Team member not found"));

        LeaveComment comment = new LeaveComment();
        comment.setLeaveRequest(leaveRequest);
        comment.setAuthor(author);
        comment.setCommentText(dto.commentText().trim());

        return LeaveCommentDto.from(leaveCommentRepository.save(comment));
    }
}
