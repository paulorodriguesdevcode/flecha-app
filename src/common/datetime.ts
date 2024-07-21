export function formatToBRDate(dataString: string | undefined) {
  if (!dataString) return ""
  const data = new Date(dataString);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  };

  return data.toLocaleString("pt-BR", { ...options }).replace(",", "");

}