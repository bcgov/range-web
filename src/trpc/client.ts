import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import type { AppRouter } from 'range-api-v2';

export const trpc = createTRPCReact<AppRouter>();
