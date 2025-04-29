export const formatDate = (date: Date): string =>
  date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
