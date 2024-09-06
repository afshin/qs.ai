import { getAuthUser } from '@/utils/auth-helpers/server';
import { shareProject, readOne } from '@/utils/database/sharing';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  const authHeader = request.headers.get('authorization');
  const userId = await getAuthUser(authHeader);
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const body = await request.json();
  const response = await shareProject({
    userId,
    projectId: params.uid,
    role: body['role'],
    emails: body['emails']
  });
  return new NextResponse(JSON.stringify(response));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  const authHeader = request.headers.get('authorization');
  const userId = await getAuthUser(authHeader);
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const response = await readOne({
    userId,
    resourceUID: params.uid
  });
  return new NextResponse(JSON.stringify(response));
}
