import { readAllAuthorized } from '@/utils/database/environment';
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
