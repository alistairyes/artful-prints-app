import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import type { AppStep, OrderData } from "../ColoringApp";

interface PreviewStepProps {
  onComplete: (step: AppStep, data: Partial<OrderData>) => void;
  onBack: () => void;
  orderData: OrderData;
}

const PreviewStep = ({ onComplete, onBack, orderData }: PreviewStepProps) => {
  const [showOriginal, setShowOriginal] = useState(false);
  
  // In a real app, this would be the AI-colored image URL
  const coloredImageUrl = "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center";
  const originalImageUrl = orderData.originalImage ? URL.createObjectURL(orderData.originalImage) : "";

  const handleApprove = () => {
    toast({
      title: "Perfect choice! 🎨",
      description: "Your colored drawing looks amazing!",
    });
    
    onComplete("preview", { 
      coloredImage: coloredImageUrl 
    });
  };

  const handleTryAgain = () => {
    toast({
      title: "No problem!",
      description: "Let's try a different style",
    });
    onBack();
  };

  const toggleView = () => {
    setShowOriginal(!showOriginal);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Your Colored Drawing!</h2>
        <p className="text-muted-foreground text-sm">
          How does it look? You can compare with the original
        </p>
      </div>

      {/* Image Preview */}
      <Card className="p-4 bg-gradient-card border-0 shadow-card">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Button
              variant="soft"
              size="sm"
              onClick={toggleView}
              className="transition-all duration-300"
            >
              {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showOriginal ? "Show Colored" : "Show Original"}
            </Button>
          </div>
          
          <div className="aspect-square bg-white rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/20 relative">
            <img
              src={showOriginal ? originalImageUrl : coloredImageUrl}
              alt={showOriginal ? "Original drawing" : "Colored drawing"}
              className="w-full h-full object-contain transition-all duration-500"
            />
            
            {/* Overlay label */}
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                showOriginal 
                  ? "bg-muted text-muted-foreground" 
                  : "bg-gradient-primary text-white shadow-fun"
              }`}>
                {showOriginal ? "Original" : "AI Colored"}
              </span>
            </div>
          </div>

          {/* Style Info */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Style: <span className="font-semibold text-foreground capitalize">
                {orderData.selectedStyle?.replace('-', ' ')}
              </span>
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="fun"
          size="lg"
          className="w-full"
          onClick={handleApprove}
        >
          I Love It! Let's Print 🖨️
        </Button>
        
        <Button
          variant="soft"
          size="lg"
          className="w-full"
          onClick={handleTryAgain}
        >
          <RotateCcw className="w-4 h-4" />
          Try Different Style
        </Button>
      </div>

      {/* Quality Note */}
      <Card className="p-4 bg-muted/50 border-0">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            ✨ AI Magic Complete!
          </h4>
          <p className="text-xs text-muted-foreground">
            Your drawing has been enhanced with beautiful colors while keeping all the original details.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PreviewStep;