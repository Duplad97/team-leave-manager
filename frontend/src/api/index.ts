import { api } from './client';
import type {
  CreateLeaveRequest,
  LeaveRequest,
  LeaveStatus,
  OnCallWeek,
  TeamMember,
  LeaveComment,
  CreateLeaveComment,
  UpdateLeaveStatus,
} from '../types';

export function fetchTeamMembers(): Promise<TeamMember[]> {
  return api.get<TeamMember[]>('/api/team-members');
}

export function fetchLeaveRequests(
  teamMemberId?: number,
  status?: LeaveStatus
): Promise<LeaveRequest[]> {
  const params = new URLSearchParams();
  if (teamMemberId) params.append('teamMemberId', teamMemberId.toString());
  if (status) params.append('status', status);
  const query = params.toString();
  const path = query ? `/api/leave-requests?${query}` : '/api/leave-requests';
  return api.get<LeaveRequest[]>(path);
}

export function createLeaveRequest(data: CreateLeaveRequest): Promise<LeaveRequest> {
  return api.post<LeaveRequest>('/api/leave-requests', data);
}

export function updateLeaveStatus(
  id: number,
  data: UpdateLeaveStatus
): Promise<LeaveRequest> {
  return api.patch<LeaveRequest>(`/api/leave-requests/${id}/status`, data);
}

export function fetchLeaveComments(leaveRequestId: number): Promise<LeaveComment[]> {
  return api.get<LeaveComment[]>(
    `/api/leave-requests/${leaveRequestId}/comments`
  );
}

export function addLeaveComment(data: CreateLeaveComment): Promise<LeaveComment> {
  return api.post<LeaveComment>(
    `/api/leave-requests/${data.leaveRequestId}/comments`,
    data
  );
}

export function fetchOnCallSchedule(weeks = 8): Promise<OnCallWeek[]> {
  return api.get<OnCallWeek[]>(`/api/on-call?weeks=${weeks}`);
}

export function fetchReplacementSuggestions(
  onCallMemberId: number,
  startDate: string,
  endDate: string
): Promise<TeamMember[]> {
  const params = new URLSearchParams({
    onCallMemberId: onCallMemberId.toString(),
    startDate,
    endDate,
  });
  return api.get<TeamMember[]>(`/api/on-call/replacement-suggestions?${params}`);
}
