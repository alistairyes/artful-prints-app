import { useState } from "react";
import { ArrowLeft, Eye, RotateCcw, CheckCircle, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import ProductMockup from "@/components/ProductMockup";
import type { AppStep, OrderData } from "../ColoringApp";

interface PreviewStepProps {
  onComplete: (step: AppStep, data: Partial<OrderData>) => void;
  onBack: () => void;
  orderData: OrderData;
}

const PreviewStep = ({ onComplete, onBack, orderData }: PreviewStepProps) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<'frame' | 'mug' | 'tshirt' | 'thermos'>(orderData.productType || 'frame');

  const handleApprove = () => {
    toast({
      title: "Perfect choice! 🎉",
      description: "Your colored artwork looks amazing!",
    });
    
    onComplete("preview", { 
      productType: selectedProduct 
    });
  };

  const handleTryAgain = () => {
    toast({
      title: "Let's try another style! 🎨",
      description: "Going back to style selection...",
    });
    onBack();
  };

  const handleProductSelect = (product: 'frame' | 'mug' | 'tshirt' | 'thermos') => {
    setSelectedProduct(product);
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
          <Palette className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Your Colored Drawing!</h2>
        <p className="text-muted-foreground text-sm">
          How does it look? You can compare with the original
        </p>
      </div>

      {/* Image Preview */}
      <Card className="p-4 bg-gradient-card border-0 shadow-card">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Your Artwork</h3>
            <Button
              variant="soft"
              size="sm"
              onClick={toggleView}
              className="text-xs"
            >
              <Eye className="w-4 h-4" />
              {showOriginal ? "Show Colored" : "Show Original"}
            </Button>
          </div>
          
          <div className="relative">
            <img
              src={showOriginal 
                ? (orderData.originalImage ? URL.createObjectURL(orderData.originalImage) : "")
                : (orderData.coloredImage || "")
              }
              alt={showOriginal ? "Original drawing" : "Colored artwork"}
              className="w-full h-auto rounded-lg shadow-fun max-h-64 object-contain mx-auto block"
            />
            
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {showOriginal ? "Original" : "Colored"}
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Style: <span className="font-semibold text-primary capitalize">{orderData.selectedStyle}</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Product Mockup */}
      {orderData.coloredImage && (
        <ProductMockup
          coloredImage={orderData.coloredImage}
          selectedProduct={selectedProduct}
          onProductSelect={handleProductSelect}
        />
      )}

      {/* Action Buttons */}
      {orderData.coloredImage && (
        <div className="space-y-3">
          <Button
            variant="soft"
            size="lg"
            className="w-full"
            onClick={handleTryAgain}
          >
            <RotateCcw className="w-4 h-4" />
            Try Different Style
          </Button>
          
          <Button
            variant="fun"
            size="lg"
            className="flex-1"
            onClick={handleApprove}
          >
            <CheckCircle className="w-5 h-5" />
            Perfect! Let's Print
          </Button>
        </div>
      )}

      {/* Credits Info */}
      <Card className="p-4 bg-muted/50 border-0">
        <p className="text-xs text-muted-foreground text-center">
          🎯 Free generations: {3 - (orderData.generationAttempts || 0)} remaining
        </p>
      </Card>
    </div>
  );
};

export default PreviewStep;