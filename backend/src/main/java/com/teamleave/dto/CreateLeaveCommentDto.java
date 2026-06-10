package com.teamleave.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateLeaveCommentDto(
        @NotNull(message = "Leave request ID is required")
        Long leaveRequestId,

        @NotNull(message = "Author ID is required")
        Long authorId,

        @NotBlank(message = "Comment text cannot be empty")
        String commentText) {}
