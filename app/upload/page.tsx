"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, X, FileIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface FilePreview {
  file: File;
  preview: string;
}

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const newFiles = files.map(file => ({
      file,
      preview: file.type.startsWith('image/') 
        ? URL.createObjectURL(file)
        : ''
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to upload.');

      for (const { file } of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.id);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-image`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Failed to upload file');
        }
      }

      toast({
        title: 'Success',
        description: 'Files uploaded successfully.',
      });

      setSelectedFiles(prev => {
        prev.forEach(p => p.preview && URL.revokeObjectURL(p.preview));
        return [];
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to upload files.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Files
          </CardTitle>
          <CardDescription>
            Upload your files securely. Supported formats include images, documents, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <Input
                type="file"
                className="hidden"
                id="file-upload"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-10 h-10 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Drag and drop your files here, or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Maximum file size: 10MB
                </p>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 truncate">
                      {file.file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={selectedFiles.length === 0 || isUploading}
            >
              {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? 'File' : 'Files'}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}