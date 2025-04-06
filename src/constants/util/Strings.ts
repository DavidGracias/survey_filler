export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function formatText(s: string) {
  return s.toLowerCase().replace(/\s+/g, ' ');
}
