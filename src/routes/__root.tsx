import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {
  AppAgGridProvider,
  AppLocalizationProvider,
  AppNotificationProvider,
  AppQueryProvider,
  AppStoreProvider,
  AppThemeProvider,
} from "../providers";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <AppStoreProvider>
      <AppLocalizationProvider>
        <AppQueryProvider>
          <AppThemeProvider>
            <AppNotificationProvider>
              <AppAgGridProvider>
                <Outlet />
                <TanStackRouterDevtools position="bottom-right" />
              </AppAgGridProvider>
            </AppNotificationProvider>
          </AppThemeProvider>
        </AppQueryProvider>
      </AppLocalizationProvider>
    </AppStoreProvider>
  );
}
