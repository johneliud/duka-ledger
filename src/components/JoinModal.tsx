import { useState } from 'react';

interface JoinModalProps {
	onJoin: (name: string, pin: string, inviteCode: string) => void;
	onBack: () => void;
	isLoading?: boolean;
}

export function JoinModal({ onJoin, onBack, isLoading }: JoinModalProps) {
	const [name, setName] = useState('');
	const [pin, setPin] = useState('');
	const [inviteCode, setInviteCode] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name && pin.length === 4 && inviteCode) {
			onJoin(name, pin, inviteCode);
		}
	};

	return (
		<div className="fixed inset-0 bg-text/50 backdrop-blur-lg flex items-center justify-center z-50">
			<div className="bg-surface p-8 rounded-2xl border border-border w-[90%] max-w-md">
				<h2 className="text-text text-2xl font-bold mb-6">Join Existing Shop</h2>
				
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-text text-sm mb-2">Your Name</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text"
							placeholder="Your name"
							required
						/>
					</div>

					<div className="mb-4">
						<label className="block text-text text-sm mb-2">Invite Code</label>
						<input
							type="text"
							value={inviteCode}
							onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
							className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text uppercase tracking-wider"
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
							className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text tracking-[0.5rem]"
							placeholder="••••"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading || !name || pin.length !== 4 || !inviteCode}
						className="w-full py-3 bg-primary text-bg rounded-lg font-bold disabled:opacity-50 mb-3"
					>
						{isLoading ? 'Joining...' : 'Join Shop'}
					</button>

					<button
						type="button"
						onClick={onBack}
						className="w-full py-3 border border-border text-text rounded-lg"
					>
						Back to Login
					</button>
				</form>
			</div>
		</div>
	);
}
