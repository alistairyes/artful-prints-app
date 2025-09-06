import { useState } from "react";
import { Upload, Palette, Image, ShoppingCart, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UploadStep from "./steps/UploadStep";
import StyleStep from "./steps/StyleStep";
import PreviewStep from "./steps/PreviewStep";
import PrintStep from "./steps/PrintStep";
import CheckoutStep from "./steps/CheckoutStep";

export type AppStep = "upload" | "style" | "preview" | "print" | "checkout" | "complete";

export interface PrintItem {
  sizeId: string;
  quantity: number;
  price: number;
}

export interface OrderData {
  originalImage?: File;
  coloredImage?: string;
  selectedStyle?: string;
  printItems?: PrintItem[];
  printSize?: string;
  quantity?: number;
  price?: number;
  totalPrice?: number;
  generationAttempts?: number;
  productType?: 'frame' | 'mug' | 'tshirt' | 'thermos';
  shippingInfo?: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
}

const ColoringApp = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>("upload");
  const [orderData, setOrderData] = useState<OrderData>({});

  const steps = [
    { id: "upload", label: "Upload", icon: Upload },
    { id: "style", label: "Style", icon: Palette },
    { id: "preview", label: "Preview", icon: Image },
    { id: "print", label: "Print", icon: ShoppingCart },
    { id: "checkout", label: "Order", icon: CheckCircle },
  ];

  const handleStepComplete = (step: AppStep, data: Partial<OrderData>) => {
    setOrderData(prev => ({ ...prev, ...data }));
    
    const stepOrder: AppStep[] = ["upload", "style", "preview", "print", "checkout", "complete"];
    const currentIndex = stepOrder.indexOf(step);
    const nextStep = stepOrder[currentIndex + 1];
    
    if (nextStep) {
      setCurrentStep(nextStep);
    }
  };

  const handleBackStep = () => {
    const stepOrder: AppStep[] = ["upload", "style", "preview", "print", "checkout"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "upload":
        return <UploadStep onComplete={handleStepComplete} orderData={orderData} />;
      case "style":
        return <StyleStep onComplete={handleStepComplete} onBack={handleBackStep} orderData={orderData} />;
      case "preview":
        return <PreviewStep onComplete={handleStepComplete} onBack={handleBackStep} orderData={orderData} />;
      case "print":
        return <PrintStep onComplete={handleStepComplete} onBack={handleBackStep} orderData={orderData} />;
      case "checkout":
        return <CheckoutStep onComplete={handleStepComplete} onBack={handleBackStep} orderData={orderData} />;
      case "complete":
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-rainbow rounded-full flex items-center justify-center mx-auto shadow-glow">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Order Complete! 🎉
              </h2>
              <p className="text-muted-foreground">
                Your magical coloring will be printed and shipped soon!
              </p>
            </div>
            <Button
              variant="fun"
              size="lg"
              onClick={() => {
                setCurrentStep("upload");
                setOrderData({});
              }}
            >
              Color Another Drawing
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <div className="bg-white shadow-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent text-center">
            Magic Coloring Studio ✨
          </h1>
          
          {/* Progress Steps */}
          {currentStep !== "complete" && (
            <div className="flex justify-center mt-4 space-x-2">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                const StepIcon = step.icon;
                
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center space-y-1 ${
                      isActive ? "scale-110" : ""
                    } transition-all duration-300`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-accent shadow-fun"
                          : isActive
                          ? "bg-gradient-primary shadow-glow"
                          : "bg-muted"
                      }`}
                    >
                      <StepIcon
                        className={`w-5 h-5 ${
                          isCompleted || isActive ? "text-white" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto bg-gradient-card shadow-card border-0 backdrop-blur-sm">
          <div className="p-6">
            {renderStep()}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ColoringApp;