package com.teamleave.controller;

import com.teamleave.dto.OnCallWeekDto;
import com.teamleave.service.OnCallService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/on-call")
public class OnCallController {

    private final OnCallService onCallService;

    public OnCallController(OnCallService onCallService) {
        this.onCallService = onCallService;
    }

    @GetMapping
    public List<OnCallWeekDto> getSchedule(@RequestParam(defaultValue = "8") int weeks) {
        return onCallService.getSchedule(Math.min(Math.max(weeks, 1), 52));
    }
}
