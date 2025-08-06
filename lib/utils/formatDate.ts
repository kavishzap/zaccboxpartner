// src/lib/utils/formatDate.ts

/**
 * Format a date string or timestamp
 * @param date - Date string, timestamp, or Date object
 * @param format - The format to use (default: 'medium')
 * @param locale - The locale to use for formatting (default: en-US)
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | number | Date,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'en-US'
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : 'short',
    day: 'numeric',
  };

  if (format === 'long' || format === 'full') {
    options.weekday = format === 'full' ? 'long' : 'short';
  }

  try {
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};
