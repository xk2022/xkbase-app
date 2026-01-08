import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,   // ⭐ v5 用這個 helper
} from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
            // v4: keepPreviousData: true
            // v5: 改成這樣：
            placeholderData: keepPreviousData,
          },
        },
      }),
  )

  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}
