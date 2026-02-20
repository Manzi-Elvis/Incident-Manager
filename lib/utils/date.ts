export function formatDistanceToNow(
  date: Date,
  options?: { addSuffix?: boolean }
): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diff / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  let timeString: string;

  if (diffInSeconds < 60) {
    timeString = `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''}`;
  } else if (diffInMinutes < 60) {
    timeString = `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`;
  } else if (diffInHours < 24) {
    timeString = `${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`;
  } else if (diffInDays < 30) {
    timeString = `${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
  } else {
    const diffInMonths = Math.floor(diffInDays / 30);
    timeString = `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''}`;
  }

  if (options?.addSuffix) {
    return `${timeString} ago`;
  }

  return timeString;
}
