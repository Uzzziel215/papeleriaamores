// app/api/productos/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Importa tu definición de base de datos si la tienes
// import { Database } from '@/types/database.types';

export async function POST(request: Request) {
  // Explicitly await cookies() as suggested by Next.js warnings
  const cookieStore = await cookies();

  // Log incoming cookies for debugging
  console.log('API Productos POST: Incoming cookies:', cookieStore.getAll());

  // Explicitly get the auth cookie value for logging/debugging
  const supabaseAuthCookie = cookieStore.get('sb-qoqchpazcfstknthdizp-auth-token');
  console.log('API Productos POST: Supabase auth cookie value:', supabaseAuthCookie);


  // Use the auth-helpers client to get the user session from the cookie
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  console.log('API Productos POST: Attempting authentication via createRouteHandlerClient...');
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
      console.error('API Productos POST: Error getting user from cookie:', authError);
      // Check if the specific cookie missing error is happening
      if (authError.message === 'Auth session missing!') {
           console.error('API Productos POST: Specific error - Auth session missing.');
      }
      return NextResponse.json({ error: 'Authentication error', details: authError.message }, { status: 401 });
  }

  // If no user authenticated via cookie, return Unauthorized
  if (!user) {
    console.error('API Productos POST: User not authenticated via cookie.');
    return NextResponse.json({ error: 'Unauthorized - User not authenticated' }, { status: 401 });
  }

  // If we reach here, the user is authenticated via the cookie
  console.log('API Productos POST: User successfully authenticated via cookie.', { userId: user.id });

  try {
    // The rest of your product creation logic remains the same, using the authenticated `supabase` client
    // La verificación de rol de administrador se basa principalmente en las políticas RLS
    // configuradas en Supabase (Scripts 1 y 2). Si el usuario no es admin (no está en admin_users),
    // la inserción en la DB fallará con un error de RLS, que capturaremos abajo.

    // 2. Procesar el formulario y la imagen
    const formData = await request.formData();
    const nombre = formData.get('nombre') as string;
    const precioStr = formData.get('precio') as string;
    const precio = parseFloat(precioStr);

    const descripcion = formData.get('descripcion') as string | null;
    const categoria_id = formData.get('categoria_id') as string | null;
    const imageFile = formData.get('image') as File | null;

    if (!nombre || isNaN(precio) || precio < 0 || !imageFile) {
      console.error('API Productos POST: Missing or invalid required fields.');
      return NextResponse.json({ error: 'Missing or invalid required fields (nombre, precio, image)' }, { status: 400 });
    }

    // 3. Insert product into 'productos' table
    const { data: productData, error: insertProductError } = await supabase
      .from('productos')
      .insert([
        {
          nombre,
          precio,
          descripcion,
          categoria_id: categoria_id || null,
          stock: parseInt(formData.get('stock') as string || '0'),
          sku: formData.get('sku') as string | null,
        },
      ])
      .select('id')
      .single();

    if (insertProductError) {
      console.error('API Productos POST: Error inserting product:', insertProductError);
      if (insertProductError.code === '42501') {
         console.log('API Productos POST: Returning 403 Forbidden due to RLS.');
         return NextResponse.json({ error: 'Forbidden - Admins only or RLS policy violated' }, { status: 403 });
      }
      console.log('API Productos POST: Returning 500 Failed to insert product.');
      return NextResponse.json({ error: 'Failed to insert product', details: insertProductError.message }, { status: 500 });
    }

    const newProductId = productData.id;
    let imagenUrl = null;
    const bucketName = 'imagenes-productos'; // Corrected bucket name

    // 4. Upload image to Supabase Storage
    const uploadedFilePath = `${newProductId}/${Date.now()}.${imageFile.name.split('.').pop()}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(uploadedFilePath, imageFile);

    if (uploadError) {
      console.error('API Productos POST: Error uploading image:', uploadError);
      await supabase.from('productos').delete().eq('id', newProductId);
      console.log('API Productos POST: Returning 500 Failed to upload image.');
      return NextResponse.json({ error: 'Failed to upload image', details: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: finalPublicUrlData } = supabase.storage.from(bucketName).getPublicUrl(uploadedFilePath);
    imagenUrl = finalPublicUrlData.publicUrl;

    // 5. Insert image URL into 'imagenes_producto' table
    const { data: imageData, error: insertImageError } = await supabase
      .from('imagenes_producto')
      .insert([
        {
          producto_id: newProductId,
          url: imagenUrl,
          alt_text: `${nombre} image`,
          es_principal: true,
          orden: 1,
        },
      ]);

    if (insertImageError) {
      console.error('API Productos POST: Error inserting product image:', insertImageError);
      await supabase.from('productos').delete().eq('id', newProductId);
      await supabase.storage.from(bucketName).remove([uploadedFilePath]);
      console.log('API Productos POST: Returning 500 Failed to insert product image.');
      return NextResponse.json({ error: 'Failed to insert product image', details: insertImageError.message }, { status: 500 });
    }

    // 6. Successful response
    const { data: fullProductData } = await supabase
      .from('productos')
      .select('*, imagenes_producto(*)')
      .eq('id', newProductId)
      .single();

    return NextResponse.json({ message: 'Product added successfully', product: fullProductData }, { status: 201 });

  } catch (error: any) {
    console.error('API Productos POST: Caught unhandled exception during product creation:', error);
    console.log('API Productos POST: Returning 500 Internal server error from catch.');
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
