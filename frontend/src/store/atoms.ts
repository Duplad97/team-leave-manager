import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import {
  createLeaveRequest,
  fetchLeaveRequests,
  fetchOnCallSchedule,
  fetchTeamMembers,
  updateLeaveStatus,
} from '../api';
import type { CreateLeaveRequest, LeaveStatus } from '../types';

export const refreshCounterAtom = atom(0);

const teamMembersBaseAtom = atom(async (get) => {
  get(refreshCounterAtom);
  return fetchTeamMembers();
});

const leaveRequestsBaseAtom = atom(async (get) => {
  get(refreshCounterAtom);
  return fetchLeaveRequests();
});

const onCallScheduleBaseAtom = atom(async (get) => {
  get(refreshCounterAtom);
  return fetchOnCallSchedule(8);
});

const onCallCalendarBaseAtom = atom(async (get) => {
  get(refreshCounterAtom);
  return fetchOnCallSchedule(6);
});

export const teamMembersQueryAtom = loadable(teamMembersBaseAtom);
export const leaveRequestsQueryAtom = loadable(leaveRequestsBaseAtom);
export const onCallScheduleQueryAtom = loadable(onCallScheduleBaseAtom);
export const onCallCalendarQueryAtom = loadable(onCallCalendarBaseAtom);

export const refreshDataAtom = atom(null, (get, set) => {
  set(refreshCounterAtom, get(refreshCounterAtom) + 1);
});

export const createLeaveAtom = atom(
  null,
  async (_get, set, data: CreateLeaveRequest) => {
    const result = await createLeaveRequest(data);
    set(refreshDataAtom);
    return result;
  },
);

export const updateLeaveStatusAtom = atom(
  null,
  async (_get, set, { id, status }: { id: number; status: LeaveStatus }) => {
    const result = await updateLeaveStatus(id, status);
    set(refreshDataAtom);
    return result;
  },
);
