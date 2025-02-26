export function ageAtDate(dob: string, date: string): number {
  const dobMillis = Date.parse(dob);
  const dateMillis = Date.parse(date);
  return new Date(dateMillis - dobMillis).getUTCFullYear() - 1970;
}