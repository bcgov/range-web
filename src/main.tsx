import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClientProvider as TRPCQueryClientProvider } from '@trpc/react-query';
import superjson from 'superjson';
import { trpc } from './trpc/client';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <trpc.Provider
      client={trpc.createClient({
        links: [
          httpBatchLink({
            url: '/trpc',
            transformer: superjson,
          }),
        ],
      })}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>,
);
