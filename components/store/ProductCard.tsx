'use client';

import { Plus } from 'lucide-react';

interface ProductProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  onAdd: (id: number) => void;
}

export function ProductCard({ product, onAdd }: ProductProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Image Area */}
      <div className="h-40 w-full relative bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-lg text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          <button 
            onClick={() => onAdd(product.id)}
            className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}