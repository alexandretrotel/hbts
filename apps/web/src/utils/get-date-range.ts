export const getDateRange = (dates: Date[]) => {
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  const range = Array.from(
    {
      length: Math.ceil((maxDate.getTime() - minDate.getTime()) / 86400000) + 1,
    },
    (_, i) => new Date(minDate.getTime() + i * 86400000),
  );

  return { minDate, range };
};
