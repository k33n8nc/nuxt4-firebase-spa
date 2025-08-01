import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(async (to) => {
  // Middleware should only run on client side
  if (process.server) {
    return;
  }

  const { user, isAuthReady } = useAuth();

  // If auth is not ready, wait for it
  if (!isAuthReady.value) {
    await new Promise((resolve) => {
      const stopWatching = watch(isAuthReady, (value) => {
        if (value) {
          stopWatching();
          resolve(value);
        }
      });
    });
  }

  const isAuthenticated = !!user.value;

  if (isAuthenticated && to.path === '/login') {
      return navigateTo('/');
  }

  if (!isAuthenticated && to.path !== '/login') {
    return navigateTo('/login');
  }
});
