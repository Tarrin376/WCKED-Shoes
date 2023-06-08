
export const getShortDateFormatRange = (start: number, end: number) => {
  const startDate = new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * start);
  const endDate = new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * end);
  return `${startDate.toDateString().substring(0, 10)} - ${endDate.toDateString().substring(0, 10)}`;
}