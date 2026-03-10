import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { jwt } from './lib/jwt';

// Define protected routes
const protectedRoutes = ['/'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authRoutes = ['/login', '/reset-password', '/register'];
  
  let cookie = request.cookies.get("refresh-token");

  if(pathname == "/register"){
    if(!cookie){
      if(process.env.ALLOW_REGISTER == "allow"){
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
    let isAuthenticated = await jwt.verifyToken(cookie.value, "refresh") != null;

    if(isAuthenticated || process.env.ALLOW_REGISTER == "allow"){
      return NextResponse.next();
    }else{
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if(pathname == "/login"){

    if(!cookie){
      return NextResponse.next();
    }
    let isAuthenticated = await jwt.verifyToken(cookie.value, "refresh") != null;

    if(isAuthenticated){
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }


  if(protectedRoutes.some(s => pathname.startsWith(s)) && !authRoutes.some(s => pathname.startsWith(s))){
    let cookie = request.cookies.get("refresh-token");

    if(!cookie){
      return NextResponse.redirect(new URL("/login", request.url));
    }
    let isAuthenticated = await jwt.verifyToken(cookie.value, "refresh") != null;

    if(isAuthenticated){
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static asset folders (images, fonts, assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|uploads|assets|fonts|location).*)',
  ],
};
