export function setInputValue(input: HTMLInputElement | HTMLTextAreaElement | null, value: string) {
  if (!input) return;
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}