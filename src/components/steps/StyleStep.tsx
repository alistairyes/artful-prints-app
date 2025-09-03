import { useState } from "react";
import { ArrowLeft, Sparkles, Brush, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
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

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleContinue = () => {
    if (!selectedStyle) {
      toast({
        title: "Pick a style!",
        description: "Choose how you want your drawing colored",
        variant: "destructive",
      });
      return;
    }

    // Simulate AI coloring process
    toast({
      title: "Creating magic! ✨",
      description: "Our AI is coloring your drawing...",
    });

    // In a real app, this would call an AI API
    setTimeout(() => {
      onComplete("style", { selectedStyle });
    }, 2000);
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

      {selectedStyle && (
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