import { create } from "zustand";

export const useProductStore = create((set) => ({
	products: [],
	loading: true, // Loading state bilkul sahi hai

	fetchProducts: async () => {
		set({ loading: true });
		try {
			const res = await fetch("/api/products");
			const data = await res.json();
			set({ products: data });
		} catch (error) {
			console.error("Failed to fetch products", error);
			set({ products: [] });
		} finally {
			set({ loading: false });
		}
	},

	createProduct: async (newProduct) => {
		try {
			const res = await fetch("/api/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newProduct),
			});
			const data = await res.json();
			if (!res.ok) throw new Error("Failed to create product");

			// Naye product ko state mein add karo
			set((state) => ({ products: [...state.products, data] }));
			return { success: true, message: "Product Created Successfully" };
		} catch (error) {
			return { success: false, message: error.message };
		}
	},

	deleteProduct: async (pid) => {
		try {
			const res = await fetch(`/api/products/${pid}`, { method: "DELETE" });
			const data = await res.json();
			if (!data.success) throw new Error(data.message);

			// Product ko state se filter karke hata do
			set((state) => ({
				products: state.products.filter((product) => product._id !== pid),
			}));
			return { success: true, message: data.message };
		} catch (error) {
			return { success: false, message: error.message };
		}
	},

	updateProduct: async (pid, updatedProduct) => {
		try {
			const res = await fetch(`/api/products/${pid}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updatedProduct),
			});
			const data = await res.json();
			if (!data.success) throw new Error(data.message);

			// State mein product ko update karo
			set((state) => ({
				products: state.products.map((product) =>
					product._id === pid ? data.product : product // 'data.product' use karo
				),
			}));
			return { success: true, message: "Product updated successfully" };
		} catch (error) {
			return { success: false, message: error.message };
		}
	},
}));



// import { create } from "zustand";

// export const useProductStore = create((set) => ({
//   products: [],
//   setProducts: (products) => set({ products }),

//   createProduct: async (newProduct) => {
//     if (!newProduct.name || !newProduct.price || !newProduct.image) {
//       return { success: false, message: "Please Fill All Field" };
//     }
//     const res = await fetch("/api/products", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newProduct),
//     });
//     const data = await res.json();
//     set((state) => ({ products: [...state.products, data.product] }));
//     return { success: true, message: "Product Created Successfully" };
//   },
//   products: [],
// 	loading: true, // 1. loading state add karo

// 	fetchProducts: async () => {
// 		set({ loading: true }); // Fetch start hone par loading true karo
// 		try {
// 			const res = await fetch("/api/products");
// 			const data = await res.json();
// 			set({ products: data });
// 		} catch (error) {
// 			console.error("Failed to fetch products", error);
// 			set({ products: [] }); // Error aane par products ko khali kar do
// 		} finally {
// 			set({ loading: false }); // Fetch complete hone par loading false karo
// 		}
// 	},
//   // fetchProducts: async () => {
//   //   const res = await fetch("/api/products");
//   //   const data = await res.json();
//   //   set({ products: data.products || [] });  // <-- yahan products ka use karna chahiye
//   // },

//   deleteProduct: async (pid) => {
//     const res = await fetch(`/api/products/${pid}`, { method: "DELETE" });
//     const data = await res.json();
//     if (!data.success) return { success: false, message: data.message };

//     set((state) => ({
//       products: state.products.filter((product) => product._id !== pid),
//     }));
//     return { success: true, message: data.message };
//   },

//   updateProduct: async (pid, updatedProduct) => {
//     const res = await fetch(`/api/products/${pid}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(updatedProduct),
//     });
//     const data = await res.json();
//     if (!data.success) return { success: false, message: data.message };

//     set((state) => ({
//       products: state.products.map((product) =>
//         product._id === pid ? data.data : product
//       ),
//     }));
//     return { success: true, message: data.message };
//   },
// }));
