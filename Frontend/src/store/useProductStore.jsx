// import zustand to create a store
// useProductStore.jsx
import { create } from "zustand";
import axios from "axios"
import { toast} from "react-hot-toast"
import { getAuthHeaders } from "../lib/session";
const BASE_URL = import.meta.env.VITE_API_URL;
export const useProductStore = create((set, get) => ({
  // product state
  products: [],
  loading: false,
  error: false,
  currentProduct:null,

 // form of the state product in the database
  formData: {
    name: "",
    price: "",
    image: "",
  },

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

  // add product to the database
  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      
      // Create FormData for file upload
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price || "0");
      data.append("image", formData.image);

      await axios.post(`${BASE_URL}/api/products`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...getAuthHeaders(),
        },
      });
      
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully");
      document.getElementById("add_product_modal").close();
    } catch (error) {
      console.log("Error in addProduct function", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

    //fetch all products from database
    fetchProducts:async()=>{
        set({loading:true,})
        try {     
            const response=await axios.get(`${BASE_URL}/api/products`)
            set({products:response.data.data,error:false})
        } catch (err) {
            if(err.response?.status === 429){
            set({error:"Too many requests. Please try again later."})
            toast.error("Too many requests. Please try again later.")

            }else{
                set({error:"An error occurred while fetching products."})
                toast.error("An error occurred while fetching products.")
            } 
        }finally{
            set({loading:false})
        }
    },

    // delete product from database by using their id
    deleteProduct: async (id) => {
    console.log("deleteProduct function called", id);
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`, {
        headers: getAuthHeaders(),
      });
      set((prev) => ({ products: prev.products.filter((product) => product.id !== id) }));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log("Error in deleteProduct function", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },





// update product in the database by using their id
updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      
      // Create FormData for file upload
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      
      // Only append image if it's a new file
      if (formData.image instanceof File) {
        data.append("image", formData.image);
      } else if (typeof formData.image === 'string') {
        // If it's still a string (existing image URL), send it as is
        data.append("imageUrl", formData.image);
      }

      const response = await axios.put(`${BASE_URL}/api/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...getAuthHeaders(),
        },
      });
      
      set({ currentProduct: response.data.data });
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Error in updateProduct function", error);
    } finally {
      set({ loading: false });
    }
  },

// fetch single product from database by using their id
  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({
        currentProduct: response.data.data,
        formData: response.data.data, // pre-fill form with current product data
        error: null,
      });
    } catch (error) {
      console.log("Error in fetchProduct function", error);
      set({ error: "Something went wrong", currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },

}));
