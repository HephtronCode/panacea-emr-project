import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
	return (
		<div className="flex flex-col h-screen w-full items-center justify-center bg-background text-foreground p-6 text-center animate-in fade-in zoom-in duration-300">
			<div className="bg-destructive/10 p-4 rounded-full mb-4 ring-1 ring-destructive/20">
				<AlertTriangle className="h-10 w-10 text-destructive" />
			</div>

			<h2 className="text-3xl font-bold mb-2 tracking-tight">
				System Critical Error
			</h2>
			<p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
				The application encountered an unexpected state and tracked a crash
				report. The engineering team has been notified.
			</p>

			{/* Dev-only stack trace visualization */}
			{process.env.NODE_ENV !== "production" && (
				<div className="bg-muted/50 p-4 rounded-lg border border-border text-left w-full max-w-2xl mb-8 overflow-auto max-h-64 shadow-inner">
					<p className="text-sm font-semibold mb-2 text-foreground">
						Stack Trace:
					</p>
					<code className="text-xs font-mono text-destructive whitespace-pre-wrap">
						{error.message}
						{error.stack}
					</code>
				</div>
			)}

			<div className="flex gap-4">
				<Button
					variant="outline"
					onClick={() => window.location.reload()}
					className="min-w-[120px]"
				>
					Reload Page
				</Button>
				<Button onClick={resetErrorBoundary} className="min-w-[120px]">
					Try Recovering
				</Button>
			</div>
		</div>
	);
};

export default ErrorFallback;
