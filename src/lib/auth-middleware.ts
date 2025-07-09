// Middleware للتحقق من المصادقة في APIs
import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function verifyAuth(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return { authenticated: false, user: null };
  }

  return { authenticated: true, user: session.user };
}

export function createAuthenticatedHandler(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const auth = await verifyAuth(request);
    
    if (!auth.authenticated) {
      return Response.json(
        { success: false, message: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    return handler(request, context, auth.user);
  };
}
