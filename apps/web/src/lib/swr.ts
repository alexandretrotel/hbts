export const fetcher = (url: string) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      return res.json();
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
