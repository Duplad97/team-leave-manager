import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAtom, useAtomValue } from 'jotai';
import {
  filterByStatusAtom,
  filterByTeamMemberAtom,
  teamMembersQueryAtom,
} from '../../store/atoms';
import { LeaveRequestFilters } from '../LeaveRequestFilters';

vi.mock('../../store/atoms', () => ({
  teamMembersQueryAtom: Symbol('teamMembersQueryAtom'),
  filterByTeamMemberAtom: Symbol('filterByTeamMemberAtom'),
  filterByStatusAtom: Symbol('filterByStatusAtom'),
}));

vi.mock('jotai', () => ({
  useAtomValue: vi.fn(),
  useAtom: vi.fn(),
}));

describe('LeaveRequestFilters', () => {
  const setSelectedMember = vi.fn();
  const setSelectedStatus = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAtomValue).mockImplementation((atom) => {
      if (atom === teamMembersQueryAtom) {
        return {
          state: 'hasData',
          data: [
            { id: 1, name: 'Alice', email: 'alice@team.com', rotationOrder: 0 },
            { id: 2, name: 'Bob', email: 'bob@team.com', rotationOrder: 1 },
          ],
        };
      }
      return { state: 'hasData', data: [] };
    });

    const mockedUseAtom = useAtom as unknown as {
      mockImplementation: (fn: (atom: unknown) => unknown) => void;
    };

    mockedUseAtom.mockImplementation((atom) => {
      if (atom === filterByTeamMemberAtom) {
        return [1, setSelectedMember];
      }
      if (atom === filterByStatusAtom) {
        return ['PENDING', setSelectedStatus];
      }
      return [undefined, vi.fn()];
    });
  });

  it('shows active filter state and clears all filters', async () => {
    render(<LeaveRequestFilters />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('2 active')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Clear Filters' }));

    expect(setSelectedMember).toHaveBeenCalledWith(undefined);
    expect(setSelectedStatus).toHaveBeenCalledWith(undefined);
  });
});
