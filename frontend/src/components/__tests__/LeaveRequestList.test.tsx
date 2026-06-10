import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAtom, useAtomValue } from 'jotai';
import {
  leaveRequestsQueryAtom,
  teamMembersQueryAtom,
  filterByStatusAtom,
  filterByTeamMemberAtom,
} from '../../store/atoms';
import { LeaveRequestList } from '../LeaveRequestList';

vi.mock('../../store/atoms', () => ({
  leaveRequestsQueryAtom: Symbol('leaveRequestsQueryAtom'),
  updateLeaveStatusAtom: Symbol('updateLeaveStatusAtom'),
  teamMembersQueryAtom: Symbol('teamMembersQueryAtom'),
  filterByTeamMemberAtom: Symbol('filterByTeamMemberAtom'),
  filterByStatusAtom: Symbol('filterByStatusAtom'),
}));

vi.mock('jotai', () => ({
  useAtomValue: vi.fn(),
  useAtom: vi.fn(),
}));

describe('LeaveRequestList', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAtomValue).mockImplementation((atom) => {
      if (atom === leaveRequestsQueryAtom) {
        return { state: 'hasData', data: [] };
      }
      if (atom === teamMembersQueryAtom) {
        return {
          state: 'hasData',
          data: [{ id: 1, name: 'Alice', email: 'alice@team.com', rotationOrder: 0 }],
        };
      }
      return { state: 'hasData', data: [] };
    });

    const mockedUseAtom = useAtom as unknown as {
      mockImplementation: (fn: (atom: unknown) => unknown) => void;
    };

    mockedUseAtom.mockImplementation((atom) => {
      if (atom === filterByTeamMemberAtom) {
        return [undefined, vi.fn()];
      }
      if (atom === filterByStatusAtom) {
        return [undefined, vi.fn()];
      }
      return [undefined, vi.fn()];
    });
  });

  it('renders table section with embedded filters and empty filtered state', () => {
    render(<LeaveRequestList />);

    expect(screen.getByText('All Requests')).toBeInTheDocument();
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('No matching leave requests')).toBeInTheDocument();
  });
});
