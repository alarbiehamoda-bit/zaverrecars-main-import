import { HydrationBoundary, QueryClient, QueryClientProvider, type DehydratedState } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot, hydrateRoot } from "react-dom/client";
import superjson from "superjson";
import { Router } from "wouter";
import { trpc } from "@/lib/trpc";
import { COOKIE_NAME, UNAUTHED_ERR_MSG } from "@shared/const";
import App from "./App";
import { startLogin } from "./const";
import { THEME_COOKIE, type Theme } from "./contexts/ThemeContext";
import "./PublicShell.css";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } });
const cookieTheme = document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${THEME_COOKIE}=`))?.slice(THEME_COOKIE.length + 1) as Theme | undefined;
const documentTheme = document.documentElement.dataset.theme as Theme | undefined;
const initialTheme = documentTheme === "light" || documentTheme === "dark" ? documentTheme : cookieTheme === "light" || cookieTheme === "dark" ? cookieTheme : undefined;
const isAdminRoute = () => window.location.pathname.startsWith("/admin");
const isUnauthorizedError = (error: unknown) => error instanceof TRPCClientError && error.message === UNAUTHED_ERR_MSG;
const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!isUnauthorizedError(error) || !isAdminRoute()) return;
  startLogin();
};
const shouldReportApiError = (error: unknown) => !isUnauthorizedError(error) || isAdminRoute();

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    if (shouldReportApiError(error)) console.error("[API Query Error]", error);
  }
});
queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    if (shouldReportApiError(error)) console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [httpBatchLink({
    url: "/api/trpc",
    transformer: superjson,
    headers() {
      const raw = sessionStorage.getItem("manus-cookie");
      const prefix = `${COOKIE_NAME}=`;
      const pair = raw?.split(";").find(item => item.trim().startsWith(prefix));
      const token = pair?.trim().slice(prefix.length);
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
    fetch(input, init) { return globalThis.fetch(input, { ...(init ?? {}), credentials: "include" }); },
  })],
});

const rawState = (window as Window & { __RQ_STATE__?: unknown }).__RQ_STATE__;
const state = rawState ? superjson.deserialize(rawState as any) as DehydratedState : undefined;
const app = <trpc.Provider client={trpcClient} queryClient={queryClient}><QueryClientProvider client={queryClient}><HydrationBoundary state={state}><Router><App initialTheme={initialTheme} /></Router></HydrationBoundary></QueryClientProvider></trpc.Provider>;
const root = document.getElementById("root")!;
if (root.firstChild) hydrateRoot(root, app, { identifierPrefix: "zaverre-" }); else createRoot(root).render(app);
