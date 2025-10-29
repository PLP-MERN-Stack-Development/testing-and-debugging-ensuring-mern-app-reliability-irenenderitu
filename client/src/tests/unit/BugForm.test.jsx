import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugForm from '../../src/components/BugForm';

describe('BugForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all form fields', () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reporter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/environment/i)).toBeInTheDocument();
    expect(screen.getByText(/steps to reproduce/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<BugForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByText(/submit bug report/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/reporter name is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} />);

    // Fill in required fields
    await user.type(screen.getByLabelText(/title/i), 'Test Bug Title');
    await user.type(screen.getByLabelText(/description/i), 'Test bug description');
    await user.type(screen.getByLabelText(/reporter/i), 'John Doe');

    // Submit form
    await user.click(screen.getByText(/submit bug report/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Bug Title',
        description: 'Test bug description',
        priority: 'medium',
        reporter: 'John Doe',
        assignee: '',
        stepsToReproduce: [''],
        environment: ''
      });
    });
  });

  it('allows adding and removing steps to reproduce', async () => {
    const user = userEvent.setup();
    render(<BugForm onSubmit={mockOnSubmit} />);

    // Add a step
    await user.click(screen.getByText(/add step/i));

    const stepInputs = screen.getAllByPlaceholderText(/step/i);
    expect(stepInputs).toHaveLength(2);

    // Fill steps
    await user.type(stepInputs[0], 'First step');
    await user.type(stepInputs[1], 'Second step');

    // Remove a step
    const removeButtons = screen.getAllByText(/remove/i);
    await user.click(removeButtons[0]);

    expect(screen.getAllByPlaceholderText(/step/i)).toHaveLength(1);
  });

  it('pre-fills form with initial data', () => {
    const initialData = {
      title: 'Initial Title',
      description: 'Initial Description',
      priority: 'high',
      reporter: 'Initial Reporter'
    };

    render(<BugForm onSubmit={mockOnSubmit} initialData={initialData} />);

    expect(screen.getByLabelText(/title/i)).toHaveValue('Initial Title');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Initial Description');
    expect(screen.getByLabelText(/priority/i)).toHaveValue('high');
    expect(screen.getByLabelText(/reporter/i)).toHaveValue('Initial Reporter');
  });

  it('disables form when loading', () => {
    render(<BugForm onSubmit={mockOnSubmit} loading={true} />);

    expect(screen.getByLabelText(/title/i)).toBeDisabled();
    expect(screen.getByLabelText(/description/i)).toBeDisabled();
    expect(screen.getByText(/submitting/i)).toBeInTheDocument();
  });
});