import { useState } from 'react';
import { X } from 'lucide-react';

interface RegisterModalProps {
	onRegister: (name: string, idNumber: string, pin: string, shopName: string) => void;
	onBack: () => void;
	isLoading?: boolean;
}

export function RegisterModal({ onRegister, onBack, isLoading }: RegisterModalProps) {
	const [name, setName] = useState('');
	const [idNumber, setIdNumber] = useState('');
	const [pin, setPin] = useState('');
	const [confirmPin, setConfirmPin] = useState('');
	const [shopName, setShopName] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name && idNumber && pin.length === 4 && pin === confirmPin && shopName) {
			onRegister(name, idNumber, pin, shopName);
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
				<div className="hidden lg:flex lg:w-1/2 bg-secondary p-12 flex-col justify-center text-bg">
					<h1 className="text-4xl font-bold mb-4">Start Your Journey</h1>
					<p className="text-lg opacity-90">
						Create a digital home for your business. Track every sale, manage inventory, and grow your shop with data-driven insights.
					</p>
				</div>

				{/* Right Panel - Form */}
				<div className="w-full lg:w-1/2 p-8 overflow-y-auto max-h-[90vh]">
					<h2 className="text-text text-2xl font-bold mb-6">Register New Shop</h2>
					
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label className="block text-text text-sm mb-2">Your Name</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:ring-2 focus:ring-secondary/20"
								placeholder="e.g. Mama Wanjiku"
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
								className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:ring-2 focus:ring-secondary/20"
								placeholder="12345678"
								required
							/>
						</div>

						<div className="mb-4">
							<label className="block text-text text-sm mb-2">Shop Name</label>
							<input
								type="text"
								value={shopName}
								onChange={(e) => setShopName(e.target.value)}
								className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text focus:outline-none focus:ring-2 focus:ring-secondary/20"
								placeholder="e.g. Wanjiku's Kiosk"
								required
							/>
						</div>

						<div className="mb-4">
							<label className="block text-text text-sm mb-2">Create PIN</label>
							<input
								type="password"
								inputMode="numeric"
								maxLength={4}
								value={pin}
								onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
								className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text tracking-[0.5rem] focus:outline-none focus:ring-2 focus:ring-secondary/20"
								placeholder="••••"
								required
							/>
						</div>

						<div className="mb-6">
							<label className="block text-text text-sm mb-2">Confirm PIN</label>
							<input
								type="password"
								inputMode="numeric"
								maxLength={4}
								value={confirmPin}
								onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
								className="w-full px-3 py-2 border border-border rounded-lg bg-bg text-text tracking-[0.5rem] focus:outline-none focus:ring-2 focus:ring-secondary/20"
								placeholder="••••"
								required
							/>
							{pin && confirmPin && pin !== confirmPin && (
								<p className="text-red-600 text-xs mt-1">PINs do not match</p>
							)}
						</div>

						<button
							type="submit"
							disabled={isLoading || !name || !idNumber || !shopName || pin.length !== 4 || pin !== confirmPin}
							className="w-full py-3 bg-secondary text-bg rounded-lg font-bold disabled:opacity-50 mb-3 transition-colors hover:bg-secondary/90"
						>
							{isLoading ? 'Creating...' : 'Create Shop'}
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
