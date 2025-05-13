"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react" // Import useRef
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./AuthContext"
import type { Producto, VariantesProducto } from "@/types/database.types"

type CartItem = {
  id: string
  producto_id: string
  variante_id: string | null // Add variante_id
  cantidad: number
  producto?: Producto // Keep product details
  variante?: VariantesProducto | null // Add optional variant details
}

type CartContextType = {
  items: CartItem[]
  addItem: (producto_id: string, variante_id: string | null, cantidad: number) => Promise<void>
  updateItem: (id: string, cantidad: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearCart: () => Promise<void>
  isLoading: boolean
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [carritoId, setCarritoId] = useState<string | null>(null)
  const { user, isLoading: isLoadingAuth } = useAuth()

  // Add a ref to track if initCart is currently running
  const isInitializing = useRef(false)
  // Add a ref to track if cart items are currently being loaded
  const isLoadingItems = useRef(false);


  // Effect to initialize cart on mount or user change
  useEffect(() => {
    console.log("useEffect: Running cart initialization effect.");
    console.log("useEffect: user", user);
    console.log("useEffect: isLoadingAuth", isLoadingAuth);
    console.log("useEffect: isInitializing.current", isInitializing.current);


    // Only run if auth state has settled AND initialization is not already in progress
    if (isLoadingAuth || isInitializing.current) {
      console.log("useEffect: Auth is still loading or init is in progress, returning.");
      return;
    }

    const initCart = async () => {
      isInitializing.current = true; // Set ref to true at the start
      setIsLoading(true);
      console.log("initCart: Starting cart initialization.");
      try {
        let currentSessionId = sessionStorage.getItem("cart_session_id")
        console.log("initCart: Initial currentSessionId from session storage:", currentSessionId);

        // Store the session ID before potentially clearing it on auth state change
        if (currentSessionId) {
            sessionStorage.setItem("cart_session_id_before_auth", currentSessionId);
            console.log("initCart: Stored session_id_before_auth:", currentSessionId);
        }


        if (!user) {
          // User is NOT authenticated - ensure anonymous session
          console.log("initCart: User is not authenticated.");
          if (!currentSessionId) {
            currentSessionId = uuidv4()
            sessionStorage.setItem("cart_session_id", currentSessionId)
            console.log("initCart: Created new session_id:", currentSessionId);
          }
          setSessionId(currentSessionId)
          console.log("initCart: Session ID set to:", currentSessionId);

          // Look for existing anonymous cart
          console.log("initCart: Searching for anonymous cart with session_id:", currentSessionId);
          const { data: anonCart, error: anonCartError } = await supabase
            .from("carritos")
            .select("id")
            .eq("session_id", currentSessionId)
            .is("usuario_id", null) // Ensure it's an anonymous cart
            .maybeSingle()

          if (anonCartError) {
            console.error("initCart: Error searching for anonymous cart:", anonCartError)
             setItems([]); // Clear items on error
            return
          }

          if (anonCart) {
            console.log("initCart: Found existing anonymous cart:", anonCart);
            setCarritoId(anonCart.id)
            console.log("initCart: CarritoId set to (found anon):", anonCart.id);
            await loadCartItems(anonCart.id)
          } else {
            // Create a new anonymous cart
            console.log("initCart: No anonymous cart found, attempting to create new one.");
            const { data: newAnonCart, error: createAnonError } = await supabase
              .from("carritos")
              .insert({
                session_id: currentSessionId,
              })
              .select("id")
              .single()

            if (createAnonError) {
              console.error("initCart: Error creating anonymous cart:", createAnonError)
               setItems([]); // Clear items on error
              return
            }
            console.log("initCart: Created new anonymous cart:", newAnonCart);
            setCarritoId(newAnonCart.id)
            console.log("initCart: CarritoId set to (created anon):", newAnonCart.id);
            // loadCartItems is called implicitly as there are no items yet
             setItems([]); // Ensure state is empty for a new cart
          }
        } else {
          // User IS authenticated - handle potential merge
          console.log("initCart: User is authenticated.");
          // Ensure session ID state is cleared for authenticated user if it exists
          if (sessionId) {
             setSessionId(null);
             sessionStorage.removeItem("cart_session_id");
             console.log("initCart: Cleared session ID for authenticated user state.");
          }

          // Also check sessionStorage for the main key just in case state was not synced
          const storedSessionId = sessionStorage.getItem("cart_session_id");
          if(storedSessionId) {
              sessionStorage.removeItem("cart_session_id");
              console.log("initCart: Cleared session storage main session ID for authenticated user.");
          }


          // Look for user's cart
          console.log("initCart: Searching for user cart with user_id:", user.id);
          const { data: userCart, error: userCartError } = await supabase
            .from("carritos")
            .select("id")
            .eq("usuario_id", user.id)
            .maybeSingle()

          if (userCartError) {
            console.error("initCart: Error searching for user cart:", userCartError)
             setItems([]); // Clear items on error
            return
          }

          if (userCart) {
            // User has a cart - load it
            console.log("initCart: Found existing user cart:", userCart);
            setCarritoId(userCart.id)
            console.log("initCart: CarritoId set to (found user):", userCart.id);
            // IMPORTANT: Load items *before* attempting merge logic that relies on 'items' state
            // The loadCartItems call here is crucial to populate the 'items' state
            // before we check 'items' for existing items during merge.
            await loadCartItems(userCart.id) // Load user's cart items first

            // Check if there was a previous anonymous cart to merge
            // Use the session_id_before_auth stored earlier
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

               // Check if the anonymous cart exists and has items
               if(anonCartToMerge && anonCartToMerge.elementos_carrito && anonCartToMerge.elementos_carrito.length > 0) {
                  console.log("initCart: Found anonymous cart to merge:", anonCartToMerge);

                  // Fetch the latest user cart items again just before merging to ensure we have the most current state
                   console.log("initCart: Re-fetching user cart items before merge to ensure latest state.");
                   const { data: latestUserItems, error: fetchLatestError } = await supabase
                    .from("elementos_carrito")
                    .select('producto_id, variante_id, cantidad')
                    .eq("carrito_id", userCart.id);

                   if(fetchLatestError) {
                       console.error("initCart: Error fetching latest user items before merge:", fetchLatestError);
                       // Continue merging but log the error
                   }

                  const latestUserItemsMap = new Map(latestUserItems?.map(item =>
                      [`${item.producto_id}-${item.variante_id || 'null'}`, item.cantidad] // Corrected: return [key, value]
                    ) || []
                  );
                  console.log("initCart: Latest user items map:", latestUserItemsMap);


                  // Merge items from anonymous cart into user's cart
                  for(const anonItem of anonCartToMerge.elementos_carrito) {
                     console.log(`initCart: Merging item ${anonItem.producto_id}/${anonItem.variante_id}, quantity ${anonItem.cantidad}`);

                     const itemKey = `${anonItem.producto_id}-${anonItem.variante_id || 'null'}`;;
                     const existingQuantity = latestUserItemsMap.get(itemKey) || 0;

                     if(existingQuantity > 0) {
                        // Item exists in user's cart, update quantity in DB
                         const newQuantity = existingQuantity + anonItem.cantidad;
                         console.log(`initCart: Item exists. Updating quantity for product ${anonItem.producto_id}/${anonItem.variante_id} from ${existingQuantity} to ${newQuantity}`);
                         const { error: updateError } = await supabase
                           .from("elementos_carrito")
                           .update({ cantidad: newQuantity })
                           .eq("carrito_id", userCart.id) // Ensure we update the correct item in the user's cart
                           .eq("producto_id", anonItem.producto_id)
                           .is("variante_id", anonItem.variante_id);

                         if(updateError) console.error("initCart: Error merging (updating) item:", updateError);
                         else latestUserItemsMap.set(itemKey, newQuantity); // Update map for subsequent checks
                     } else {
                        // Item does not exist in user's cart, insert new item into DB with user's cart_id
                         console.log(`initCart: Item does not exist. Inserting new item for product ${anonItem.producto_id}/${anonItem.variante_id} with quantity ${anonItem.cantidad}`);
                         const { error: insertError } = await supabase
                            .from("elementos_carrito")
                            .insert({
                                carrito_id: userCart.id, // Insert into the user's cart
                                producto_id: anonItem.producto_id,
                                variante_id: anonItem.variante_id,
                                cantidad: anonItem.cantidad,
                             });
                         if(insertError) console.error("initCart: Error merging (inserting) item:", insertError);
                         else latestUserItemsMap.set(itemKey, anonItem.cantidad); // Add to map for subsequent checks
                     }
                  }

                  // After merging all items, delete the anonymous cart itself
                  console.log("initCart: Deleting anonymous cart after merge.", anonCartToMerge.id);
                  const { error: deleteAnonCartError } = await supabase
                     .from("carritos")
                     .delete()
                     .eq("id", anonCartToMerge.id);
                  if(deleteAnonCartError) console.error("initCart: Error deleting anonymous cart after merge:", deleteAnonCartError);

                  // Clean up the temporary session storage key AFTER successful merge and deletion
                   sessionStorage.removeItem("cart_session_id_before_auth");


                  // Reload user's cart to reflect merged items from DB
                  console.log("initCart: Reloading user cart after merge.");
                  await loadCartItems(userCart.id); // Reload after merge operations
               } else if (anonCartToMerge) {
                 // Anonymous cart found but empty, just delete it
                 console.log("initCart: Found empty anonymous cart to delete after auth.", anonCartToMerge.id);
                 const { error: deleteAnonCartError } = await supabase
                     .from("carritos")
                     .delete()
                     .eq("id", anonCartToMerge.id);
                  if(deleteAnonCartError) console.error("initCart: Error deleting empty anonymous cart after auth:", deleteAnonCartError);
                   sessionStorage.removeItem("cart_session_id_before_auth"); // Clean up the temporary session storage key
               } else {
                 console.log("initCart: No anonymous cart found to merge with session_id:", sessionIdToMerge);
                 sessionStorage.removeItem("cart_session_id_before_auth"); // Clean up if no cart found
               }
            }


          } else {
            // User does NOT have a cart - check if there's an anonymous cart to convert
            // Use the session_id_before_auth stored earlier
            const sessionIdToConvert = sessionStorage.getItem("cart_session_id_before_auth");
            if (sessionIdToConvert) {
               console.log("initCart: No user cart found, checking for anonymous cart to convert:", sessionIdToConvert);
               const { data: anonCartToConvert, error: convertCartError } = await supabase
                 .from("carritos")
                 .select('id')
                 .eq("session_id", sessionIdToConvert)
                 .is("usuario_id", null)
                 .maybeSingle();

               if(convertCartError) { console.error("initCart: Error fetching anonymous cart for conversion:", convertCartError); }

               if(anonCartToConvert) {
                  console.log("initCart: Converting anonymous cart to user cart:", anonCartToConvert);
                  // Convert the anonymous cart to a user cart
                   const { error: updateCartError } = await supabase
                     .from("carritos")
                     .update({ usuario_id: user.id, session_id: null })
                   .eq("id", anonCartToConvert.id);

                 if(updateCartError) {
                   console.error("initCart: Error converting anonymous cart:", updateCartError);
                    setItems([]); // Clear items on error
                 } else {
                   console.log("initCart: Anonymous cart converted successfully.");
                   setCarritoId(anonCartToConvert.id);
                   console.log("initCart: CarritoId set to (converted anon):", anonCartToConvert.id);
                   await loadCartItems(anonCartToConvert.id); // Load the now-user cart
                    sessionStorage.removeItem("cart_session_id_before_auth"); // Clean up the temporary session storage key
                 }

               } else {
                 // No anonymous cart found to convert, create a new user cart
                 console.log("initCart: No anonymous cart to convert, creating a new user cart.");
                 const { data: newUserCart, error: createError } = await supabase
                    .from("carritos")
                    .insert({
                      usuario_id: user.id,
                    })
                    .select("id")
                    .single()

                 if (createError) {
                   console.error("initCart: Error creating user cart:", createError)
                    setItems([]); // Clear items on error
                 } else {
                   console.log("initCart: Created new user cart:", newUserCart);
                   setCarritoId(newUserCart.id)
                   console.log("initCart: CarritoId set to (created user):", newUserCart.id);
                   // loadCartItems is called implicitly as there are no items yet
                    setItems([]); // Ensure state is empty for a new cart
                 }
                  sessionStorage.removeItem("cart_session_id_before_auth"); // Clean up the temporary session storage key
               }
            }
          }
        }

      } catch (error) {
        console.error("Caught exception in initCart:", error)
         setItems([]); // Clear items on exception
      } finally {
        isInitializing.current = false; // Reset ref at the end
        setIsLoading(false)
        console.log("initCart: Initialization finished. isLoading set to false.");
        console.log("initCart: isInitializing.current set to false.");
      }
    }

    initCart()
  }, [user, isLoadingAuth]) // Depend on user and isLoadingAuth


  // loadCartItems function - Fetches cart items for a given carritoId
  // Ensure this function can be called safely multiple times
  const loadCartItems = async (id: string | null) => {
     console.log("loadCartItems: Attempting to load items for carritoId:", id);

     // Prevent concurrent loadCartItems calls
     if (isLoadingItems.current) {
         console.log("loadCartItems: Already loading items, returning.");
         return;
     }


    if (!id) {
      console.log("loadCartItems: No carritoId provided, returning.");
      setItems([]); // Ensure items are cleared if carritoId is null
      return;
    }

    isLoadingItems.current = true; // Set ref to true at the start of loading

    try {
      console.log("loadCartItems: Fetching elements_carrito from DB.");
      const { data, error } = await supabase
        .from("elementos_carrito")
        .select(`
          id,
          carrito_id,
          producto_id,
          variante_id,
          cantidad,
          productos:producto_id (*),
          variantes:variante_id (*)
        `)
        .eq("carrito_id", id);


      if (error) {
        console.error("loadCartItems: Error al cargar elementos del carrito:", JSON.stringify(error, null, 2));
        setItems([]); // Clear items on error
        return;
      }

      console.log("loadCartItems: Data received from DB:", data);

      const cartItems: CartItem[] = data.map((item) => ({
        id: item.id,
        producto_id: item.producto_id,
        variante_id: item.variante_id,
        cantidad: item.cantidad,
        producto: item.productos as Producto,
        variante: item.variantes as VariantesProducto | null,
      }));

      console.log("loadCartItems: Transformed cart items for state:", cartItems);
      setItems(cartItems);
      console.log("loadCartItems: Cart items state updated.");
    } catch (error) {
      console.error("loadCartItems: Caught exception al cargar elementos del carrito:", error);
      setItems([]); // Clear items on exception
    } finally {
       isLoadingItems.current = false; // Reset ref at the end
       console.log("loadCartItems: Loading finished. isLoadingItems.current set to false.");
    }
  };

  // Update addItem to handle variants and ensure state consistency after DB operation
  const addItem = async (producto_id: string, variante_id: string | null, cantidad: number) => {
    console.log("addItem: Called with producto_id:", producto_id, ", variante_id:", variante_id, ", cantidad:", cantidad);
    console.log("addItem: Current carritoId:", carritoId);

    // Wait until not loading or initializing before attempting to add
    if (isLoading || isInitializing.current) {
        console.log("addItem: Cart is loading or initializing, cannot add item yet.");
        // Optionally, queue the action or show a message to the user
        return;
    }


    if (!carritoId) {
      console.log("addItem: No carritoId available, cannot add item.");
      // This case should ideally be handled by initCart ensuring a carritoId exists,
      // but as a fallback, we return.
      return;
    }

    try {
      // Find existing item based on both producto_id AND variante_id in the *current* state
      console.log("addItem: Searching for existing item in local state.");
      const existingItem = items.find(
        (item) => item.producto_id === producto_id && item.variante_id === variante_id
      );
      console.log("addItem: Existing item found:", existingItem);

      if (existingItem) {
        // Update quantity if item (product + variant) already exists
        console.log("addItem: Item exists, updating quantity.");
        const newQuantity = existingItem.cantidad + cantidad;
         console.log(`addItem: Updating quantity for item ${existingItem.id} to ${newQuantity}`);
        const { error: updateError } = await supabase
          .from("elementos_carrito")
          .update({ cantidad: newQuantity })
          .eq("id", existingItem.id)
          .eq("carrito_id", carritoId); // Ensure ownership via carrito_id


        if (updateError) {
          console.error("addItem: Error al actualizar item del carrito:", updateError);
          // Optionally, revert local state or show error
           // setItems(prevItems => prevItems.map(item => item.id === existingItem.id ? {...item, cantidad: existingItem.cantidad} : item));
          return;
        }

        console.log("addItem: Quantity updated successfully in DB.");

        // Update local state immediately for better UX
         setItems((prevItems) =>
          prevItems.map((item) => (item.id === existingItem.id ? { ...item, cantidad: newQuantity } : item))
        );
        console.log("addItem: Local state updated for existing item.");


      } else {
        // Add new item including variante_id
        console.log("addItem: Item does not exist, inserting new item into DB.");
        const { data: newItem, error: insertError } = await supabase
          .from("elementos_carrito")
          .insert({
            carrito_id: carritoId,
            producto_id,
            variante_id, // Include variante_id
            cantidad,
          })
          .select(
                  `
             id,
             producto_id,
             variante_id,
             cantidad,
             productos:producto_id (*),
             variantes:variante_id (*)
          `
                )
          .single();

        if (insertError) {
          console.error("addItem: Error al añadir item al carrito:", insertError);
          return;
        }

        console.log("addItem: New item inserted into DB and fetched:", newItem);

        // Add the new item to the local state with fetched details
        const addedItem: CartItem = {
            id: newItem.id,
            producto_id: newItem.producto_id,
            variante_id: newItem.variante_id,
            cantidad: newItem.cantidad,
            producto: newItem.productos as Producto,
            variante: newItem.variantes as VariantesProducto | null,
        };

        console.log("addItem: Adding new item to local state:", addedItem);
        setItems((prevItems) => [...prevItems, addedItem]);
        console.log("addItem: Local state updated with new item.");
      }

      // After any DB operation (insert or update), reload items to ensure state is fully consistent with DB
      // This might cause extra fetches but guarantees accuracy after modifications.
      // Alternatively, refine local state updates to avoid full reload.
      console.log("addItem: DB operation complete.");
      // Removed the redundant loadCartItems call here


    } catch (error) {
      console.error("addItem: Caught exception in addItem:", error);
    }
  };

  const updateItem = async (id: string, cantidad: number) => {
    console.log("updateItem: Called with id:", id, ", cantidad:", cantidad);
     // Wait until not loading or initializing before attempting to update
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
        await removeItem(id); // removeItem will handle state update and DB
        return;
      }

      // Update quantity in DB
      console.log("updateItem: Updating quantity in DB for item id:", id);
      const { error: updateError } = await supabase
        .from("elementos_carrito")
        .update({ cantidad })
        .eq("id", id)
        .eq("carrito_id", carritoId); // Ensure ownership via carrito_id

      if (updateError) {
        console.error("updateItem: Error al actualizar item del carrito:", updateError);
        return;
      }

      console.log("updateItem: Quantity updated successfully in DB.");

      // Update local state immediately for better UX
      console.log("updateItem: Updating local state.");
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, cantidad } : item))
      );
      console.log("updateItem: Local state updated.");

      // Consider reloading cart items after update to get potential server-side changes (optional but safer)
      // await loadCartItems(carritoId); // Decided against automatic reload here for performance, rely on local state update

    } catch (error) {
      console.error("updateItem: Caught exception in updateItem:", error);
    }
  };

  const removeItem = async (id: string) => {
    console.log("removeItem: Called with id:", id);
     // Wait until not loading or initializing before attempting to remove
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
      // Delete item from DB
      console.log("removeItem: Deleting item from DB with id:", id);
      const { error: deleteError } = await supabase
        .from("elementos_carrito")
        .delete()
        .eq("id", id)
        .eq("carrito_id", carritoId); // Ensure ownership via carrito_id

      if (deleteError) {
        console.error("removeItem: Error al eliminar item del carrito:", deleteError);
        return;
      }

      console.log("removeItem: Item deleted successfully from DB.");

      // Update local state immediately for better UX
      console.log("removeItem: Updating local state.");
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      console.log("removeItem: Local state updated.");

      // Consider reloading cart items after removal (optional but safer)
      // await loadCartItems(carritoId); // Decided against automatic reload here

    } catch (error) {
      console.error("removeItem: Caught exception in removeItem:", error);
    }
  };

  const clearCart = async () => {
    console.log("clearCart: Called.");
     // Wait until not loading or initializing before attempting to clear
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
      // Delete all items for this cart_id from DB
      console.log("clearCart: Deleting all items for carritoId:", carritoId);
      const { error: deleteError } = await supabase
        .from("elementos_carrito")
        .delete()
        .eq("carrito_id", carritoId);

      if (deleteError) {
        console.error("clearCart: Error al vaciar el carrito:", deleteError);
        return;
      }

      console.log("clearCart: All items deleted from DB.");
      setItems([]); // Clear local state
      console.log("clearCart: Local state cleared.");

    } catch (error) {
      console.error("clearCart: Caught exception in clearCart:", error);
    }
  };

  // Calcular total de items - this logic is fine
  const totalItems = items.reduce((total, item) => total + item.cantidad, 0)

  const value = {
    items,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    isLoading, // This reflects the initialization loading state
    totalItems,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}