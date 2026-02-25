import { useState } from 'react';
import { X } from 'lucide-react';

interface JoinModalProps {
	onJoin: (name: string, idNumber: string, pin: string, inviteCode: string) => void;
	onBack: () => void;
	isLoading?: boolean;
}

export function JoinModal({ onJoin, onBack, isLoading }: JoinModalProps) {
	const [name, setName] = useState('');
	const [idNumber, setIdNumber] = useState('');
	const [pin, setPin] = useState('');
	const [inviteCode, setInviteCode] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name && idNumber && pin.length === 4 && inviteCode) {
			onJoin(name, idNumber, pin, inviteCode);
		}
	};

	return (
		<div className="fixed inset-0 bg-text/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
			<div className="bg-surface rounded-2xl border border-border w-full max-w-md lg:max-w-4xl overflow-hidden flex flex-col lg:flex-row relative">
				<button
					onClick={onBack}
					className="absolute top-4 right-4 p-2 text-muted hover:text-text hover:bg-bg rounded-lg transition-colors z-10"
					aria-label="Close"
				>
					<X size={24} />
				</button>
				
				{/* Left Panel - Large Devices Only */}
				<div className="hidden lg:flex lg:w-1/2 bg-accent p-12 flex-col justify-center text-bg">
					<h1 className="text-4xl font-bold mb-4">Join Your Team</h1>
					<p className="text-lg opacity-90">
						Ready to help manage the shop? Enter the invite code provided by your shop owner to join the digital ledger and start recording transactions.
					</p>
				</div>

				{/* Right Panel - Form */}
				<div className="w-full lg:w-1/2 p-8">
					<h2 className="text-text text-2xl font-bold mb-6">Join Existing Shop</h2>
					
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label className="block text-text text-sm mb-2">Your Name</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:ring-2 focus:ring-accent/20"
								placeholder="Your name"
								required
							/>
						</div>

						<div className="mb-4">
							<label className="block text-text text-sm mb-2">ID Number</label>
							<input
								type="text"
								inputMode="numeric"
								value={idNumber}
								onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ''))}
								className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:ring-2 focus:ring-accent/20"
								placeholder="12345678"
								required
							/>
						</div>

						<div className="mb-4">
							<label className="block text-text text-sm mb-2">Invite Code</label>
							<input
								type="text"
								value={inviteCode}
								onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
								className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-accent/20"
								placeholder="DUKA-1234"
								required
							/>
						</div>

						<div className="mb-6">
							<label className="block text-text text-sm mb-2">Create Your PIN</label>
							<input
								type="password"
								inputMode="numeric"
								maxLength={4}
								value={pin}
								onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
								className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text tracking-[0.5rem] focus:outline-none focus:ring-2 focus:ring-accent/20"
								placeholder="••••"
								required
							/>
						</div>

						<button
							type="submit"
							disabled={isLoading || !name || !idNumber || pin.length !== 4 || !inviteCode}
							className="w-full py-3 bg-accent text-bg rounded-lg font-bold disabled:opacity-50 mb-3 transition-colors hover:bg-accent/90"
						>
							{isLoading ? 'Joining...' : 'Join Shop'}
						</button>

						<button
							type="button"
							onClick={onBack}
							className="w-full py-3 border border-border text-text rounded-lg hover:bg-bg transition-colors"
						>
							Back to Home
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
