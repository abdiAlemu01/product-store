// AddProductModal.jsx
import { useRef } from "react";
import { Package2Icon, PlusCircleIcon, XIcon } from "lucide-react";
import { useProductStore } from "../store/useProductStore.jsx";

function AddProductModal() {
  const { addProduct, formData, setFormData, loading, resetForm } = useProductStore();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        e.target.value = "";
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

  const closeModal = () => {
    resetForm();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    document.getElementById("add_product_modal").close();
  };

  return (
    <dialog id="add_product_modal" className="modal">
      <div className="modal-box max-w-2xl">
        {/* CLOSE BUTTON — plain button, no nested <form> */}
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={closeModal}
        >
          <XIcon className="size-4" />
        </button>

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

        {/* SINGLE FORM — no nested forms */}
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
                    <div className="aspect-square w-full rounded-lg overflow-hidden border-2 border-primary/30 shadow-xl bg-base-200">
                      <img
                        src={
                          typeof formData.image === "string"
                            ? formData.image
                            : URL.createObjectURL(formData.image)
                        }
                        alt="Preview"
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/600x600?text=Image+Preview";
                        }}
                      />
                    </div>
                    <div className="absolute top-2 right-2 z-10">
                      <div className="badge badge-success gap-1 shadow-lg px-3 py-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Image Ready
                      </div>
                    </div>
                    {/* Remove Image Button */}
                    <button
                      type="button"
                      className="absolute top-2 left-2 btn btn-sm btn-error btn-circle z-10 shadow-lg"
                      onClick={() => {
                        setFormData({ ...formData, image: "" });
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
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
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary min-w-[120px]"
              disabled={!formData.name || !formData.image || loading}
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
      <div className="modal-backdrop" onClick={closeModal} />
    </dialog>
  );
}

export default AddProductModal;
