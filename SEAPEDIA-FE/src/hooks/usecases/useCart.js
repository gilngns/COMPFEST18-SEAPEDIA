import { useState, useEffect, useCallback } from "react";
import { cartService } from "../../services/cartService";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

export function useCart() {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await cartService.getCart();
      setCart(res.data);
    } catch (error) {
      console.error("Gagal memuat keranjang:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity, replaceStore = false) => {
    try {
      const res = await cartService.addToCart(productId, quantity, replaceStore);
      setCart(res.data);
      return { success: true, ...res };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data?.error || "Gagal menambahkan ke keranjang",
        code: error.response?.data?.code,
        status: error.response?.status
      };
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    try {
      const res = await cartService.updateItemQuantity(itemId, newQty);
      setCart(res.data);
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal memperbarui kuantitas"
      });
      return false;
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await cartService.removeItem(itemId);
      setCart(res.data);
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus item"
      });
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const res = await cartService.clearCart();
      setCart(res.data);
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengosongkan keranjang"
      });
      return false;
    }
  };

  return {
    cart,
    isLoading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
  };
}
