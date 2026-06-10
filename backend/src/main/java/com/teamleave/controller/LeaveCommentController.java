package com.teamleave.controller;

import com.teamleave.dto.CreateLeaveCommentDto;
import com.teamleave.dto.LeaveCommentDto;
import com.teamleave.service.LeaveCommentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leave-requests/{leaveRequestId}/comments")
public class LeaveCommentController {

    private final LeaveCommentService leaveCommentService;

    public LeaveCommentController(LeaveCommentService leaveCommentService) {
        this.leaveCommentService = leaveCommentService;
    }

    @GetMapping
    public List<LeaveCommentDto> getComments(@PathVariable Long leaveRequestId) {
        return leaveCommentService.getCommentsByLeaveRequest(leaveRequestId);
    }

    @PostMapping
    public LeaveCommentDto addComment(
            @PathVariable Long leaveRequestId, @Valid @RequestBody CreateLeaveCommentDto dto) {
        return leaveCommentService.addComment(dto);
    }
}
