import { HydrationBoundary, QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { getQueryKey } from "@trpc/react-query";
import { renderToString } from "react-dom/server";
import superjson from "superjson";
import { Router } from "wouter";
import App from "./App";
import { trpc } from "./lib/trpc";
import { getSsrHead, type SsrHead } from "./ssr/metadata";
import "./components/BrandCards.css";
import "./components/HomeVideoFeature.css";
import type { Theme } from "./contexts/ThemeContext";

export type SsrRenderResult = { html: string; dehydratedState: unknown; head: SsrHead };
export type SsrPublicData = {
  cms: unknown;
  vehicleContent: unknown;
  brands: unknown;
  brandPresentations: unknown;
};

export async function render(url: string, origin: string, publicData?: SsrPublicData, initialTheme?: Theme): Promise<SsrRenderResult> {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } });
  const splitAt = url.indexOf("?");
  const ssrPath = splitAt === -1 ? url : url.slice(0, splitAt);
  const ssrSearch = splitAt === -1 ? "" : url.slice(splitAt + 1);
  const trpcClient = trpc.createClient({ links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })] });
  const head = getSsrHead(url, origin);
  if (publicData) {
    queryClient.setQueryData(getQueryKey(trpc.cms.public, undefined, "query"), publicData.cms);
    queryClient.setQueryData(getQueryKey(trpc.vehicle.publicContent, undefined, "query"), publicData.vehicleContent);
    queryClient.setQueryData(getQueryKey(trpc.brand.publicList, undefined, "query"), publicData.brands);
    queryClient.setQueryData(getQueryKey(trpc.brand.publicPresentationList, undefined, "query"), publicData.brandPresentations);
  }
  const dehydratedState = dehydrate(queryClient);
  const html = renderToString(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <Router ssrPath={ssrPath} ssrSearch={ssrSearch}><App initialTheme={initialTheme} /></Router>
        </HydrationBoundary>
      </QueryClientProvider>
    </trpc.Provider>,
    { identifierPrefix: "zaverre-" },
  );
  return { html, dehydratedState, head };
}
