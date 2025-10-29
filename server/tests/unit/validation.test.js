import { validateBugInput, sanitizeBugData } from '../../src/utils/validation.js';

describe('Validation Utilities', () => {
  describe('validateBugInput', () => {
    it('should validate correct bug input', () => {
      const validBug = {
        title: 'Test Bug',
        description: 'This is a test bug description',
        reporter: 'John Doe'
      };

      const result = validateBugInput(validBug);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should invalidate empty title', () => {
      const invalidBug = {
        title: '',
        description: 'Test description',
        reporter: 'John Doe'
      };

      const result = validateBugInput(invalidBug);

      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });

    it('should invalidate title that is too long', () => {
      const longTitle = 'a'.repeat(101);
      const invalidBug = {
        title: longTitle,
        description: 'Test description',
        reporter: 'John Doe'
      };

      const result = validateBugInput(invalidBug);

      expect(result.isValid).toBe(false);
      expect(result.errors.title).toContain('exceed');
    });

    it('should invalidate empty description', () => {
      const invalidBug = {
        title: 'Test Bug',
        description: '',
        reporter: 'John Doe'
      };

      const result = validateBugInput(invalidBug);

      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBeDefined();
    });

    it('should invalidate invalid status', () => {
      const invalidBug = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'John Doe',
        status: 'invalid-status'
      };

      const result = validateBugInput(invalidBug);

      expect(result.isValid).toBe(false);
      expect(result.errors.status).toBeDefined();
    });
  });

  describe('sanitizeBugData', () => {
    it('should sanitize input data', () => {
      const unsanitizedData = {
        title: '  Test <script>alert("xss")</script> Bug  ',
        description: 'Test description',
        reporter: 'John Doe',
        stepsToReproduce: ['Step 1', 'Step 2 <script>']
      };

      const sanitized = sanitizeBugData(unsanitizedData);

      expect(sanitized.title).toBe('Test &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; Bug');
      expect(sanitized.title).not.toContain('<script>');
      expect(sanitized.stepsToReproduce[1]).not.toContain('<script>');
    });

    it('should set default values', () => {
      const minimalData = {
        title: 'Test Bug',
        description: 'Test description',
        reporter: 'John Doe'
      };

      const sanitized = sanitizeBugData(minimalData);

      expect(sanitized.status).toBe('open');
      expect(sanitized.priority).toBe('medium');
      expect(sanitized.assignee).toBe('');
    });
  });
});