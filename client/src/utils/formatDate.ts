export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
  const diffDays = Math.floor((today.getTime() - date.getTime()) / oneDay);

  if (diffDays >= 0 && diffDays < 7) {
    const daysOfWeek: string[] = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[date.getUTCDay()];
  } else {
    const formattedDate = [
      ("0" + (date.getUTCMonth() + 1)).slice(-2), // month
      ("0" + date.getUTCDate()).slice(-2), // day
      date.getUTCFullYear(), // year
    ].join("/");
    return formattedDate;
  }
}
