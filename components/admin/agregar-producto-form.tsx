// components/admin/agregar-producto-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Importar el cliente Supabase del frontend

interface Category {
  id: string;
  nombre: string;
  slug: string;
}

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); // Use selectedCategoryId for dropdown
  const [productImage, setProductImage] = useState<File | null>(null);
  const [stock, setStock] = useState('0'); // Add state for stock, default to '0' as it's a number input value
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryImageFile, setNewCategoryImageFile] = useState<File | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryMessage, setNewCategoryMessage] = useState('');


  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Assuming an API endpoint for fetching categories exists
        const response = await fetch('/api/categorias');
        console.log('Category fetch response:', response); // Log the full response
        if (response.ok) {
          const data = await response.json();
          console.log('Categories data received:', data); // Log the received data
          setCategories(data);
        } else {
          // Attempt to read the response body for more details
          const errorData = await response.json().catch(() => ({})); // Handle potential JSON parsing errors
          console.error('Error fetching categories:', response.status, response.statusText, errorData);
          // Optionally set a user-friendly error message based on errorData
        }
      } catch (error) {
        console.error('Fetch error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!productImage) {
      setMessage('Por favor, selecciona una imagen para el producto.');
      setLoading(false);
      return;
    }

    // *** Obtener la sesión del cliente y el token de acceso ***
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token; // Usar el token si la sesión existe

    if (!accessToken) {
      setMessage('Error: Usuario no autenticado. Por favor, inicia sesión nuevamente.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('nombre', productName);
    formData.append('precio', price);
    if (description) formData.append('descripcion', description);
    if (selectedCategoryId) formData.append('categoria_id', selectedCategoryId); // Use selectedCategoryId
    formData.append('image', productImage);
    formData.append('stock', stock); // Add stock to formData

    try {
      // *** Incluir el token en la cabecera Authorization ***
      const response = await fetch('/api/productos', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        // Ya no necesitamos credentials: 'include' porque enviamos el token manualmente
      });


      if (response.ok) {
         const data = await response.json();
        setMessage('Producto agregado con éxito.');
        // Opcional: Limpiar el formulario después del éxito
        setProductName('');
        setPrice('');
        setDescription('');
        setSelectedCategoryId('');
        setProductImage(null);
        setStock('0'); // Reset stock field
      } else {
        // Attempt to parse error details from the response body
        let errorDetails = 'Error desconocido';
        try {
          const data = await response.json();
           console.error('API Error Response Data:', data); // Log the full error data object
          if (data && (data.error || data.details)) {
            errorDetails = data.error || data.details;
          } else {
            errorDetails = JSON.stringify(data) || response.statusText || `Error con estado ${response.status}`;
          }
        } catch (jsonError) {
          console.error('Error parsing API error response:', jsonError);
          errorDetails = response.statusText || `Error con estado ${response.status}`;
        }
        setMessage(`Error al agregar el producto: ${errorDetails}`);
      }

    } catch (error: any) {
      setMessage(`Error en la solicitud: ${error.message}`);
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingCategory(true);
    setNewCategoryMessage('');

    if (!newCategoryImageFile) {
      setNewCategoryMessage('Por favor, selecciona una imagen para la nueva categoría.');
      setAddingCategory(false);
      return;
    }
    
    // *** Obtener la sesión del cliente y el token de acceso para la nueva categoría también ***
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token; // Usar el token si la sesión existe

     if (!accessToken) {
      setNewCategoryMessage('Error: Usuario no autenticado para agregar categoría.');
      setAddingCategory(false);
      return;
    }

    const formData = new FormData();
    formData.append('nombre', newCategoryName);
    formData.append('slug', newCategorySlug); // Assuming slug is needed for categories
    if (newCategoryDescription) formData.append('descripcion', newCategoryDescription);
    formData.append('image', newCategoryImageFile); // Assuming backend handles image upload for category

    try {
      // Assuming an API endpoint for adding categories exists
      const response = await fetch('/api/categorias', {
        method: 'POST',
        body: formData,
         headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        // credentials: 'include', // Ya no necesario aquí tampoco
      });

      const data = await response.json();

      if (response.ok) {
        setNewCategoryMessage('Categoría agregada con éxito.');
        // Refresh categories list
        const fetchResponse = await fetch('/api/categorias'); // Consider if this needs auth header too
        if (fetchResponse.ok) {
          const categoriesData = await fetchResponse.json();
          setCategories(categoriesData);
          // Optionally select the newly added category in the product form dropdown
           if (data && data.id) {
             setSelectedCategoryId(data.id);
           }
        }
        // Clear new category form
        setNewCategoryName('');
        setNewCategorySlug('');
        setNewCategoryDescription('');
        setNewCategoryImageFile(null);
        setShowNewCategoryForm(false); // Hide the new category form
      } else {
        setNewCategoryMessage(`Error al agregar la categoría: ${data.error || 'Error desconocido'}`);
        console.error('API Error adding category:', data.details);
      }

    } catch (error: any) {
      setNewCategoryMessage(`Error en la solicitud al agregar categoría: ${error.message}`);
      console.error('Fetch Error adding category:', error);
    } finally {
      setAddingCategory(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Producto</h2>
      <div>
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          step="0.01"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        ></textarea>
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          id="stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          min="0" // Ensure stock is not negative
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
        <select
          id="category"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required // Made category selection required
        >
          <option value="">-- Seleccionar Categoría --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
         <button
           type="button"
           onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
           className="text-blue-600 hover:text-blue-800 text-sm font-medium"
         >
           {showNewCategoryForm ? 'Cancelar Nueva Categoría' : '¿Añadir Nueva Categoría?'}
         </button>
      </div>


      {showNewCategoryForm && (
        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Añadir Nueva Categoría</h3>
          <div>
            <label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-700">Nombre de la Categoría</label>
            <input
              type="text"
              id="newCategoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
           <div>
            <label htmlFor="newCategorySlug" className="block text-sm font-medium text-gray-700">Slug de la Categoría</label>
            <input
              type="text"
              id="newCategorySlug"
              value={newCategorySlug}
              onChange={(e) => setNewCategorySlug(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="newCategoryDescription" className="block text-sm font-medium text-gray-700">Descripción de la Categoría (Opcional)</label>
            <textarea
              id="newCategoryDescription"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              rows={2}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>
          <div>
            <label htmlFor="newCategoryImage" className="block text-sm font-medium text-gray-700">Imagen de la Categoría</label>
            <input
              type="file"
              id="newCategoryImage"
              accept="image/*"
              onChange={(e) => setNewCategoryImageFile(e.target.files ? e.target.files[0] : null)}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
           <button
            type="button" // Use type="button" to prevent this from submitting the product form
            onClick={handleAddNewCategory}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            disabled={addingCategory}
          >
            {addingCategory ? 'Añadiendo...' : 'Crear Categoría'}
          </button>
           {newCategoryMessage && <p className={`mt-4 text-sm text-center ${newCategoryMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{newCategoryMessage}</p>}
        </div>
      )}


      <div>
        <label htmlFor="productImage" className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
        <input
          type="file"
          id="productImage"
          accept="image/*"
          onChange={(e) => setProductImage(e.target.files ? e.target.files[0] : null)}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        disabled={loading || showNewCategoryForm} // Disable product submit while adding category
      >
        {loading ? 'Guardando...' : 'Agregar Producto'}
      </button>

      {message && <p className={`mt-4 text-sm text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
    </form>
  );
};

export default AddProductForm;
