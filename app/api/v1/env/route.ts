import { createNew, readAllAuthorized } from '@/utils/database/environment';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const jwt = authHeader?.split(' ')[1];
  if (!jwt) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const supabaseClient = createClient();

  const authData = await supabaseClient.auth.getUser(jwt);
  const userId = authData.data.user?.id;
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const response = await readAllAuthorized(userId);
  return new NextResponse(JSON.stringify(response));
}

export async function POST(request: NextRequest) {
  const supabaseClient = createClient();
  const authData = await supabaseClient.auth.getUser();
  let userId = authData.data.user?.id;
  if (!userId) {
    const authHeader = request.headers.get('authorization');
    const jwt = authHeader?.split(' ')[1];
    if (!jwt) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const jwtAuthData = await supabaseClient.auth.getUser(jwt);
    userId = jwtAuthData.data.user?.id;
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }
  const body = await request.json();
  const state = await createNew(userId, body);
  return new NextResponse(JSON.stringify(state));
}
