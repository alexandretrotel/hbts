import { rl } from "./index";

export const askConfirmation = (question: string): Promise<boolean> =>
  new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase().startsWith("y"));
    });
  });

export const formatDate = (date: Date): string =>
  date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
