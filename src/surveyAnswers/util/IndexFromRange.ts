export function indexFromRanges(elements: HTMLElement[], value: number): number {
  let under: number | undefined, over: number;

  for (const e of Array.from(elements).filter((e) =>
    e.textContent!.includes("-")
  )) {
    var [lower, higher] = e.textContent!.trim().split("-");
    lower = lower.replace(/[^0-9]/g, "");
    higher = higher.replace(/[^0-9]/g, "");
    if (parseInt(lower) <= value && value <= parseInt(higher))
      return elements.indexOf(e);

    if (under == undefined) under = parseInt(lower);
    over = parseInt(higher);
  }

  if (value < under!) return 0;
  else if (value > over!) return elements.length - 1;

  return -1;
}
