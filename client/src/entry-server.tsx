import { HydrationBoundary, QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { renderToString } from "react-dom/server";
import superjson from "superjson";
import { Router } from "wouter";
import App from "./App";
import { trpc } from "./lib/trpc";
import { getSsrHead, type SsrHead } from "./ssr/metadata";

export type SsrRenderResult = { html: string; dehydratedState: unknown; head: SsrHead };

export async function render(url: string, origin: string): Promise<SsrRenderResult> {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } });
  const splitAt = url.indexOf("?");
  const ssrPath = splitAt === -1 ? url : url.slice(0, splitAt);
  const ssrSearch = splitAt === -1 ? "" : url.slice(splitAt + 1);
  const trpcClient = trpc.createClient({ links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })] });
  const head = getSsrHead(url, origin);
  const dehydratedState = dehydrate(queryClient);
  const html = renderToString(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <Router ssrPath={ssrPath} ssrSearch={ssrSearch}><App /></Router>
        </HydrationBoundary>
      </QueryClientProvider>
    </trpc.Provider>,
    { identifierPrefix: "zaverre-" },
  );
  return { html, dehydratedState, head };
}
