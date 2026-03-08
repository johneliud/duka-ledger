import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: { componentStack?: string }) {
		console.error('[ErrorBoundary]', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen bg-bg flex items-center justify-center p-4">
					<div className="bg-surface border border-border rounded-lg p-8 max-w-md text-center">
						<AlertTriangle className="text-primary mx-auto mb-4" size={48} />
						<h1 className="text-2xl font-bold text-text mb-2">Something went wrong</h1>
						<p className="text-muted mb-6">
							The app encountered an unexpected error. Your data is safe and stored locally.
						</p>
						<button
							onClick={() => window.location.reload()}
							className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-accent transition-colors"
						>
							Reload App
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
