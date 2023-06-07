
export const convertDate = (date: string, addTime: boolean = false) => {
  const newDate = new Date(date);
  if (!addTime) return newDate.toDateString();
  else return newDate.toDateString() + " at " + newDate.getHours() + ":" + newDate.getMinutes().toString().padStart(2, '0');
}