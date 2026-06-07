import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useEffect } from "react";
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

// Helper: returns a usable image URL whether it's a Cloudinary full URL or a legacy relative path
const resolveImageUrl = (imageField) => {
  if (!imageField) return '';
  if (typeof imageField !== 'string') return URL.createObjectURL(imageField);
  if (imageField.startsWith('http://') || imageField.startsWith('https://')) return imageField;
  // Legacy relative path from local /uploads/
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return `${base}${imageField}`;
};
function ProductPage() {
  const {
    currentProduct,
    formData,
    setFormData,
    loading,
    error,
    fetchProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { id } = useParams();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <button onClick={() => navigate("/")} className="btn btn-ghost mb-8 gap-2">
        <ArrowLeftIcon className="size-5" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PRODUCT IMAGE - Full Display */}
        <div className="bg-base-100 rounded-2xl overflow-hidden shadow-2xl border-2 border-base-300/50">
          <div className="aspect-square w-full relative bg-base-200">
            <img
              src={resolveImageUrl(currentProduct?.image)}
              alt={currentProduct?.name}
              className="absolute inset-0 w-full h-full object-contain p-4"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x800?text=Image+Not+Found';
              }}
            />
            {/* Image Border Frame */}
            <div className="absolute inset-4 border-2 border-primary/20 rounded-lg pointer-events-none"></div>
          </div>
          
          {/* Product Details Under Image */}
          <div className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{currentProduct?.name}</h1>
            <span className="text-sm text-base-content/60">
              Product ID: {currentProduct?.id}
            </span>
          </div>
        </div>

        {/* PRODUCT FORM */}
        {isAdmin ? (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Edit Product</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProduct(id);
                }}
                className="space-y-6"
              >
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-medium">Product Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    className="input input-bordered w-full"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-medium">Price</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="input input-bordered w-full"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-base font-medium">Product Image</span>
                  </label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert("Image size should be less than 5MB");
                            e.target.value = "";
                            return;
                          }
                          setFormData({ ...formData, image: file });
                        }
                      }}
                    />
                    {formData.image && (
                      <div className="relative w-full rounded-lg overflow-hidden border-2 border-primary/30 bg-base-200 shadow-lg">
                        <div className="aspect-square w-full relative">
                          <img
                            src={resolveImageUrl(formData.image)}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-contain p-2"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/400x400?text=Image+Preview";
                            }}
                          />
                        </div>
                        <div className="absolute top-2 right-2 z-10">
                          <div className="badge badge-success gap-1 shadow-lg">
                            {typeof formData.image === "string" ? "Current Image" : "New Image"}
                          </div>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-base-content/60">
                      Leave empty to keep current image. Max 5MB.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button type="button" onClick={handleDelete} className="btn btn-error">
                    <Trash2Icon className="size-4 mr-2" />
                    Delete Product
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !formData.name || !formData.price}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <SaveIcon className="size-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Customer View</h2>
              <p className="text-base-content/70">
                Customers can review product details here and place orders from the
                `Track Order` page after signing in with their phone number.
              </p>
              <button type="button" className="btn btn-primary mt-4" onClick={() => navigate("/track-order")}>
                Go To Customer Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ProductPage;
