import { atom } from 'jotai';
import { loadable } from 'jotai/utils';
import {
  createLeaveRequest,
  fetchLeaveRequests,
  fetchOnCallSchedule,
  fetchTeamMembers,
  updateLeaveStatus,
  addLeaveComment,
  fetchReplacementSuggestions,
} from '../api';
import type {
  CreateLeaveRequest,
  LeaveStatus,
  CreateLeaveComment,
  UpdateLeaveStatus,
} from '../types';

export const refreshCounterAtom = atom(0);

// Filter atoms
export const filterByTeamMemberAtom = atom<number | undefined>(undefined);
export const filterByStatusAtom = atom<LeaveStatus | undefined>(undefined);

const teamMembersBaseAtom = atom(async (get) => {
  get(refreshCounterAtom);
  return fetchTeamMembers();
});

const leaveRequestsBaseAtom = atom(async (get) => {
  get(refreshCounterAtom);
  const teamMemberId = get(filterByTeamMemberAtom);
  const status = get(filterByStatusAtom);
  return fetchLeaveRequests(teamMemberId, status);
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
  async (_get, set, { id, data }: { id: number; data: UpdateLeaveStatus }) => {
    const result = await updateLeaveStatus(id, data);
    set(refreshDataAtom);
    return result;
  },
);

export const addCommentAtom = atom(
  null,
  async (_get, set, data: CreateLeaveComment) => {
    const result = await addLeaveComment(data);
    set(refreshDataAtom);
    return result;
  },
);

export const fetchReplacementSuggestionsAtom = atom(
  null,
  async (
    _get,
    _set,
    {
      onCallMemberId,
      startDate,
      endDate,
    }: { onCallMemberId: number; startDate: string; endDate: string }
  ) => {
    return fetchReplacementSuggestions(onCallMemberId, startDate, endDate);
  },
);
