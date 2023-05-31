export function formatDate(date) {
  const YYYY = date.substring(0, 4);
  const MM = date.substring(4, 6);
  const DD = date.substring(6, 8);

  return MM + '/' + DD + '/' + YYYY;
}
