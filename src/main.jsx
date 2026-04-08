import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { store } from '@/store'
import App from './App'
import AppInit from './AppInit'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:         1000 * 60 * 2,   // 2 min
      gcTime:            1000 * 60 * 10,  // 10 min
      retry:             1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppInit>
            <App />
          </AppInit>
        </BrowserRouter>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </Provider>

    {/* ── Global Toast ── */}
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 3500,
        style: {
          background: '#1C1C1C',
          color: '#F0F0F0',
          border: '1px solid #2A2A2A',
          borderRadius: '10px',
          fontSize: '13px',
          fontFamily: 'DM Sans, sans-serif',
          padding: '10px 14px',
        },
        success: {
          iconTheme: { primary: '#F5C518', secondary: '#0A0A0A' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' },
        },
      }}
    />
  </React.StrictMode>,
)
