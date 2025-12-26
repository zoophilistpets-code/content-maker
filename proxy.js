import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 1. Define which routes are protected
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/api/generate-text(.*)']);

export default clerkMiddleware(async (auth, req) => {
	// 2. If the route is protected, call protect()
	// In the latest Clerk, protect() is the one-stop shop for redirects
	if (isProtectedRoute(req)) {
		await auth.protect();
	}
});

export const config = {
	matcher: [
		// 3. Match all routes except static files
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};