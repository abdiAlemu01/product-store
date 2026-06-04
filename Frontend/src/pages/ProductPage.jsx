import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useEffect } from "react";
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from "lucide-react";
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
  const navigate = useNavigate();
  const { id } = useParams();

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
    <div className="container mx-auto px-4 py-8 max-w-4xl h-screen ">
      <button onClick={() => navigate("/")} className="btn btn-ghost mb-8">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PRODUCT IMAGE */}
        <div className="rounded-lg overflow-hidden shadow-lg bg-base-100">
          <img
            src={
              currentProduct?.image?.startsWith('http') 
                ? currentProduct.image 
                : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${currentProduct?.image}`
            }
            alt={currentProduct?.name}
            className="size-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
            }}
          />
        </div>

        {/* PRODUCT FORM */}
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
              {/* PRODUCT NAME */}
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

              {/* PRODUCT PRICE */}
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

              {/* PRODUCT IMAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Product Image</span>
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData({ ...formData, image: file });
                      }
                    }}
                  />
                  {/* Current/Preview Image */}
                  {formData.image && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-base-300">
                      <img
                        src={
                          typeof formData.image === 'string' 
                            ? (formData.image.startsWith('http') 
                                ? formData.image 
                                : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${formData.image}`)
                            : URL.createObjectURL(formData.image)
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-sm text-base-content/60">
                    Leave empty to keep current image
                  </p>
                </div>
              </div>

              {/* FORM ACTIONS */}
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
      </div>
    </div>
  );
}
export default ProductPage;