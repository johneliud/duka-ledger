export function Footer() {
	return (
		<footer className="bg-surface border-t border-border py-12">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row justify-between items-center gap-6">
					<div className="flex flex-col items-center md:items-start">
						<span className="text-xl font-bold text-text mb-2">Duka Ledger</span>
						<p className="text-muted text-sm text-center md:text-left max-w-xs">
							Empowering small businesses with a simple, digital, and offline-first ledger for tracking sales and inventory.
						</p>
					</div>
					
					<div className="text-muted text-sm">
						&copy; {new Date().getFullYear()} Duka Ledger. All rights reserved.
					</div>
				</div>
			</div>
		</footer>
	);
}
