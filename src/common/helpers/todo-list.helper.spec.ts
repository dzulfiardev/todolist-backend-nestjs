import { TodoListHelper } from './todo-list.helper';

describe('TodoListHelper', () => {
  describe('convertStringToArray', () => {
    it('should convert comma-separated string to array', () => {
      const result = TodoListHelper.convertStringToArray('John Doe, Jane Smith, Bob Johnson');
      expect(result).toEqual(['John Doe', 'Jane Smith', 'Bob Johnson']);
    });

    it('should return empty array for empty string', () => {
      const result = TodoListHelper.convertStringToArray('');
      expect(result).toEqual([]);
    });

    it('should handle single item', () => {
      const result = TodoListHelper.convertStringToArray('John Doe');
      expect(result).toEqual(['John Doe']);
    });

    it('should trim whitespace from items', () => {
      const result = TodoListHelper.convertStringToArray('  John Doe  ,  Jane Smith  ');
      expect(result).toEqual(['John Doe', 'Jane Smith']);
    });
  });

  describe('convertArrayToString', () => {
    it('should convert array to comma-separated string', () => {
      const result = TodoListHelper.convertArrayToString(['John Doe', 'Jane Smith', 'Bob Johnson']);
      expect(result).toBe('John Doe,Jane Smith,Bob Johnson');
    });

    it('should return empty string for empty array', () => {
      const result = TodoListHelper.convertArrayToString([]);
      expect(result).toBe('');
    });

    it('should handle single item array', () => {
      const result = TodoListHelper.convertArrayToString(['John Doe']);
      expect(result).toBe('John Doe');
    });
  });

  describe('formatDate', () => {
    it('should format date to readable string', () => {
      const date = new Date('2025-09-25');
      const result = TodoListHelper.formatDate(date);
      expect(result).toMatch(/Sep 25, 2025/);
    });

    it('should return empty string for null/undefined', () => {
      expect(TodoListHelper.formatDate(null as any)).toBe('');
      expect(TodoListHelper.formatDate(undefined as any)).toBe('');
    });

    it('should handle string date input', () => {
      const result = TodoListHelper.formatDate('2025-09-25');
      expect(result).toMatch(/Sep 25, 2025/);
    });
  });

  describe('formatEnumValue', () => {
    it('should format enum values correctly', () => {
      expect(TodoListHelper.formatEnumValue('in_progress')).toBe('In Progress');
      expect(TodoListHelper.formatEnumValue('feature_enhancements')).toBe('Feature Enhancements');
      expect(TodoListHelper.formatEnumValue('best_effort')).toBe('Best Effort');
    });

    it('should return null for empty/null values', () => {
      expect(TodoListHelper.formatEnumValue('')).toBeNull();
      expect(TodoListHelper.formatEnumValue(null as any)).toBeNull();
      expect(TodoListHelper.formatEnumValue(undefined as any)).toBeNull();
    });

    it('should handle single word values', () => {
      expect(TodoListHelper.formatEnumValue('pending')).toBe('Pending');
      expect(TodoListHelper.formatEnumValue('high')).toBe('High');
    });
  });

  describe('getTodayDate', () => {
    it('should return today date in ISO format', () => {
      const result = TodoListHelper.getTodayDate();
      const today = new Date().toISOString().split('T')[0];
      expect(result).toBe(today);
    });
  });

  describe('isDateTodayOrFuture', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(TodoListHelper.isDateTodayOrFuture(today)).toBe(true);
    });

    it('should return true for future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(TodoListHelper.isDateTodayOrFuture(futureDate)).toBe(true);
    });

    it('should return false for past date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(TodoListHelper.isDateTodayOrFuture(pastDate)).toBe(false);
    });

    it('should handle string dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      expect(TodoListHelper.isDateTodayOrFuture(futureDateString)).toBe(true);
    });
  });
});