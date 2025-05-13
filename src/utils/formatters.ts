
/**
 * Format a date to local string representation
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options
  };
  
  return new Date(date).toLocaleDateString(undefined, defaultOptions);
};

/**
 * Format a date to relative time (e.g. "2 days ago")
 */
export const getRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = new Date(date);
  
  // Time difference in milliseconds
  const diffMs = now.getTime() - targetDate.getTime();
  
  // Convert to appropriate unit
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) {
    return "Just now";
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? "hour" : "hours"} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} ${diffDay === 1 ? "day" : "days"} ago`;
  } else if (diffWeek < 4) {
    return `${diffWeek} ${diffWeek === 1 ? "week" : "weeks"} ago`;
  } else if (diffMonth < 12) {
    return `${diffMonth} ${diffMonth === 1 ? "month" : "months"} ago`;
  } else {
    return `${diffYear} ${diffYear === 1 ? "year" : "years"} ago`;
  }
};

/**
 * Format file size in bytes to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
