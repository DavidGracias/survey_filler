export type WeightedOption<T> = {
  options: T;
  weight: number;
};

export function WeightedOption<T>(
  options: T,
  weight: number
): WeightedOption<T> {
  if (weight < 0) throw new Error("Weight must be greater than 0");
  return {
    options: options,
    weight: weight,
  };
}
export function chooseWeightedOption<T>(
  weightedOptions: WeightedOption<T>[]
): T {
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

  throw new Error("No option was chosen");
}
