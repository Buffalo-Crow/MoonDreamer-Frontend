const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function formatDateForInput(date) {
  if (!date) return "";
  if (typeof date === "string" && DATE_ONLY_REGEX.test(date)) return date;

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().split("T")[0];
}

export function formatDreamDate(dateInput, fallbackDate) {
  if (typeof dateInput === "string" && DATE_ONLY_REGEX.test(dateInput)) {
    const localDate = new Date(`${dateInput}T00:00:00`);
    return localDate.toLocaleDateString();
  }

  if (!fallbackDate) return "";
  return new Date(fallbackDate).toLocaleDateString();
}
