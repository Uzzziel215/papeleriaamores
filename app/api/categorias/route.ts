import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: categories, error } = await supabase.from('categorias').select('id, nombre, slug');

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ error: 'Error fetching categories', details: error.message }, { status: 500 });
    }

    return NextResponse.json(categories);

  } catch (error: any) {
    console.error('Unexpected error fetching categories:', error);
    return NextResponse.json({ error: 'Unexpected error', details: error.message }, { status: 500 });
  }
}

// This route will also need a POST handler later for adding new categories
// export async function POST(request: Request) { ... }