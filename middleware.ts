import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Páginas públicas que não precisam de autenticação
  const publicPages = ["/login", "/register"];
  const isPublicPage = publicPages.includes(pathname);

  // Se está tentando acessar página pública e tem token válido, redireciona para dashboard
  if (isPublicPage && token) {
    const decoded = await verifyToken(token);
    if (decoded) {
      return NextResponse.redirect(new URL("/workspaces", request.url));
    }
  }

  // Se está tentando acessar página protegida sem token válido, redireciona para login
  if (!isPublicPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se tem token, verifica se é válido
  if (token && !isPublicPage) {
    const decoded = await verifyToken(token);
    if (!decoded) {
      // Token inválido, limpa o cookie e redireciona para login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth-token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
