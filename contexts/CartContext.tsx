"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/lib/supabase" // Only import the single supabase instance
import { useAuth } from "./AuthContext"
import type { Producto, VariantesProducto } from "@/types/database.types"

type CartItem = {
  id: string
  producto_id: string
  variante_id: string | null
  cantidad: number
  producto?: Omit<Producto, 'imagen_url'> & { imagenes_producto: { url: string, es_principal: boolean }[] | null }
  variante?: VariantesProducto | null
}

type CartContextType = {
  items: CartItem[]
  addItem: (producto_id: string, variante_id: string | null, cantidad: number) => Promise<void>
  updateItem: (id: string, cantidad: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearCart: () => Promise<void>
  isLoading: boolean
  totalItems: number
  carritoId: string | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [carritoId, setCarritoId] = useState<string | null>(null)
  const { user, isLoading: isLoadingAuth } = useAuth() // Get user and loading state from AuthContext

  const isInitializing = useRef(false)
  const isLoadingItems = useRef(false);

  useEffect(() => {
    console.log("useEffect[Cart]: Running cart initialization effect.");
    console.log("useEffect[Cart]: isLoadingAuth from useAuth:", isLoadingAuth);
    console.log("useEffect[Cart]: user from useAuth:", user); // Use user directly from useAuth
    console.log("useEffect[Cart]: isInitializing.current", isInitializing.current);

    // Only run if auth state has settled (isLoadingAuth is false) AND
    // the user state from AuthContext is available (user is null or an object) AND
    // initialization is not already in progress
    if (isLoadingAuth || user === undefined || isInitializing.current) {
      console.log("useEffect[Cart]: Auth is still loading, user state is undefined, or init is in progress. Returning.");
      return;
    }

    const initCart = async () => {
      isInitializing.current = true;
      setIsLoading(true);
      console.log("initCart: Starting cart initialization.");
      try {
        // We now rely solely on the 'user' state from the useAuth hook for general auth status
        const userIsAuthenticated = user !== null; // Use user directly from useAuth
        console.log("initCart: userIsAuthenticated (based on useAuth):", userIsAuthenticated);

        let currentSessionId = sessionStorage.getItem("cart_session_id")
        console.log("initCart: Initial currentSessionId from session storage:", currentSessionId);

        if (currentSessionId) {
            sessionStorage.setItem("cart_session_id_before_auth", currentSessionId);
            console.log("initCart: Stored session_id_before_auth:", currentSessionId);
        }


        if (!userIsAuthenticated) {
          console.log("initCart: User is not authenticated (based on useAuth). Trying anonymous flow.");
          if (!currentSessionId) {
            currentSessionId = uuidv4()
            sessionStorage.setItem("cart_session_id", currentSessionId)
            console.log("initCart: Created new session_id:", currentSessionId);
          }
          setSessionId(currentSessionId)
          console.log("initCart: Session ID set to:", currentSessionId);

          console.log("initCart: Searching for anonymous cart with session_id:", currentSessionId);
          // This SELECT also needs to pass RLS, relies on x-session-id header via custom fetch
          const { data: anonCart, error: anonCartError } = await supabase
            .from("carritos")
            .select("id")
            .eq("session_id", currentSessionId)
            .is("usuario_id", null)
            .maybeSingle()

          if (anonCartError) {
            console.error("initCart: Error searching for anonymous cart:", anonCartError)
            // Continue even on select error, might need to create cart
          }

          if (anonCart) {
            console.log("initCart: Found existing anonymous cart:", anonCart);
            setCarritoId(anonCart.id)
            console.log("initCart: CarritoId set to (found anon):", anonCart.id);
            await loadCartItems(anonCart.id)
          } else {
            console.log("initCart: No anonymous cart found, attempting to create new one.");

            const insertData = {
                session_id: currentSessionId,
                usuario_id: null as string | null,
            };

            console.log("initCart: --- DEBUG: Before anonymous insert --- ");
            console.log("initCart: user from useAuth:", user); // Log the user object from useAuth
            console.log("initCart: userIsAuthenticated (based on useAuth):", userIsAuthenticated);
            console.log("initCart: currentSessionId:", currentSessionId);
            console.log("initCart: insertData:", insertData);

            // *** Add logging for the client's perceived auth state ***
            try {
              const clientSession = await supabase.auth.getSession();
              const clientUser = await supabase.auth.getUser(); // This call might still throw AuthSessionMissingError internally
              console.log("initCart: DEBUG: supabase.auth.getSession() result:", clientSession);
              console.log("initCart: DEBUG: supabase.auth.getUser() result:", clientUser); // Log result, even if it errored internally
            } catch (error) {
              console.error("initCart: DEBUG: Error getting client auth state before insert:", error);
            }
             // Check synchronous state - this might be more reliable immediately after session is loaded
            console.log("initCart: DEBUG: supabase.auth.currentUser:", supabase.auth.currentUser);

            console.log("initCart: --- DEBUG: Attempting insert --- ");

            // Use the single 'supabase' client for this insert
            // This INSERT relies on the allow_anon_create_cart RLS policy
            if (currentSessionId) {
            const { data: newAnonCart, error: createAnonError } = await supabase
              .from("carritos")
              .insert(insertData)
              .select("id")
              .single();

            console.log("initCart: --- DEBUG: After anonymous insert attempt --- ");

            if (createAnonError) {
              console.error("initCart: Error creating anonymous cart:", createAnonError)
              setCarritoId(null);
               setItems([]);
              return // Stop initialization if cart creation fails
            }
            console.log("initCart: Created new anonymous cart:", newAnonCart);
            setCarritoId(newAnonCart.id)
            console.log("initCart: CarritoId set to (created anon):", newAnonCart.id);
             setItems([]); // New cart is empty initially
            } else {
              console.error("initCart: Cannot create anonymous cart: currentSessionId is null or undefined.");
              setCarritoId(null);
              setItems([]);
            }
          }
        } else { // User is authenticated based on useAuth
          console.log("initCart: User is authenticated (based on useAuth). Trying authenticated flow.");
          // *** The existing authenticated user logic remains largely the same ***
          // It already correctly uses the 'user' object from useAuth (which is currentUser here)
          if (sessionId) {
             setSessionId(null);
             sessionStorage.removeItem("cart_session_id");
             console.log("initCart: Cleared session ID for authenticated user state.");
          }

          const storedSessionId = sessionStorage.getItem("cart_session_id");
          if(storedSessionId) {
              sessionStorage.removeItem("cart_session_id");
              console.log("initCart: Cleared session storage main session ID for authenticated user.");
          }

          console.log("initCart: Searching for user cart with user_id:", user?.id); // Use user from useAuth
          const { data: userCart, error: userCartError } = await supabase
            .from("carritos")
            .select("id")
            .eq("usuario_id", user?.id) // Use user from useAuth
            .maybeSingle()

          if (userCartError) {
            console.error("initCart: Error searching for user cart:", userCartError)
            setCarritoId(null);
             setItems([]);
            return
          }

          if (userCart) {
            console.log("initCart: Found existing user cart:", userCart);
            setCarritoId(userCart.id)
            console.log("initCart: CarritoId set to (found user):", userCart.id);
            await loadCartItems(userCart.id)

            const sessionIdToMerge = sessionStorage.getItem("cart_session_id_before_auth")
            if (sessionIdToMerge) {
               console.log("initCart: Checking for previous anonymous cart to merge:", sessionIdToMerge);
               const { data: anonCartToMerge, error: mergeCartError } = await supabase
                 .from("carritos")
                 .select('id, elementos_carrito(producto_id, variante_id, cantidad)')
                 .eq("session_id", sessionIdToMerge)
                 .is("usuario_id", null)
                 .maybeSingle();

               if(mergeCartError) { console.error("initCart: Error fetching anonymous cart for merge:", mergeCartError); }

               if(anonCartToMerge && anonCartToMerge.elementos_carrito && anonCartToMerge.elementos_carrito.length > 0) {
                  console.log("initCart: Found anonymous cart to merge:", anonCartToMerge);

                  console.log("initCart: Re-fetching user cart items before merge to ensure latest state.");
                   const { data: latestUserItems, error: fetchLatestError } = await supabase
                    .from("elementos_carrito")
                    .select('producto_id, variante_id, cantidad')
                    .eq("carrito_id", userCart.id);

                   if(fetchLatestError) {
                       console.error("initCart: Error fetching latest user items before merge:", fetchLatestError);
                   }

                  const latestUserItemsMap = new Map(latestUserItems?.map(item =>
                      [`${item.producto_id}-${item.variante_id || 'null'}`, item.cantidad]
                    ) || []
                  );
                  console.log("initCart: Latest user items map:", latestUserItemsMap);

                  for(const anonItem of anonCartToMerge.elementos_carrito) {
                     console.log(`initCart: Merging item ${anonItem.producto_id}/${anonItem.variante_id}, quantity ${anonItem.cantidad}`);

                     const itemKey = `${anonItem.producto_id}-${anonItem.variante_id || 'null'}`;
                     const existingQuantity = latestUserItemsMap.get(itemKey) || 0;

                     if(existingQuantity > 0) {
                         const newQuantity = existingQuantity + anonItem.cantidad;
                         console.log(`initCart: Item exists. Updating quantity for product ${anonItem.producto_id}/${anonItem.variante_id} from ${existingQuantity} to ${newQuantity}`);
                         const { error: updateError } = await supabase
                           .from("elementos_carrito")
                           .update({ cantidad: newQuantity })
                           .eq("carrito_id", userCart.id)
                           .eq("producto_id", anonItem.producto_id)
                           .is("variante_id", anonItem.variante_id);

                         if(updateError) console.error("initCart: Error merging (updating) item:", updateError);
                         else latestUserItemsMap.set(itemKey, newQuantity);
                     }
                  }

                  console.log("initCart: Deleting anonymous cart after merge.", anonCartToMerge.id);
                  const { error: deleteAnonCartError } = await supabase
                     .from("carritos")
                     .delete()
                     .eq("id", anonCartToMerge.id);
                  if(deleteAnonCartError) console.error("initCart: Error deleting anonymous cart after merge:", deleteAnonCartError);

                   sessionStorage.removeItem("cart_session_id_before_auth");

                  console.log("initCart: Reloading user cart after merge.");
                  await loadCartItems(userCart.id);
               } else if (anonCartToMerge) {
                 console.log("initCart: Found empty anonymous cart to delete after auth.", anonCartToMerge.id);
                 const { error: deleteAnonCartError } = await supabase
                     .from("carritos")
                     .delete()
                     .eq("id", anonCartToMerge.id);
                  if(deleteAnonCartError) console.error("initCart: Error deleting empty anonymous cart after auth:", deleteAnonCartError);
                   sessionStorage.removeItem("cart_session_id_before_auth");
               } else {
                 console.log("initCart: No anonymous cart found to merge with session_id:", sessionIdToMerge);
                 sessionStorage.removeItem("cart_session_id_before_auth");
               }
            }

          } else { // User is authenticated but no cart found for them
            console.log("initCart: User is authenticated but does NOT have a cart - check if there's an anonymous cart to convert.");
             const sessionIdToConvert = sessionStorage.getItem("cart_session_id_before_auth");
            if (sessionIdToConvert) {
               console.log("initCart: No user cart found, checking for anonymous cart to convert:", sessionIdToConvert);
               const { data: anonCartToConvert, error: convertCartError } = await supabase
                 .from("carritos")
                 .select('id')
                 .eq("session_id", sessionIdToConvert)
                 .is("usuario_id", null)
                 .maybeSingle();

               if(convertCartError) {
                 console.error("initCart: Error fetching anonymous cart for conversion:", convertCartError);
                 setCarritoId(null);
                 setItems([]);
               }

               if(anonCartToConvert) {
                  console.log("initCart: Converting anonymous cart to user cart:", anonCartToConvert);
                  // Update the anonymous cart row with the user's ID
                   const { error: updateCartError } = await supabase
                     .from("carritos")
                     .update({ usuario_id: user?.id, session_id: null }) // Use user?.id from useAuth
                   .eq("id", anonCartToConvert.id);

                 if(updateCartError) {
                   console.error("initCart: Error converting anonymous cart:", updateCartError);
                    setItems([]);
                    setCarritoId(null);
                 } else {
                   console.log("initCart: Anonymous cart converted successfully.");
                   setCarritoId(anonCartToConvert.id);
                   console.log("initCart: CarritoId set to (converted anon):", anonCartToConvert.id);
                   await loadCartItems(anonCartToConvert.id); // Load items into the now-user cart
                    sessionStorage.removeItem("cart_session_id_before_auth"); // Clear old session ID
                 }

               } else {
                 console.log("initCart: No anonymous cart to convert, creating a new user cart.");
                 // If no anonymous cart to convert, create a brand new user cart
                 const { data: newUserCart, error: createError } = await supabase
                    .from("carritos")
                    .insert({
                      usuario_id: user?.id, // Use user?.id from useAuth
                    })
                    .select("id")
                    .single()

                 if (createError) {
                   console.error("initCart: Error creating user cart:", createError)
                    setItems([]);
                    setCarritoId(null);
                 } else {
                   console.log("initCart: Created new user cart:", newUserCart);
                   setCarritoId(newUserCart.id)
                   console.log("initCart: CarritoId set to (created user):", newUserCart.id);
                    setItems([]); // New user cart is empty initially
                 }
                  sessionStorage.removeItem("cart_session_id_before_auth"); // Clear old session ID
               }
            } else { // User authenticated, no session_id_before_auth, no user cart
                 console.log("initCart: No anonymous cart to convert, creating a new user cart.");
                 // If no anonymous cart to convert, create a brand new user cart
                 const { data: newUserCart, error: createError } = await supabase
                    .from("carritos")
                    .insert({
                      usuario_id: user?.id, // Use user?.id from useAuth
                    })
                    .select("id")
                    .single()

                 if (createError) {
                   console.error("initCart: Error creating user cart:", createError)
                    setItems([]);
                    setCarritoId(null);
                 } else {
                   console.log("initCart: Created new user cart:", newUserCart);
                   setCarritoId(newUserCart.id)
                   console.log("initCart: CarritoId set to (created user):", newUserCart.id);
                    setItems([]); // New user cart is empty initially
                 }
            }
          }
        }
      } catch (error) {
            console.error("Caught exception in initCart:", error)
        setCarritoId(null);
         setItems([]);
      } finally {
            isInitializing.current = false;
        setIsLoading(false)
        console.log("initCart: Initialization finished. isLoading set to false.");
        console.log("initCart: isInitializing.current set to false.");
      }
    }

    initCart()
  }, [isLoadingAuth, user]) // Depend on both isLoadingAuth and user

  const loadCartItems = async (id: string | null) => {
     console.log("loadCartItems: Attempting to load items for carritoId:", id);

     if (isLoadingItems.current) {
         console.log("loadCartItems: Already loading items, returning.");
         return;
     }

    if (!id) {
      console.log("loadCartItems: No carritoId provided, returning.");
      setItems([]);
      return;
    }

    isLoadingItems.current = true;

    try {
          console.log("loadCartItems: Fetching elements_carrito from DB.");
      // This SELECT also needs to pass RLS, relies on cart ownership (user_id or session_id header)
      const { data, error } = await supabase
        .from("elementos_carrito")
        .select(
          `
          id,
          carrito_id,
          producto_id,
          variante_id,
          cantidad,
          producto:productos (
            id,
            nombre,
            precio,
            precio_descuento,
            imagenes_producto(url, es_principal)
          ),
          variante:variantes_producto (
            id,
            nombre,
            precio_adicional
          )
        `
        )
        .eq("carrito_id", id);

      if (error) {
            console.error("loadCartItems: Error al cargar elementos del carrito:", JSON.stringify(error, null, 2));
        setItems([]);
        return;
      }

      console.log("loadCartItems: Data received from DB:", data);

      const cartItems: CartItem[] = data.map((item) => ({
            id: item.id,
        producto_id: item.producto_id,
        variante_id: item.variante_id,
        cantidad: item.cantidad,
        producto: item.producto ? {
          ...item.producto,
          imagen_url: item.producto.imagenes_producto?.find((img: any) => img.es_principal)?.url || item.producto.imagenes_producto?.[0]?.url || "/placeholder.svg"
        } : undefined,
        variante: item.variante as VariantesProducto | null,
      }));

      console.log("loadCartItems: Transformed cart items for state:", cartItems);
      setItems(cartItems);
      console.log("loadCartItems: Cart items state updated.");
    } catch (error) {
          console.error("loadCartItems: Caught exception al cargar elementos del carrito:", error);
      setItems([]);
    } finally {
       isLoadingItems.current = false;
       console.log("loadCartItems: Loading finished. isLoadingItems.current set to false.");
    }
  };

  const addItem = async (producto_id: string, variante_id: string | null, cantidad: number) => {
     console.log("addItem: Called with producto_id:", producto_id, ", variante_id:", variante_id, ", cantidad:", cantidad);
     console.log("addItem: Current carritoId:", carritoId);

    if (isLoading || isInitializing.current) {
            console.log("addItem: Cart is loading or initializing, cannot add item yet.");
        return;
        }

    if (!carritoId) {
          console.log("addItem: No carritoId available, cannot add item.");
      return;
        }

    try {
          const existingItem = items.find(
        (item) => item.producto_id === producto_id && item.variante_id === variante_id
      );
          console.log("addItem: Searching for existing item in local state.", existingItem);

      if (existingItem) {
            console.log("addItem: Item exists, updating quantity.");
        const newQuantity = existingItem.cantidad + cantidad;
             console.log(`addItem: Updating quantity for item ${existingItem.id} to ${newQuantity}`);
        // This UPDATE also needs to pass RLS
        const { error: updateError } = await supabase
          .from("elementos_carrito")
          .update({ cantidad: newQuantity })
          .eq("id", existingItem.id)
          .eq("carrito_id", carritoId);

        if (updateError) {
              console.error("addItem: Error al actualizar item del carrito:", updateError);
          return;
            }

        console.log("addItem: Quantity updated successfully in DB.");

         setItems((prevItems) =>
          prevItems.map((item) => (item.id === existingItem.id ? { ...item, cantidad: newQuantity } : item))
        );
            console.log("addItem: Local state updated for existing item.");

      } else {
            console.log("addItem: Item does not exist, inserting new item into DB.");
        // This INSERT also needs to pass RLS
        const { data: newItem, error: insertError } = await supabase
          .from("elementos_carrito")
          .insert({
            carrito_id: carritoId,
            producto_id,
            variante_id,
            cantidad,
          })
          .select(
                  `
             id,
             producto_id,
             variante_id,
             cantidad,
             producto:productos (
               id,
               nombre,
               precio,
               precio_descuento,
               imagenes_producto(url, es_principal)
             ),
             variante:variantes_producto (
               id,
               nombre,
               precio_adicional
             )
          `
                )
          .single();

        if (insertError) {
              console.error("addItem: Error al añadir item al carrito:", insertError);
          return;
            }

        console.log("addItem: New item inserted into DB and fetched:", newItem);

        const addedItem: CartItem = {
            id: newItem.id,
            producto_id: newItem.producto_id,
            variante_id: newItem.variante_id,
            cantidad: newItem.cantidad,
            producto: newItem.producto ? {
              ...newItem.producto,
              imagen_url: newItem.producto.imagenes_producto?.find((img: any) => img.es_principal)?.url || newItem.producto.imagenes_producto?.[0]?.url || "/placeholder.svg"
            } : undefined,
            variante: newItem.variante as VariantesProducto | null,
        };

        console.log("addItem: Adding new item to local state:", addedItem);
        setItems((prevItems) => [...prevItems, addedItem]);
        console.log("addItem: Local state updated with new item.");
      }

      console.log("addItem: DB operation complete.");

    } catch (error) {
          console.error("addItem: Caught exception in addItem:", error);
    }
  };

  const updateItem = async (id: string, cantidad: number) => {
     console.log("updateItem: Called with id:", id, ", cantidad:", cantidad);
     if (isLoading || isInitializing.current) {
     console.log("updateItem: Cart is loading or initializing, cannot update item yet.");
     return;
     }

    console.log("updateItem: Current carritoId:", carritoId);
    if (!carritoId) {
       console.log("updateItem: No carritoId available, cannot update item.");
       return;
        }

    try {
          if (cantidad <= 0) {
            console.log("updateItem: Quantity is <= 0, removing item.");
        await removeItem(id);
        return;
          }

      console.log("updateItem: Updating quantity in DB for item id:", id);
      // This UPDATE also needs to pass RLS
      const { error: updateError } = await supabase
        .from("elementos_carrito")
        .update({ cantidad })
        .eq("id", id)
        .eq("carrito_id", carritoId);

      if (updateError) {
              console.error("updateItem: Error al actualizar item del carrito:", updateError);
          return;
            }

      console.log("updateItem: Quantity updated successfully in DB.");

      console.log("updateItem: Updating local state.");
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, cantidad } : item))
      );
          console.log("updateItem: Local state updated.");

    } catch (error) {
          console.error("updateItem: Caught exception in updateItem:", error);
    }
  };

  const removeItem = async (id: string) => {
     console.log("removeItem: Called with id:", id);
     if (isLoading || isInitializing.current) {
     console.log("removeItem: Cart is loading or initializing, cannot remove item yet.");
     return;
     }
     console.log("removeItem: Current carritoId:", carritoId);
     if (!carritoId) {
     console.log("removeItem: No carritoId available, cannot remove item.");
     return;
     }

    try {
          console.log("removeItem: Deleting item from DB with id:", id);
      // This DELETE also needs to pass RLS
      const { error: deleteError } = await supabase
        .from("elementos_carrito")
        .delete()
        .eq("id", id)
        .eq("carrito_id", carritoId);

      if (deleteError) {
            console.error("removeItem: Error al eliminar item del carrito:", deleteError);
          return;
            }

      console.log("removeItem: Item deleted successfully from DB.");

      console.log("removeItem: Updating local state.");
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      console.log("removeItem: Local state updated.");

    } catch (error) {
          console.error("removeItem: Caught exception in removeItem:", error);
    }
  };

  const clearCart = async () => {
     console.log("clearCart: Called.");
     if (isLoading || isInitializing.current) {
     console.log("clearCart: Cart is loading or initializing, cannot clear cart yet.");
     return;
     }
     console.log("clearCart: Current carritoId:", carritoId);
     if (!carritoId) {
     console.log("clearCart: No carritoId available, cannot clear cart.");
     return;
     }

    try {
          console.log("clearCart: Deleting all items for carritoId:", carritoId);
      // This DELETE also needs to pass RLS
      const { error: deleteError } = await supabase
        .from("elementos_carrito")
        .delete()
        .eq("carrito_id", carritoId);

      if (deleteError) {
            console.error("clearCart: Error al vaciar el carrito:", deleteError);
          return;
            }

      console.log("clearCart: All items deleted from DB.");
      setItems([]);
      console.log("clearCart: Local state cleared.");

    } catch (error) {
          console.error("clearCart: Caught exception in clearCart:", error);
    }
  };

  const totalItems = items.reduce((total, item) => total + item.cantidad, 0);

  const value = {
    items,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    isLoading,
    totalItems,
    carritoId
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}