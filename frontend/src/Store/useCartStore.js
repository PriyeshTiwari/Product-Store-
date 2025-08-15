import { create } from "zustand";

const useCartStore = create((set) => ({
	items: [],
	loading: false,

	fetchCart: async () => {
		set({ loading: true });
		try {
			const res = await fetch("/api/cart");
			const data = await res.json();
			if (data.message) throw new Error(data.message);
			set({ items: data.items || [] });
		} catch (error) {
			console.error(error.message);
		} finally {
			set({ loading: false });
		}
	},

	addToCart: async (productId) => {
		try {
			const res = await fetch("/api/cart/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId, quantity: 1 }),
			});
			const data = await res.json();
			if (data.message) throw new Error(data.message);
			set({ items: data.items });
		} catch (error) {
			console.error(error.message);
		}
	},

	removeFromCart: async (productId) => {
		try {
			const res = await fetch(`/api/cart/remove/${productId}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.message) throw new Error(data.message);
			set({ items: data.items });
		} catch (error) {
			console.error(error.message);
		}
	},

	clearCart: () => set({ items: [] }),
}));

export default useCartStore;