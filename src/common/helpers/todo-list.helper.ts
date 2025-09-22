export class TodoListHelper {
  /**
   * Convert comma-separated string to array
   */
  static convertStringToArray(str: string): string[] {
    if (!str || str.trim() === '') {
      return [];
    }
    return str.split(',').map(item => item.trim()).filter(item => item !== '');
  }

  /**
   * Convert array to comma-separated string
   */
  static convertArrayToString(arr: string[]): string {
    if (!arr || arr.length === 0) {
      return '';
    }
    return arr.map(item => item.trim()).join(',');
  }

  /**
   * Format date to 'dd MMM, yyyy' format
   */
  static formatDate(date: Date | string): string {
    if (!date) {
      return '';
    }
    
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  /**
   * Format enum values: capitalize and replace underscores with spaces
   */
  static formatEnumValue(value: string): string | null {
    if (!value) {
      return null;
    }
    
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Get today's date in ISO format
   */
  static getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Validate if date is today or future
   */
  static isDateTodayOrFuture(date: string | Date): boolean {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    
    return inputDate >= today;
  }
}