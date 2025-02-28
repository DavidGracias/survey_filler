export function simulateKeysPressed(keystring: string) {
  const keys = keystring.split("");

  for (const key of keys) {
    const event = new KeyboardEvent("keypress", {
      key: key,
      code: key,
    });
    document.dispatchEvent(event);
  }
}