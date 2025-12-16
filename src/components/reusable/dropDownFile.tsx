'use client';
import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Label } from '../ui/label';

type FileUploadBoxProps = {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  label?: string;
};

export default function FileUploadBox({
  uploadedFile,
  setUploadedFile,
  label = 'Profile Picture (Optional)',
}: FileUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [uploadedFile]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (file: File | null) => {
    if (file && file.size <= 10 * 1024 * 1024) {
      setUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file || null);
  };
  return (
    <div className="space-y-2 mt-2">
      <Label>{label}</Label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/gif"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
      />

      <div
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        className={`w-full h-36 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        {uploadedFile ? (
          <div className="flex flex-col items-center gap-2 relative">
            <X
              className="w-4 h-4 text-red-500 cursor-pointer absolute -top-36 right-3"
              onClick={(e) => {
                e.stopPropagation();
                if (fileInputRef.current) fileInputRef.current.value = '';
                setUploadedFile(null);
              }}
            />

            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 19L18 13M12 19L6 13M12 19V5"
                stroke="#757575"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-gray-600">Upload a file or drag and drop</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 19L18 13M12 19L6 13M12 19V5"
                stroke="#757575"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-gray-600">Upload a file or drag and drop</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
