export function indexFromRanges(elements: HTMLElement[], value: number): number {
  let under: number | undefined, over: number;

  const ranges = elements.map((e) => e.textContent!.trim().replace(/[–]/g, "-"));

  if (ranges.filter((e) => e.includes("-")).length == 0)
    window.alert("No ranges found");

  for (const range of ranges.filter((e) => e.includes("-"))) {
    var [lower, higher] = range.split("-");
    lower = lower.replace(/[^0-9]/g, "");
    higher = higher.replace(/[^0-9]/g, "");
    if (parseInt(lower) <= value && value <= parseInt(higher))
      return ranges.indexOf(range);

    if (under == undefined) under = parseInt(lower);
    over = parseInt(higher);
  }

  if (value < under!) return 0;
  else if (value > over!) return elements.length - 1;

  return -1;
}
