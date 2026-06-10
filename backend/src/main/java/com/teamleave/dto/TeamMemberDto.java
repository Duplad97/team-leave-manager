package com.teamleave.dto;

import com.teamleave.model.TeamMember;

public record TeamMemberDto(Long id, String name, String email, Integer rotationOrder) {

    public static TeamMemberDto from(TeamMember member) {
        return new TeamMemberDto(
                member.getId(),
                member.getName(),
                member.getEmail(),
                member.getRotationOrder());
    }
}
