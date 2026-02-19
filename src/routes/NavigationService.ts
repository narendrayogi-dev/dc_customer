import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/* ---------- BASIC ---------- */

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

/* ---------- RESET ---------- */

export function resetTo(routeName: string, params?: object) {
  console.log(navigationRef.isReady(), "navigation");
  
  if (!navigationRef.isReady()) return;

  navigationRef.reset({
    index: 0,
    routes: [{ name: routeName, params }],
  });
}


export function resetWithStack(routeNames: string[]) {
  if (!navigationRef.isReady()) return;

  navigationRef.reset({
    index: routeNames.length - 1,
    routes: routeNames.map(name => ({
      name,
    })),
  });
}

/* ---------- REPLACE ---------- */

export function replace(routeName: string, params?: object) {
  if (!navigationRef.isReady()) {
    return;
  }

  navigationRef.dispatch({
    ...navigationRef.getRootState(),
    routes: [{ name: routeName, params }],
    index: 0,
  });
}
