import { deleteOne, readOne } from '@/utils/database/environment';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
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

  const resourceUID = params.uid;

  const response = await readOne(userId, resourceUID);
  return new NextResponse(JSON.stringify(response));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
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

  const resourceUID = params.uid;
  console.log('deleting', resourceUID);
  const response = await deleteOne(userId, resourceUID);
  return new NextResponse(JSON.stringify(response));
}
