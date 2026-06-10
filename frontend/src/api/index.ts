import { api } from './client';
import type {
  CreateLeaveRequest,
  LeaveRequest,
  LeaveStatus,
  OnCallWeek,
  TeamMember,
} from '../types';

export function fetchTeamMembers(): Promise<TeamMember[]> {
  return api.get<TeamMember[]>('/api/team-members');
}

export function fetchLeaveRequests(): Promise<LeaveRequest[]> {
  return api.get<LeaveRequest[]>('/api/leave-requests');
}

export function createLeaveRequest(data: CreateLeaveRequest): Promise<LeaveRequest> {
  return api.post<LeaveRequest>('/api/leave-requests', data);
}

export function updateLeaveStatus(id: number, status: LeaveStatus): Promise<LeaveRequest> {
  return api.patch<LeaveRequest>(`/api/leave-requests/${id}/status`, { status });
}

export function fetchOnCallSchedule(weeks = 8): Promise<OnCallWeek[]> {
  return api.get<OnCallWeek[]>(`/api/on-call?weeks=${weeks}`);
}
