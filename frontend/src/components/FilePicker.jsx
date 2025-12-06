import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FilePicker = ({ onFilesSelected, maxFiles = 10, accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] } }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    onFilesSelected(newFiles.slice(0, maxFiles));
  }, [maxFiles, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 hover:border-primary-400'
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-gray-600">
        {isDragActive
          ? 'Drop the files here...'
          : 'Drag & drop images here, or click to select'}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Max {maxFiles} files, 5MB each (JPEG, PNG, WebP)
      </p>
    </div>
  );
};

export default FilePicker;

