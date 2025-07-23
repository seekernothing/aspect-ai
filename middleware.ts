import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/video-upload(.*)",
  "/social-share(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/home",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  const { userId } = auth();
  if (
    userId &&
    isPublicRoute(req) &&
    !["/", "/home"].includes(new URL(req.url).pathname)
  ) {
    return Response.redirect(new URL("/home", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
