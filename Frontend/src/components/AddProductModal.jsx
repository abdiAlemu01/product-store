// AddProductModal.jsx
import { useEffect, useRef } from "react";
import { DollarSignIcon, Package2Icon, PlusCircleIcon, XIcon } from "lucide-react";
import { useProductStore } from "../store/useProductStore.jsx";

function AddProductModal() {
  const { addProduct, formData, setFormData, loading, resetForm } = useProductStore();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        e.target.value = '';
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

  const handleClose = () => {
    // Clear form and file input when closing
    resetForm();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <dialog id="add_product_modal" className="modal">
      <div className="modal-box max-w-2xl">
        {/* CLOSE BUTTON */}
        <form method="dialog">
          <button 
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleClose}
          >
            <XIcon className="size-4" />
          </button>
        </form>

        {/* MODAL HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 p-3 rounded-lg">
            <PlusCircleIcon className="size-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-2xl">Add New Product</h3>
            <p className="text-sm text-base-content/70">Fill in the details below to add a new product</p>
          </div>
        </div>

        <form onSubmit={addProduct} className="space-y-6">
          <div className="grid gap-6">
            {/* PRODUCT NAME INPUT */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Product Name</span>
                <span className="label-text-alt text-error">*Required</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Package2Icon className="size-5" />
                </div>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* PRODUCT PRICE INPUT */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Price ($)</span>
                <span className="label-text-alt text-error">*Required</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <DollarSignIcon className="size-5" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* PRODUCT IMAGE */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Product Image</span>
                <span className="label-text-alt text-error">*Required</span>
              </label>
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full focus:file-input-primary transition-colors duration-200"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-xs text-base-content/60 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Supported: JPG, PNG, WEBP, GIF (Max 5MB)
                </p>
                
                {/* Image Preview */}
                {formData.image && (
                  <div className="relative animate-fadeIn">
                    <div className="aspect-[4/3] w-full rounded-lg overflow-hidden border-2 border-primary/30 shadow-lg bg-base-200">
                      <img
                        src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Preview';
                        }}
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <div className="badge badge-success gap-1 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Image Ready
                      </div>
                    </div>
                    {/* Remove Image Button */}
                    <button
                      type="button"
                      className="absolute top-2 left-2 btn btn-sm btn-error btn-circle"
                      onClick={() => {
                        setFormData({ ...formData, image: '' });
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    >
                      <XIcon className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MODAL ACTIONS */}
          <div className="modal-action">
            <form method="dialog">
              <button 
                type="button"
                className="btn btn-ghost"
                onClick={handleClose}
              >
                Cancel
              </button>
            </form>
            <button
              type="submit"
              className="btn btn-primary min-w-[120px]"
              disabled={!formData.name || !formData.price || !formData.image || loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <PlusCircleIcon className="size-5 mr-2" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* BACKDROP */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
export default AddProductModal;
