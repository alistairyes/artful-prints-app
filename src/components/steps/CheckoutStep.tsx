import { useState } from "react";
import { ArrowLeft, CreditCard, MapPin, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import type { AppStep, OrderData } from "../ColoringApp";

interface CheckoutStepProps {
  onComplete: (step: AppStep, data: Partial<OrderData>) => void;
  onBack: () => void;
  orderData: OrderData;
}

interface PrintItem {
  sizeId: string;
  quantity: number;
  price: number;
}

const CheckoutStep = ({ onComplete, onBack, orderData }: CheckoutStepProps) => {
  const [shippingInfo, setShippingInfo] = useState({
    name: orderData.shippingInfo?.name || "",
    email: orderData.shippingInfo?.email || "",
    address: orderData.shippingInfo?.address || "",
    city: orderData.shippingInfo?.city || "",
    zip: orderData.shippingInfo?.zip || "",
    country: orderData.shippingInfo?.country || "US",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const required = ['name', 'email', 'address', 'city', 'zip'];
    const missing = required.filter(field => !shippingInfo[field as keyof typeof shippingInfo]);
    
    if (missing.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in: ${missing.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // In a real app, this would integrate with Shopify
      toast({
        title: "Processing order...",
        description: "Creating your order in our system",
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Order confirmed! 🎉",
        description: "You'll receive a confirmation email shortly",
      });

      onComplete("checkout", { shippingInfo });
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const shippingCost = 4.99;
  const subtotal = orderData.price || 0;
  const total = subtotal + shippingCost;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          disabled={isProcessing}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Almost Done!</h2>
        <p className="text-muted-foreground text-sm">
          Enter shipping details to complete your order
        </p>
      </div>

      {/* Order Summary */}
      <Card className="p-4 bg-gradient-card border-0 shadow-card">
        <div className="space-y-3">
          <h3 className="font-semibold">Order Summary</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Print ({orderData.printSize}) × {orderData.quantity}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <hr className="border-muted" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Shipping Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="p-4 bg-gradient-card border-0 shadow-card">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Shipping Information
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={shippingInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  type="text"
                  value={shippingInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code *</Label>
                  <Input
                    id="zip"
                    type="text"
                    value={shippingInfo.zip}
                    onChange={(e) => handleInputChange('zip', e.target.value)}
                    placeholder="12345"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Button
          type="submit"
          variant="fun"
          size="lg"
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : `Complete Order - $${total.toFixed(2)}`}
        </Button>
      </form>

      {/* Note about Shopify integration */}
      <Card className="p-4 bg-muted/50 border-0">
        <p className="text-xs text-muted-foreground text-center">
          💡 In the next version, this will integrate with Shopify for secure payment processing
        </p>
      </Card>
    </div>
  );
};

export default CheckoutStep;