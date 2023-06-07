
export const getPageSize = (windowSize: number): number => {
  if (windowSize >= 1518) return 1518;
  else if (windowSize >= 1218) return 1218;
  else if (windowSize >= 918) return 918;
  else if (windowSize >= 618) return 618;
  else if (windowSize >= 480) return 480;
  else if (windowSize >= 420) return 420;
  else return -1;
}