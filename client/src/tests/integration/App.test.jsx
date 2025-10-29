import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';

// Mock the useBugs hook
jest.mock('../../src/hooks/useBugs', () => ({
  useBugs: () => ({
    bugs: [
      {
        _id: '1',
        title: 'Existing Bug',
        description: 'Existing description',
        status: 'open',
        priority: 'high',
        reporter: 'Test User',
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ],
    loading: false,
    error: null,
    createBug: jest.fn().mockResolvedValue({}),
    updateBug: jest.fn().mockResolvedValue({}),
    deleteBug: jest.fn().mockResolvedValue({})
  })
}));

describe('App Integration', () => {
  it('renders the main application', () => {
    render(<App />);

    expect(screen.getByText('🐛 Bug Tracker')).toBeInTheDocument();
    expect(screen.getByText('Report New Bug')).toBeInTheDocument();
    expect(screen.getByText('Existing Bug')).toBeInTheDocument();
  });

  it('shows and hides the bug form', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click report new bug button
    await user.click(screen.getByText('Report New Bug'));

    expect(screen.getByText('Report a New Bug')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();

    // Click cancel button
    await user.click(screen.getByText('Cancel'));

    expect(screen.queryByText('Report a New Bug')).not.toBeInTheDocument();
  });

  it('handles form submission flow', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Open form
    await user.click(screen.getByText('Report New Bug'));

    // Fill form
    await user.type(screen.getByLabelText(/title/i), 'New Integration Test Bug');
    await user.type(screen.getByLabelText(/description/i), 'This is a test description');
    await user.type(screen.getByLabelText(/reporter/i), 'Integration Tester');

    // Submit form
    await user.click(screen.getByText(/submit bug report/i));

    // Form should close after submission
    await waitFor(() => {
      expect(screen.queryByText('Report a New Bug')).not.toBeInTheDocument();
    });
  });
});