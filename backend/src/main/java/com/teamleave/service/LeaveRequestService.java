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
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final TeamMemberRepository teamMemberRepository;

    public LeaveRequestService(
            LeaveRequestRepository leaveRequestRepository,
            TeamMemberRepository teamMemberRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestDto> getAll() {
        return leaveRequestRepository.findAllByOrderByStartDateDesc().stream()
                .map(LeaveRequestDto::from)
                .toList();
    }

    @Transactional
    public LeaveRequestDto create(CreateLeaveRequestDto dto) {
        if (dto.endDate().isBefore(dto.startDate())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "End date must be on or after start date");
        }

        TeamMember member = teamMemberRepository
                .findById(dto.teamMemberId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Team member not found"));

        boolean overlaps = leaveRequestRepository.existsOverlappingLeave(
                dto.teamMemberId(), dto.startDate(), dto.endDate(), null);
        if (overlaps) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "This team member already has a leave request overlapping these dates");
        }

        LeaveRequest request = new LeaveRequest();
        request.setTeamMember(member);
        request.setStartDate(dto.startDate());
        request.setEndDate(dto.endDate());
        request.setReason(dto.reason().trim());
        request.setStatus(LeaveStatus.PENDING);

        return LeaveRequestDto.from(leaveRequestRepository.save(request));
    }

    @Transactional
    public LeaveRequestDto updateStatus(Long id, UpdateLeaveStatusDto dto) {
        LeaveRequest request = leaveRequestRepository
                .findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Leave request not found"));

        if (dto.status() == LeaveStatus.APPROVED) {
            boolean overlaps = leaveRequestRepository.existsOverlappingLeave(
                    request.getTeamMember().getId(),
                    request.getStartDate(),
                    request.getEndDate(),
                    id);
            if (overlaps) {
                throw new ApiException(
                        HttpStatus.CONFLICT,
                        "Cannot approve: another leave request overlaps these dates");
            }
        }

        request.setStatus(dto.status());
        return LeaveRequestDto.from(leaveRequestRepository.save(request));
    }
}
