"use client";

import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface UploadedFile {
  _id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  storageId: string;
}

interface FileUploadProps {
  label: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  currentFiles?: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  showPreview?: boolean;
}

const FileUpload = ({
                      label,
                      description,
                      accept = "*/*",
                      multiple = false,
                      maxSize = 10,
                      maxFiles = 1,
                      currentFiles = [],
                      onFilesChange,
                      onError,
                      disabled = false,
                      showPreview = true,
                    }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFileRecord = useMutation(api.files.saveFileRecord);
  const deleteFile = useMutation(api.files.deleteFile);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    if (accept !== "*/*") {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type || '';
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return type.toLowerCase() === fileExtension;
        }
        if (type.includes('/')) {
          return fileType.match(new RegExp(type.replace('*', '.*')));
        }
        return false;
      });

      if (!isAccepted) {
        return `File type not accepted. Accepted types: ${accept}`;
      }
    }

    return null;
  }, [maxSize, accept]);

  const uploadFile = useCallback(async (file: File): Promise<UploadedFile | null> => {
    try {
      const uploadUrl = await generateUploadUrl();

      if (!uploadUrl) {
        throw new Error('Failed to generate upload URL');
      }

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const storageId = result.storageId;

      const fileRecord = await saveFileRecord({
        name: file.name,
        size: file.size,
        type: file.type,
        storageId,
      });

      if (!fileRecord.success) {
        throw new Error(fileRecord.error || 'Failed to save file record');
      }

      return {
        _id: fileRecord.fileId!,
        name: file.name,
        size: file.size,
        type: file.type,
        storageId,
        url: result.url,
      };
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  }, [generateUploadUrl, saveFileRecord]);

  const handleFiles = useCallback(async (files: FileList) => {
    if (disabled || isUploading) return;

    const fileArray = Array.from(files);

    const totalFiles = currentFiles.length + fileArray.length;
    if (totalFiles > maxFiles) {
      const error = `Cannot upload more than ${maxFiles} file(s)`;
      onError?.(error);
      toast.error(error);
      return;
    }

    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        onError?.(validationError);
        toast.error(validationError);
        return;
      }
    }

    setIsUploading(true);
    const uploadedFiles: UploadedFile[] = [];

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const fileId = `${file.name}-${Date.now()}`;

        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: Math.min((prev[fileId] || 0) + 10, 90)
          }));
        }, 100);

        const uploadedFile = await uploadFile(file);

        clearInterval(progressInterval);

        if (uploadedFile) {
          uploadedFiles.push(uploadedFile);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));

          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
          }, 1000);
        } else {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });

          const error = `Failed to upload ${file.name}`;
          onError?.(error);
          toast.error(error);
        }
      }

      if (uploadedFiles.length > 0) {
        onFilesChange([...currentFiles, ...uploadedFiles]);
        toast.success(`Successfully uploaded ${uploadedFiles.length} file(s)`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = 'Failed to upload files';
      onError?.(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  }, [disabled, isUploading, currentFiles, maxFiles, onError, onFilesChange, uploadFile, validateFile]);

  const handleRemoveFile = async (fileId: Id<"_storage">) => {
    if (disabled) return;

    try {
      const fileToRemove = currentFiles.find(f => f._id === fileId);
      if (fileToRemove) {

        await deleteFile({ fileId });

        const updatedFiles = currentFiles.filter(f => f._id !== fileId);
        onFilesChange(updatedFiles);

        toast.success('File removed successfully');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to remove file');
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, handleFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground">
              {accept !== "*/*" && `Accepted: ${accept} • `}
              Max {maxSize}MB per file
              {multiple && ` • Up to ${maxFiles} files`}
            </p>
          </div>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="truncate">{fileId.split('-')[0]}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          ))}
        </div>
      )}

      
      {showPreview && currentFiles.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Current Files ({currentFiles.length})
          </Label>
          <div className="space-y-2">
            {currentFiles.map((file) => (
              <div
                key={file._id}
                className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  {getFileIcon(file.type)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(file._id as Id<"_storage">)}
                  disabled={disabled}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      
      {multiple && maxFiles > 1 && (
        <div className="text-xs text-muted-foreground">
          {currentFiles.length} of {maxFiles} files uploaded
        </div>
      )}
    </div>
  );
};

export default FileUpload;