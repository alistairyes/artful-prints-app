import { useState } from "react";
import { ArrowLeft, Minus, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import type { AppStep, OrderData } from "../ColoringApp";

interface PrintStepProps {
  onComplete: (step: AppStep, data: Partial<OrderData>) => void;
  onBack: () => void;
  orderData: OrderData;
}

const printSizes = [
  {
    id: "5x7",
    name: "5\" × 7\"",
    description: "Perfect for framing",
    price: 9.99,
    popular: false,
  },
  {
    id: "8x10",
    name: "8\" × 10\"",
    description: "Most popular size",
    price: 14.99,
    popular: true,
  },
  {
    id: "11x14",
    name: "11\" × 14\"",
    description: "Large display piece",
    price: 19.99,
    popular: false,
  },
  {
    id: "16x20",
    name: "16\" × 20\"",
    description: "Premium poster size",
    price: 29.99,
    popular: false,
  },
];

interface PrintItem {
  sizeId: string;
  quantity: number;
  price: number;
}

const PrintStep = ({ onComplete, onBack, orderData }: PrintStepProps) => {
  const [selectedSize, setSelectedSize] = useState<string>(orderData.printSize || "");
  const [quantity, setQuantity] = useState<number>(orderData.quantity || 1);

  const selectedPrintSize = printSizes.find(size => size.id === selectedSize);
  const totalPrice = selectedPrintSize ? selectedPrintSize.price * quantity : 0;

  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleContinue = () => {
    if (!selectedSize) {
      toast({
        title: "Choose a size!",
        description: "Please select how big you want your print",
        variant: "destructive",
      });
      return;
    }

    onComplete("print", { 
      printSize: selectedSize,
      quantity,
      price: totalPrice
    });
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
          <Package className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Choose Print Size</h2>
        <p className="text-muted-foreground text-sm">
          High-quality prints on premium paper
        </p>
      </div>

      {/* Size Options */}
      <div className="space-y-3">
        {printSizes.map((size) => (
          <Card
            key={size.id}
            className={`p-4 cursor-pointer transition-all duration-300 border-2 relative ${
              selectedSize === size.id
                ? "border-primary shadow-glow bg-gradient-card"
                : "border-transparent hover:border-muted-foreground/20 bg-gradient-card hover:shadow-card"
            }`}
            onClick={() => handleSizeSelect(size.id)}
          >
            {size.popular && (
              <div className="absolute -top-2 -right-2 bg-gradient-rainbow text-white text-xs px-2 py-1 rounded-full font-semibold shadow-fun">
                Popular!
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{size.name}</h3>
                <p className="text-sm text-muted-foreground">{size.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-primary">${size.price}</p>
                <p className="text-xs text-muted-foreground">each</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quantity Selector */}
      {selectedSize && (
        <Card className="p-4 bg-gradient-card border-0 shadow-card">
          <div className="space-y-4">
            <h3 className="font-semibold text-center">Quantity</h3>
            
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="soft"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <div className="w-16 h-12 bg-white rounded-lg border-2 border-muted flex items-center justify-center">
                <span className="text-xl font-bold text-foreground">{quantity}</span>
              </div>
              
              <Button
                variant="soft"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Price Summary */}
            <div className="text-center space-y-1">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{selectedPrintSize?.name} × {quantity}</span>
                <span>${(totalPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {selectedSize && (
        <Button
          variant="fun"
          size="lg"
          className="w-full"
          onClick={handleContinue}
        >
          Continue to Checkout 🛒
        </Button>
      )}

      {/* Quality Promise */}
      <Card className="p-4 bg-muted/50 border-0">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            🏆 Quality Promise:
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Premium matte paper</li>
            <li>• Vibrant, fade-resistant colors</li>
            <li>• Carefully packaged & shipped</li>
            <li>• 100% satisfaction guarantee</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default PrintStep;