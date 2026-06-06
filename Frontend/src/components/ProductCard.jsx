import {
  EditIcon,
  Trash2Icon,
  ShoppingCartIcon,
  EyeIcon,
  CreditCardIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useState } from "react";

function ProductCard({ product, isAdmin = true, onOrderClick }) {
  const { deleteProduct } = useProductStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Construct full image URL
  const getImageUrl = () => {
    if (!product.image) return '';

    // If it's a relative path, prepend the API URL
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}${product.image}`;
  };
  
  const handleImageError = (e) => {
    console.error('Image failed to load:', getImageUrl());
    setImageError(true);
    // Placeholder image with gradient
    e.target.style.display = 'none';
  };

  const handleOrder = () => {
    if (onOrderClick) {
      onOrderClick(product);
    }
  };
  
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-base-300/50 overflow-hidden group">
      {/* PRODUCT IMAGE */}
      <figure className="relative overflow-hidden bg-base-200">
        <div className="aspect-square w-full relative">
          {/* Loading Skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-base-300 via-base-200 to-base-300" />
          )}
          
          {/* Image Error Placeholder */}
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <ShoppingCartIcon className="size-20 text-base-content/30 mb-2" />
              <p className="text-sm text-base-content/50 font-medium">Product Image</p>
            </div>
          )}
          
          {/* Actual Image */}
          {!imageError && (
            <img
              src={getImageUrl()}
              alt={product.name}
              className={`absolute top-0 left-0 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              loading="lazy"
            />
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
              <Link 
                to={`/product/${product.id}`} 
                className="btn btn-sm btn-primary w-full gap-2 shadow-xl"
              >
                <EyeIcon className="size-4" />
                View Details
              </Link>
              {!isAdmin && (
                <button
                  type="button"
                  onClick={handleOrder}
                  className="btn btn-sm btn-secondary w-full gap-2 shadow-xl"
                >
                  <CreditCardIcon className="size-4" />
                  Order Now
                </button>
              )}
            </div>
          </div>
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3 z-10">
            <div className="badge badge-lg badge-primary font-bold shadow-xl px-4 py-3">
              ${Number(product.price).toFixed(2)}
            </div>
          </div>
        </div>
      </figure>

      <div className="card-body p-4">
        {/* PRODUCT INFO */}
        <h2 className="card-title text-base font-bold line-clamp-2 min-h-[3rem]">
          {product.name}
        </h2>
        
        {/* Price - Mobile/Tablet */}
        <div className="flex items-center justify-between mt-2 lg:hidden">
          <p className="text-2xl font-bold text-primary">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>

        {/* CARD ACTIONS */}
        <div className="divider my-2"></div>
        <div className="flex gap-2">
          {isAdmin ? (
            <>
              <Link 
                to={`/product/${product.id}`} 
                className="btn btn-sm btn-info btn-outline flex-1 gap-1"
                title="Edit Product"
              >
                <EditIcon className="size-4" />
                <span className="hidden sm:inline">Edit</span>
              </Link>

              <button
                className="btn btn-sm btn-error btn-outline gap-1"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                    deleteProduct(product.id);
                  }
                }}
                title="Delete Product"
                type="button"
              >
                <Trash2Icon className="size-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleOrder}
              className="btn btn-sm btn-primary flex-1 gap-2"
            >
              <ShoppingCartIcon className="size-4" />
              Order Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
