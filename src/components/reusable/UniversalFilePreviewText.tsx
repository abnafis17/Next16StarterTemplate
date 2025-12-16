"use client";

import { MEDIA_HOST } from "@/constant";
import { CircleCheckBig } from "lucide-react";
import React, { useEffect, useState } from "react";

interface UniversalFilePreviewProps {
  fileUrl?: string;
  fileObject?: File | null;
}
const getFileName = (path: string): string => {
  const cleanedPath = path.replace(/\\/g, "/").replace(/uploads\//g, "");
  return cleanedPath.split("/").pop() || "N/A";
};

const UniversalFilePreview: React.FC<UniversalFilePreviewProps> = ({
  fileUrl,
  fileObject,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    if (fileObject) {
      const objectUrl = URL.createObjectURL(fileObject);
      setPreviewUrl(objectUrl);
      setFileName(fileObject.name);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    if (fileUrl) {
      const formattedPath = fileUrl.replace(/\\/g, "/");
      const finalUrl = `${MEDIA_HOST}/${formattedPath}`;
      setPreviewUrl(finalUrl);
      setFileName(getFileName(formattedPath));
    }
  }, [fileObject, fileUrl]);

  if (!previewUrl || !fileName) {
    return (
      <div className="w-full h-10 flex items-center justify-center border rounded-md">
        <p className="text-sm text-muted-foreground">No file selected</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <CircleCheckBig className="w-4 h-4 text-green-600 shrink-0" />
      <a
        href={previewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-normal text-blue-500 hover:text-blue-700 print:text-black print:no-underline underline cursor-pointer"
      >
        {fileName}
      </a>
    </div>
  );
};

export default UniversalFilePreview;
