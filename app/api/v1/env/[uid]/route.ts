import { getAuthUser } from '@/utils/auth-helpers/server';
import {
  createNewVersion,
  deleteOne,
  readOne
} from '@/utils/database/environment';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  const authHeader = request.headers.get('authorization');
  const userId = await getAuthUser(authHeader);
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
  const authHeader = request.headers.get('authorization');
  const userId = await getAuthUser(authHeader);
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const resourceUID = params.uid;
  const response = await deleteOne(userId, resourceUID);
  return new NextResponse(JSON.stringify(response));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  const authHeader = request.headers.get('authorization');
  const userId = await getAuthUser(authHeader);
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const resourceUID = params.uid;
  const body = await request.json();
  const response = await createNewVersion(userId, resourceUID, body);
  return new NextResponse(JSON.stringify(response));
}
