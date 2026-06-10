package com.teamleave.service;

import com.teamleave.dto.TeamMemberDto;
import com.teamleave.repository.TeamMemberRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;

    public TeamMemberService(TeamMemberRepository teamMemberRepository) {
        this.teamMemberRepository = teamMemberRepository;
    }

    public List<TeamMemberDto> getAll() {
        return teamMemberRepository.findAllByOrderByRotationOrderAsc().stream()
                .map(TeamMemberDto::from)
                .toList();
    }
}
