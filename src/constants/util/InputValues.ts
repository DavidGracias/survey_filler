export function setInputValue(input: HTMLInputElement | HTMLTextAreaElement | null, value: string) {
  if (!input) return;
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

export function dispatchKeyboardEvent(input: HTMLElement | null, type: string, s: string) {
  if (!input) return;
  input.dispatchEvent(new KeyboardEvent(type, { bubbles: true, cancelable: true, key: s, code: s, keyCode: s.charCodeAt(0), which: s.charCodeAt(0) }));
}