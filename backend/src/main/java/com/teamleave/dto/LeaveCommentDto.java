package com.teamleave.dto;

import com.teamleave.model.LeaveComment;
import java.time.Instant;

public record LeaveCommentDto(
        Long id,
        Long leaveRequestId,
        Long authorId,
        String authorName,
        String commentText,
        Instant createdAt) {

    public static LeaveCommentDto from(LeaveComment comment) {
        return new LeaveCommentDto(
                comment.getId(),
                comment.getLeaveRequest().getId(),
                comment.getAuthor().getId(),
                comment.getAuthor().getName(),
                comment.getCommentText(),
                comment.getCreatedAt());
    }
}
