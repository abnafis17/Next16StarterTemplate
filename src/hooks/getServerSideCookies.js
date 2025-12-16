import { cookies } from 'next/headers';

export function getServerSideCookies() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;
  const user = cookieStore.get('@authUser')?.value;

  return {
    accessToken,
    refreshToken,
    user: user ? JSON.parse(user) : null,
  };
}
