export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  rotationOrder: number;
}

export interface LeaveRequest {
  id: number;
  teamMemberId: number;
  teamMemberName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}

export interface OnCallWeek {
  weekNumber: number;
  weekStart: string;
  weekEnd: string;
  onCallMember: TeamMember;
  hasConflict: boolean;
  conflictingLeave: LeaveRequest[];
}

export interface CreateLeaveRequest {
  teamMemberId: number;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ApiError {
  message: string;
}
