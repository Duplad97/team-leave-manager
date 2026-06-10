package com.teamleave.controller;

import com.teamleave.dto.CreateLeaveRequestDto;
import com.teamleave.dto.LeaveRequestDto;
import com.teamleave.dto.UpdateLeaveStatusDto;
import com.teamleave.service.LeaveRequestService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @GetMapping
    public List<LeaveRequestDto> getAll() {
        return leaveRequestService.getAll();
    }

    @PostMapping
    public LeaveRequestDto create(@Valid @RequestBody CreateLeaveRequestDto dto) {
        return leaveRequestService.create(dto);
    }

    @PatchMapping("/{id}/status")
    public LeaveRequestDto updateStatus(
            @PathVariable Long id, @Valid @RequestBody UpdateLeaveStatusDto dto) {
        return leaveRequestService.updateStatus(id, dto);
    }
}
