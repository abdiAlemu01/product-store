import {
  EditIcon,
  Trash2Icon,
  ShoppingCartIcon,
  EyeIcon,
  CreditCardIcon,
  ImageOffIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useState } from "react";
import { LABELS } from "../constants/labels";

function ProductCard({ product, isAdmin = true, onOrderClick, priority = false }) {
  const { deleteProduct } = useProductStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const getImageUrl = () => {
    if (!product.image) return "";

    if (product.image.startsWith("http://") || product.image.startsWith("https://")) {
      return product.image;
    }

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    return `${baseUrl}${product.image}`;
  };

  const hasImage = Boolean(product.image);
  const imageUrl = getImageUrl();

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageRetry = () => {
    setImageError(false);
    setImageLoaded(false);
    setRetryKey((key) => key + 1);
  };

  const handleOrder = () => {
    if (onOrderClick) {
      onOrderClick(product);
    }
  };

  const showLoadingState = hasImage && !imageLoaded && !imageError;
  const showMissingImage = !hasImage || imageError;

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-base-300/50 overflow-hidden group">
      <figure className="relative overflow-hidden bg-base-200">
        <div className="aspect-square w-full relative">
          {showLoadingState && (
            <>
              <div className="absolute inset-0 image-shimmer" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-base-200/80">
                <div className="loading loading-spinner loading-md text-primary" />
                <span className="text-xs text-base-content/60 font-medium">Loading image...</span>
              </div>
            </>
          )}

          {showMissingImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/10 to-secondary/10 px-4 text-center">
              <ImageOffIcon className="size-10 sm:size-12 text-base-content/30" aria-hidden="true" />
              <p className="text-xs sm:text-sm text-base-content/60 font-medium">
                {imageError ? "Image couldn't load" : "No image available"}
              </p>
              {imageError && hasImage && (
                <button
                  type="button"
                  className="btn btn-xs btn-ghost gap-1 mt-1"
                  onClick={handleImageRetry}
                  aria-label={`Retry loading image for ${product.name}`}
                >
                  <RefreshCwIcon className="size-3" />
                  Tap to retry
                </button>
              )}
            </div>
          )}

          {hasImage && !imageError && (
            <img
              key={retryKey}
              src={imageUrl}
              alt={product.name}
              className={`absolute top-0 left-0 w-full h-full object-contain p-2 sm:p-3 transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              decoding="async"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:block">
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
              <Link
                to={`/product/${product.id}`}
                className="btn btn-sm btn-primary w-full gap-2 shadow-xl"
              >
                <EyeIcon className="size-4" />
                {LABELS.viewDetails}
              </Link>
              {!isAdmin && (
                <button
                  type="button"
                  onClick={handleOrder}
                  className="btn btn-sm btn-secondary w-full gap-2 shadow-xl"
                >
                  <CreditCardIcon className="size-4" />
                  {LABELS.order}
                </button>
              )}
            </div>
          </div>

        </div>
      </figure>

      <div className="card-body p-3 sm:p-4">
        <h2 className="card-title text-sm sm:text-base font-bold line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {product.name}
        </h2>

        <div className="divider my-1 sm:my-2" />

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
            <>
              <Link
                to={`/product/${product.id}`}
                className="btn btn-sm btn-outline flex-1 gap-1 lg:hidden"
              >
                <EyeIcon className="size-4" />
                <span className="hidden sm:inline">{LABELS.viewDetails}</span>
              </Link>
              <button
                type="button"
                onClick={handleOrder}
                className="btn btn-sm btn-primary flex-1 gap-2"
              >
                <ShoppingCartIcon className="size-4" />
                {LABELS.order}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
