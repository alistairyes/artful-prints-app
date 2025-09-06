import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductMockupProps {
  coloredImage: string;
  selectedProduct?: 'frame' | 'mug' | 'tshirt' | 'thermos';
  onProductSelect: (product: 'frame' | 'mug' | 'tshirt' | 'thermos') => void;
}

const products = [
  {
    id: 'frame' as const,
    name: 'Picture Frame',
    description: 'Beautiful wall frame',
    icon: '🖼️',
    mockupStyle: 'border-8 border-amber-800 shadow-xl rounded-lg bg-amber-50 p-4'
  },
  {
    id: 'mug' as const,
    name: 'Coffee Mug',
    description: 'Ceramic coffee mug',
    icon: '☕',
    mockupStyle: 'rounded-full border-4 border-white shadow-lg bg-white p-2 transform perspective-1000 rotateY-15'
  },
  {
    id: 'tshirt' as const,
    name: 'T-Shirt',
    description: 'Premium cotton tee',
    icon: '👕',
    mockupStyle: 'rounded-lg border-2 border-gray-300 bg-white p-6 shadow-md'
  },
  {
    id: 'thermos' as const,
    name: 'Thermos',
    description: 'Insulated bottle',
    icon: '🌡️',
    mockupStyle: 'rounded-full border-4 border-steel-400 bg-steel-100 p-3 shadow-lg'
  }
];

const ProductMockup = ({ coloredImage, selectedProduct, onProductSelect }: ProductMockupProps) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const selectedProductData = products.find(p => p.id === selectedProduct);

  return (
    <div className="space-y-6">
      {/* Product Preview */}
      {selectedProduct && (
        <Card className="p-6 bg-gradient-card border-0 shadow-card">
          <div className="text-center space-y-4">
            <h3 className="font-semibold text-lg">Preview on {selectedProductData?.name}</h3>
            
            <div className="relative inline-block">
              <div className={`${selectedProductData?.mockupStyle} relative overflow-hidden max-w-xs mx-auto`}>
                <img
                  src={coloredImage}
                  alt="Colored artwork"
                  className="w-full h-auto object-cover"
                  style={{
                    maxHeight: selectedProduct === 'mug' ? '120px' : 
                               selectedProduct === 'tshirt' ? '180px' :
                               selectedProduct === 'thermos' ? '140px' : '200px'
                  }}
                />
                
                {/* Product-specific overlays */}
                {selectedProduct === 'frame' && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-700 to-amber-600 opacity-80"></div>
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-amber-700 to-amber-600 opacity-80"></div>
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-700 to-amber-600 opacity-80"></div>
                    <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-amber-700 to-amber-600 opacity-80"></div>
                  </div>
                )}
                
                {selectedProduct === 'mug' && (
                  <div className="absolute -right-6 top-1/4 w-8 h-12 border-4 border-white rounded-full bg-white opacity-80"></div>
                )}
                
                {selectedProduct === 'tshirt' && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-gray-200 rounded-b-full opacity-60"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Product Selection */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <Card
            key={product.id}
            className={`p-4 cursor-pointer transition-all duration-300 border-2 ${
              selectedProduct === product.id
                ? "border-primary shadow-glow bg-gradient-card"
                : hoveredProduct === product.id
                ? "border-muted-foreground/20 bg-gradient-card shadow-card"
                : "border-transparent bg-gradient-card hover:shadow-card"
            }`}
            onClick={() => onProductSelect(product.id)}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="text-center space-y-2">
              <div className="text-2xl">{product.icon}</div>
              <div>
                <h4 className="font-semibold text-sm text-foreground">{product.name}</h4>
                <p className="text-xs text-muted-foreground">{product.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedProduct && (
        <div className="text-center">
          <Button variant="fun" size="sm" className="w-full">
            Add {selectedProductData?.name} to Order
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductMockup;