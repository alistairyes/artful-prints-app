import { useState, useRef } from "react";
import { Upload, Camera, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import type { AppStep, OrderData } from "../ColoringApp";

interface UploadStepProps {
  onComplete: (step: AppStep, data: Partial<OrderData>) => void;
  orderData: OrderData;
}

const UploadStep = ({ onComplete, orderData }: UploadStepProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(orderData.originalImage || null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Oops!",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleContinue = () => {
    if (!selectedImage) {
      toast({
        title: "Almost there!",
        description: "Please upload a drawing first",
        variant: "destructive",
      });
      return;
    }

    onComplete("upload", { originalImage: selectedImage });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
          <Upload className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Upload Your Drawing</h2>
        <p className="text-muted-foreground text-sm">
          Take a photo or choose from your gallery
        </p>
      </div>

      {/* Upload Options */}
      <div className="space-y-3">
        <Button
          variant="magic"
          size="lg"
          className="w-full"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera className="w-5 h-5" />
          Take Photo
        </Button>

        <Button
          variant="soft"
          size="lg"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-5 h-5" />
          Choose from Gallery
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Preview */}
      {previewUrl && (
        <Card className="p-4 bg-gradient-card border-0 shadow-card">
          <div className="space-y-3">
            <h3 className="font-semibold text-center">Your Drawing</h3>
            <div className="aspect-square bg-white rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/20">
              <img
                src={previewUrl}
                alt="Selected drawing"
                className="w-full h-full object-contain"
              />
            </div>
            <Button
              variant="fun"
              size="lg"
              className="w-full"
              onClick={handleContinue}
            >
              Let's Add Color! ✨
            </Button>
          </div>
        </Card>
      )}

      {/* Tips */}
      <Card className="p-4 bg-muted/50 border-0">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            💡 Tips for best results:
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use clear, bold pencil lines</li>
            <li>• Make sure the drawing is well-lit</li>
            <li>• Keep the background plain</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default UploadStep;