export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  rotationOrder: number;
}

export interface LeaveComment {
  id: number;
  leaveRequestId: number;
  authorId: number;
  authorName: string;
  commentText: string;
  createdAt: string;
}

export interface LeaveRequest {
  id: number;
  teamMemberId: number;
  teamMemberName: string;
  approverId?: number;
  approverName?: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  approvedAt?: string;
  comments: LeaveComment[];
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

export interface CreateLeaveComment {
  leaveRequestId: number;
  authorId: number;
  commentText: string;
}

export interface UpdateLeaveStatus {
  status: LeaveStatus;
  approverId?: number;
}

export interface ApiError {
  message: string;
}
