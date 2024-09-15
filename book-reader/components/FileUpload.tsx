import React, { useState } from 'react';

const FileUpload = ({ onFilesUploaded }: { onFilesUploaded: (files: File[]) => void }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onFilesUploaded(files);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
