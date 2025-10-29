import validator from 'validator';

export const validateBugInput = (bugData) => {
  const errors = {};

  // Title validation
  if (!bugData.title || validator.isEmpty(bugData.title)) {
    errors.title = 'Title is required';
  } else if (!validator.isLength(bugData.title, { min: 1, max: 100 })) {
    errors.title = 'Title must be between 1 and 100 characters';
  }

  // Description validation
  if (!bugData.description || validator.isEmpty(bugData.description)) {
    errors.description = 'Description is required';
  } else if (!validator.isLength(bugData.description, { min: 1, max: 1000 })) {
    errors.description = 'Description must be between 1 and 1000 characters';
  }

  // Reporter validation
  if (!bugData.reporter || validator.isEmpty(bugData.reporter)) {
    errors.reporter = 'Reporter name is required';
  }

  // Status validation
  const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
  if (bugData.status && !validStatuses.includes(bugData.status)) {
    errors.status = 'Invalid status value';
  }

  // Priority validation
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  if (bugData.priority && !validPriorities.includes(bugData.priority)) {
    errors.priority = 'Invalid priority value';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const sanitizeBugData = (bugData) => {
  return {
    title: validator.escape(validator.trim(bugData.title || '')),
    description: validator.escape(validator.trim(bugData.description || '')),
    status: bugData.status || 'open',
    priority: bugData.priority || 'medium',
    reporter: validator.escape(validator.trim(bugData.reporter || '')),
    assignee: validator.escape(validator.trim(bugData.assignee || '')),
    stepsToReproduce: (bugData.stepsToReproduce || []).map(step => 
      validator.escape(validator.trim(step))
    ),
    environment: validator.escape(validator.trim(bugData.environment || ''))
  };
};