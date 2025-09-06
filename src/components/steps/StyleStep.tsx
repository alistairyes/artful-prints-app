import { useState } from "react";
import { ArrowLeft, Sparkles, Brush, Palette, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { AppStep, OrderData } from "../ColoringApp";

interface StyleStepProps {
  onComplete: (step: AppStep, data: Partial<OrderData>) => void;
  onBack: () => void;
  orderData: OrderData;
}

const coloringStyles = [
  {
    id: "storybook",
    name: "Storybook Magic",
    description: "Soft, dreamy colors like fairy tale illustrations",
    icon: "📚",
    gradient: "from-purple-400 to-pink-400",
  },
  {
    id: "crayons",
    name: "Crayon Fun",
    description: "Bold, vibrant crayon-like colors",
    icon: "🖍️",
    gradient: "from-red-400 to-yellow-400",
  },
  {
    id: "bold",
    name: "Bold & Bright",
    description: "High contrast, eye-catching colors",
    icon: "⚡",
    gradient: "from-blue-500 to-green-400",
  },
  {
    id: "fantasy",
    name: "Fantasy World",
    description: "Magical colors with shimmer and shine",
    icon: "🦄",
    gradient: "from-purple-500 to-blue-500",
  },
  {
    id: "surprise",
    name: "Surprise Me!",
    description: "Let AI choose the perfect style",
    icon: "🎲",
    gradient: "from-pink-500 to-orange-400",
  },
];

const StyleStep = ({ onComplete, onBack, orderData }: StyleStepProps) => {
  const [selectedStyle, setSelectedStyle] = useState<string>(orderData.selectedStyle || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationAttempts, setGenerationAttempts] = useState(orderData.generationAttempts || 0);

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleContinue = async () => {
    console.log("handleContinue called");
    console.log("selectedStyle:", selectedStyle);
    console.log("orderData.originalImage:", orderData.originalImage);
    
    if (!selectedStyle) {
      toast({
        title: "Pick a style!",
        description: "Choose how you want your drawing colored",
        variant: "destructive",
      });
      return;
    }

    if (!orderData.originalImage) {
      toast({
        title: "No image found",
        description: "Please go back and upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      console.log("Converting image to base64...");
      // Convert image to base64
      const imageData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(orderData.originalImage!);
      });

      console.log("Image converted, imageData length:", imageData.length);

      toast({
        title: "Creating magic! ✨",
        description: "Our AI is coloring your drawing...",
      });

      console.log("Calling edge function with:", { selectedStyle, imageDataLength: imageData.length });
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('generate-colored-image', {
        body: {
          imageData,
          selectedStyle
        }
      });

      console.log("Edge function response:", { data, error });

      if (error) {
        if (error.status === 401) {
          toast({
            title: "Authentication required",
            description: "Please sign in to use the coloring feature",
            variant: "destructive",
          });
          return;
        }
        if (error.status === 402) {
          toast({
            title: "Need more credits! 💰",
            description: "You've used all free generations. Purchase credits to continue.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      if (!data.coloredImageUrl) {
        throw new Error("No image returned from AI");
      }

      toast({
        title: "Magic complete! 🎨",
        description: "Your drawing has been beautifully colored!",
      });

      const newAttempts = generationAttempts + 1;
      setGenerationAttempts(newAttempts);
      
      onComplete("style", { 
        selectedStyle, 
        coloredImage: data.coloredImageUrl,
        generationAttempts: newAttempts
      });

    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Oops! Something went wrong",
        description: "Please try again or contact support if the problem persists",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
        <div className="w-16 h-16 bg-gradient-rainbow rounded-full flex items-center justify-center mx-auto shadow-glow">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Choose Your Style</h2>
        <p className="text-muted-foreground text-sm">
          How should we color your masterpiece?
        </p>
      </div>

      {/* Style Options */}
      <div className="space-y-3">
        {coloringStyles.map((style) => (
          <Card
            key={style.id}
            className={`p-4 cursor-pointer transition-all duration-300 border-2 ${
              selectedStyle === style.id
                ? "border-primary shadow-glow bg-gradient-card"
                : "border-transparent hover:border-muted-foreground/20 bg-gradient-card hover:shadow-card"
            }`}
            onClick={() => handleStyleSelect(style.id)}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${style.gradient} flex items-center justify-center text-white text-lg shadow-fun`}>
                {style.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-foreground">{style.name}</h3>
                <p className="text-sm text-muted-foreground">{style.description}</p>
              </div>
              {selectedStyle === style.id && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {selectedStyle && !isGenerating && (
        <Button
          variant="fun"
          size="lg"
          className="w-full"
          onClick={handleContinue}
        >
          <Brush className="w-5 h-5" />
          Start Coloring Magic!
        </Button>
      )}

      {isGenerating && (
        <Button
          variant="fun"
          size="lg"
          className="w-full"
          disabled
        >
          <Zap className="w-5 h-5 animate-pulse" />
          Creating Magic... Please Wait
        </Button>
      )}

      {/* Generation Attempts Counter */}
      {generationAttempts > 0 && (
        <Card className="p-3 bg-muted/50 border-0">
          <p className="text-xs text-muted-foreground text-center">
            🎨 Generations used: {generationAttempts}/3 free
            {generationAttempts >= 3 && " (Additional generations require credits)"}
          </p>
        </Card>
      )}

      {/* Preview Note */}
      <Card className="p-4 bg-muted/50 border-0">
        <p className="text-xs text-muted-foreground text-center">
          🎨 Don't worry! You'll see a preview before ordering
        </p>
      </Card>
    </div>
  );
};

export default StyleStep;