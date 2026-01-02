import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "@/dev/index.js";

// Global Query Config
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // Prevents erratic refetching
            retry: 1, // Limited retries on failure
            staleTime: 5 * 60 * 1000, // Data stays "fresh" for 5 minutes (caching)
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* Global Error Boundary acts as the ultimate safety net */}
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // Optional: reset global state here if needed
                window.location.replace("/");
            }}
        >
            <QueryClientProvider client={queryClient}>
                <DevSupport ComponentPreviews={ComponentPreviews}
                            useInitialHook={useInitial}
                >
                    <App/>
                </DevSupport>
            </QueryClientProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
