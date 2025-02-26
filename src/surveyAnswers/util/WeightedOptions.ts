export type WeightedOption = {
  options: string[];
  weight: number;
};

export function WeightedOption(
  options: string[],
  weight: number
): WeightedOption {
  if (weight < 0) throw new Error("Weight must be greater than 0");
  return {
    options: options,
    weight: weight,
  };
}
export function chooseWeightedOption(
  weightedOptions: WeightedOption[]
): string[] | null {
  const totalWeight = weightedOptions.reduce(
    (acc, option) => acc + option.weight,
    0
  );

  // select a random option if the total weight is 0
  if (totalWeight === 0)
    return weightedOptions[
      Math.floor(Math.random() * weightedOptions.length)
    ].options;

  let randomValue = Math.random() * totalWeight;
  for (const option of weightedOptions) {
    randomValue -= option.weight;
    if (randomValue <= 0) return option.options;
  }

  return null;
}
