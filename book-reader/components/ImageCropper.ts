import React, { useState } from 'react';

const ImageCropper: React.FC = () => {
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;

        img.onload = () => {
          // Create a canvas element
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set the canvas size to the desired crop size
          const cropWidth = 300;
          const cropHeight = 300;
          canvas.width = cropWidth;
          canvas.height = cropHeight;

          // Draw the image on the canvas and crop it
          if (ctx) {
            const cropX = 100; // X coordinate of the crop start
            const cropY = 100; // Y coordinate of the crop start
            ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

            // Convert the canvas to a data URL
            const croppedImageDataUrl = canvas.toDataURL('image/jpeg');
            setCroppedImage(croppedImageDataUrl);
          }
        };
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {croppedImage && <img src={croppedImage} alt="Cropped" />}
    </div>
  );
};

export default ImageCropper;
