import { useState } from 'react';

const BugForm = ({ onSubmit, initialData = {}, loading = false }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    priority: initialData.priority || 'medium',
    reporter: initialData.reporter || '',
    assignee: initialData.assignee || '',
    stepsToReproduce: initialData.stepsToReproduce || [''],
    environment: initialData.environment || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.stepsToReproduce];
    newSteps[index] = value;
    setFormData(prev => ({
      ...prev,
      stepsToReproduce: newSteps
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      stepsToReproduce: [...prev.stepsToReproduce, '']
    }));
  };

  const removeStep = (index) => {
    if (formData.stepsToReproduce.length > 1) {
      const newSteps = formData.stepsToReproduce.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        stepsToReproduce: newSteps
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.reporter.trim()) {
      newErrors.reporter = 'Reporter name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('[BugForm] Submitting form:', formData);

    if (!validateForm()) {
      console.log('[BugForm] Form validation failed');
      return;
    }

    // Filter out empty steps
    const submitData = {
      ...formData,
      stepsToReproduce: formData.stepsToReproduce.filter(step => step.trim() !== '')
    };

    console.log('[BugForm] Form data validated, calling onSubmit');
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="bug-form">
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
          disabled={loading}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className={errors.description ? 'error' : ''}
          disabled={loading}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="reporter">Reporter *</label>
        <input
          type="text"
          id="reporter"
          name="reporter"
          value={formData.reporter}
          onChange={handleChange}
          className={errors.reporter ? 'error' : ''}
          disabled={loading}
        />
        {errors.reporter && <span className="error-message">{errors.reporter}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="assignee">Assignee</label>
        <input
          type="text"
          id="assignee"
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Steps to Reproduce</label>
        {formData.stepsToReproduce.map((step, index) => (
          <div key={index} className="step-input">
            <input
              type="text"
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
              disabled={loading}
            />
            {formData.stepsToReproduce.length > 1 && (
              <button
                type="button"
                onClick={() => removeStep(index)}
                disabled={loading}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addStep} disabled={loading}>
          Add Step
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="environment">Environment</label>
        <input
          type="text"
          id="environment"
          name="environment"
          value={formData.environment}
          onChange={handleChange}
          placeholder="e.g., Chrome 115, Windows 10"
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Bug Report'}
      </button>
    </form>
  );
};

export default BugForm;