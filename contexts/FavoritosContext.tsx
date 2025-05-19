"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface FavoritosContextType {
  favoriteIds: string[];
  loading: boolean;
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorited: (productId: string) => boolean;
  reloadFavorites: () => Promise<void>;
}

const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = async () => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("favoritos")
      .select("producto_id")
      .eq("usuario_id", user.id);
    setFavoriteIds((data || []).map((f: any) => f.producto_id));
    setLoading(false);
  };

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleFavorite = async (productId: string) => {
    if (!user) return;
    const { data: isNowFavorited, error } = await supabase.rpc('toggle_favorite', {
      product_id_input: productId,
      user_id_input: user.id,
    });
    if (!error) {
      setFavoriteIds((prev) =>
        isNowFavorited
          ? [...prev, productId]
          : prev.filter((id) => id !== productId)
      );
    }
  };

  const isFavorited = (productId: string) => favoriteIds.includes(productId);

  const reloadFavorites = loadFavorites;

  return (
    <FavoritosContext.Provider value={{ favoriteIds, loading, toggleFavorite, isFavorited, reloadFavorites }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error("useFavoritos debe usarse dentro de FavoritosProvider");
  return ctx;
} 