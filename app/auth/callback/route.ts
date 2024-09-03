import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers';
import { createUserStorage } from '@/utils/storage/create_storage';
import { saveCookies } from '@/utils/auth-helpers/server';
export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        return NextResponse.redirect(
          getErrorRedirect(
            `${requestUrl.origin}/signin`,
            error.name,
            "Sorry, we weren't able to log you in. Please try again."
          )
        );
      }
    } catch (e) {
      console.error(e);
    }

    const { data } = await supabase.auth.getSession();
    await saveCookies(data.session);
    await createUserStorage({ supabase, session: data.session });
  }
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(
    getStatusRedirect(
      `${requestUrl.origin}/account`,
      'Success!',
      'You are now signed in.'
    )
  );
}
