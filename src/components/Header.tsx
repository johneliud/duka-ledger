import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, Store, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
	const { logout } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const toggleTheme = () => setIsDarkMode(!isDarkMode);

	const navLinks = [
		{ name: 'Products', path: '/products' },
		{ name: 'Record Sale', path: '/record-sale' },
		{ name: 'Sales History', path: '/sales-history' },
		{ name: 'Expenses', path: '/expenses' },
		{ name: 'Debt Book', path: '/debt-book' },
	];

	return (
		<header className="sticky h-20 flex items-center top-0 z-40 w-full bg-surface border-b border-border">
			<div className="container mx-auto px-4 lg:px-0 h-16 flex items-center justify-between">
				{/* Left: Logo */}
				<Link to="/" className="flex items-center gap-2 text-primary">
					<span className="text-xl font-bold tracking-tight text-text">Duka Ledger</span>
				</Link>

				{/* Middle: Desktop Navigation */}
				<nav className="hidden md:flex items-center gap-6">
					{navLinks.map((link) => (
						<Link
							key={link.name}
							to={link.path}
							className="text-sm font-medium text-muted hover:text-primary transition-colors"
						>
							{link.name}
						</Link>
					))}
				</nav>

				{/* Right: Theme Toggle & Hamburger */}
				<div className="flex items-center gap-2">
					<button
						onClick={logout}
						className="p-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
						aria-label="Logout"
						title="Logout"
					>
						<LogOut size={20} />
					</button>

					<button
						onClick={toggleTheme}
						className="p-2 text-muted hover:text-primary hover:bg-bg rounded-lg transition-colors"
						aria-label="Toggle theme"
					>
						{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
					</button>

					<button
						onClick={toggleMenu}
						className="md:hidden p-2 text-muted hover:text-primary hover:bg-bg rounded-lg transition-colors"
						aria-label="Toggle menu"
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</div>

			{/* Mobile Dropdown Menu */}
			{isMenuOpen && (
				<div className="md:hidden fixed inset-0 z-50 bg-text/20 backdrop-blur-sm" onClick={toggleMenu}>
					<div 
						className="absolute top-0 left-0 h-full w-3/4 bg-surface shadow-2xl border-r border-border p-6 flex flex-col gap-6 animate-slide-in-left"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center gap-2 text-primary mb-4">
							<Store size={24} strokeWidth={2.5} />
							<span className="text-xl font-bold tracking-tight text-text">Duka Ledger</span>
						</div>
						
						<nav className="flex flex-col gap-4">
							{navLinks.map((link) => (
								<Link
									key={link.name}
									to={link.path}
									onClick={toggleMenu}
									className="text-lg font-medium text-text hover:text-primary py-2 transition-colors"
								>
									{link.name}
								</Link>
							))}
							<button
								onClick={() => {
									toggleMenu();
									logout();
								}}
								className="text-lg font-medium text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors flex items-center gap-2 mt-4 border border-red-100"
							>
								<LogOut size={20} />
								Logout
							</button>
						</nav>
					</div>
				</div>
			)}
		</header>
	);
}
