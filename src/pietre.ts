
export function displayEnlargedImage(path: string, f: number) {
  // Create an image element and set its source to the provided path
  const img = new Image();
  img.src = path;

  // Wait for the image to load
  img.onload = () => {
    // Create a canvas element
    const canvas = document.createElement("canvas");

    // Set the canvas dimensions to match the image dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Get the 2D context of the canvas
    const ctx = canvas.getContext("2d");

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0);

    // Get the pixel data for the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Loop through each pixel and enlarge it by a factor of f
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const a = imageData.data[i + 3];

      // Enlarge the pixel by a factor of f
      const newR = r * f;
      const newG = g * f;
      const newB = b * f;

      // Update the pixel data
      imageData.data[i] = newR;
      imageData.data[i + 1] = newG;
      imageData.data[i + 2] = newB;
    }

    // Put the updated pixel data back onto the canvas
    ctx.putImageData(imageData, 0, 0);

    // Create an image element to display the enlarged image
    const enlargedImg = new Image();

    // Set the source of the enlarged image to the canvas data URL
    enlargedImg.src = canvas.toDataURL();

    // Add the enlarged image to the HTML page
    document.body.appendChild(enlargedImg);
  };
}


export function sampleFunction(value: string): string {
  return value;
}

var message = 'Hello World';
console.log(message);

console.log("Wait?");

console.log("Done.");
