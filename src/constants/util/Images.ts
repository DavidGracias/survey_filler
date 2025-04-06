export async function compareImages(
  image1: HTMLImageElement,
  image2: HTMLImageElement,
  onMatch: () => void
) {
  while (!image1.complete || !image2.complete) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.min(image1.width, image2.width);
  canvas.height = Math.min(image1.height, image2.height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
  const image1Data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing image2
  ctx.drawImage(image2, 0, 0, canvas.width, canvas.height);
  const image2Data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  let similarPixels = 0;
  const pixelTolerance = 30;

  for (let i = 0; i < image1Data.length; i += 4) {
    let isSimilar = true;
    // Iterate over RGBA for each pixel
    for (let j = 0; j < 4; ++j)
      isSimilar &&=
        Math.abs(image1Data[i + j] - image2Data[i + j]) <= pixelTolerance;
    if (isSimilar) similarPixels++;
  }

  const totalPixels = canvas.width * canvas.height;

  const similarityThreshold = 0.7;
  if (similarPixels / totalPixels >= similarityThreshold) onMatch();
}