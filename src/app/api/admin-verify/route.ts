import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_COOKIE = 'netcy_admin_access';
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json();
    if (!accessToken) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    // Create a Supabase client authenticated with the user's access token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
    );

    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check admin role in the clients table
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('role')
      .eq('id', user.id)
      .single();

    if (clientError || !client || client.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Role confirmed — set a secure HTTP-only cookie
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, 'granted', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
      path: '/netcy-secure-access',
    });
    return response;

  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  // Called on admin sign-out
  const response = NextResponse.json({ ok: true });
  response.cookies.set('netcy_admin_access', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/netcy-secure-access',
  });
  return response;
}
