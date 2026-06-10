package com.teamleave.controller;

import com.teamleave.dto.OnCallWeekDto;
import com.teamleave.dto.TeamMemberDto;
import com.teamleave.service.OnCallReplacementSuggestionService;
import com.teamleave.service.OnCallService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/on-call")
public class OnCallController {

    private final OnCallService onCallService;
    private final OnCallReplacementSuggestionService replacementSuggestionService;

    public OnCallController(
            OnCallService onCallService,
            OnCallReplacementSuggestionService replacementSuggestionService) {
        this.onCallService = onCallService;
        this.replacementSuggestionService = replacementSuggestionService;
    }

    @GetMapping
    public List<OnCallWeekDto> getSchedule(@RequestParam(defaultValue = "8") int weeks) {
        return onCallService.getSchedule(Math.min(Math.max(weeks, 1), 52));
    }

    @GetMapping("/replacement-suggestions")
    public List<TeamMemberDto> getReplacementSuggestions(
            @RequestParam Long onCallMemberId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return replacementSuggestionService
                .getSuggestedReplacements(onCallMemberId, startDate, endDate).stream()
                .map(TeamMemberDto::from)
                .toList();
    }
}
