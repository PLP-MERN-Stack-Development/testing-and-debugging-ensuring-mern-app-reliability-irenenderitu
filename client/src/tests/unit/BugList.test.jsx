import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugList from '../../src/components/BugList';

const mockBugs = [
  {
    _id: '1',
    title: 'Test Bug 1',
    description: 'Description 1',
    status: 'open',
    priority: 'high',
    reporter: 'John Doe',
    assignee: 'Jane Smith',
    environment: 'Chrome 115',
    createdAt: '2023-01-01T00:00:00.000Z',
    stepsToReproduce: ['Step 1', 'Step 2']
  },
  {
    _id: '2',
    title: 'Test Bug 2',
    description: 'Description 2',
    status: 'resolved',
    priority: 'medium',
    reporter: 'Jane Smith',
    assignee: '',
    environment: '',
    createdAt: '2023-01-02T00:00:00.000Z',
    stepsToReproduce: []
  }
];

describe('BugList', () => {
  const mockOnUpdateBug = jest.fn();
  const mockOnDeleteBug = jest.fn();

  beforeEach(() => {
    mockOnUpdateBug.mockClear();
    mockOnDeleteBug.mockClear();
  });

  it('renders list of bugs', () => {
    render(
      <BugList 
        bugs={mockBugs}
        onUpdateBug={mockOnUpdateBug}
        onDeleteBug={mockOnDeleteBug}
      />
    );

    expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows empty state when no bugs', () => {
    render(
      <BugList 
        bugs={[]}
        onUpdateBug={mockOnUpdateBug}
        onDeleteBug={mockOnDeleteBug}
      />
    );

    expect(screen.getByText(/no bugs reported yet/i)).toBeInTheDocument();
  });

  it('filters bugs by status', async () => {
    const user = userEvent.setup();
    render(
      <BugList 
        bugs={mockBugs}
        onUpdateBug={mockOnUpdateBug}
        onDeleteBug={mockOnDeleteBug}
      />
    );

    const filterSelect = screen.getByLabelText(/filter by status/i);
    await user.selectOptions(filterSelect, 'open');

    expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Bug 2')).not.toBeInTheDocument();
  });

  it('calls onUpdateBug when status is changed', async () => {
    const user = userEvent.setup();
    render(
      <BugList 
        bugs={mockBugs}
        onUpdateBug={mockOnUpdateBug}
        onDeleteBug={mockOnDeleteBug}
      />
    );

    const statusSelects = screen.getAllByRole('combobox');
    await user.selectOptions(statusSelects[0], 'in-progress');

    expect(mockOnUpdateBug).toHaveBeenCalledWith('1', { status: 'in-progress' });
  });

  it('calls onDeleteBug when delete button is clicked', async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => true);

    render(
      <BugList 
        bugs={mockBugs}
        onUpdateBug={mockOnUpdateBug}
        onDeleteBug={mockOnDeleteBug}
      />
    );

    const deleteButtons = screen.getAllByText(/delete/i);
    await user.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDeleteBug).toHaveBeenCalledWith('1');
  });

  it('shows loading state', () => {
    render(
      <BugList 
        bugs={[]}
        onUpdateBug={mockOnUpdateBug}
        onDeleteBug={mockOnDeleteBug}
        loading={true}
      />
    );

    expect(screen.getByText(/loading bugs/i)).toBeInTheDocument();
  });

  it('displays bug details correctly', () => {
    render(
      <BugList 
        bugs={[mockBugs[0]]}
        onUpdateBug={mockOnUpdateBug}
        onDeleteBug={mockOnDeleteBug}
      />
    );

    expect(screen.getByText('Steps to Reproduce:')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Chrome 115')).toBeInTheDocument();
  });
});