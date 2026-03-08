import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, SquareArrowRightExit, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { SyncBadge } from '@/components/SyncBadge';
import { useTranslation } from 'react-i18next';

interface NavGroup {
	name: string;
	items: { name: string; path: string; tour: string }[];
}

export function Header() {
	const { logout, isAuthenticated } = useAuth();
	const { isDarkMode, toggleTheme } = useTheme();
	const { t } = useTranslation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const location = useLocation();

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	const navGroups: NavGroup[] = [
		{
			name: 'Sales',
			items: [
				{ name: t('nav.recordSale'), path: '/record-sale', tour: 'sales' },
				{ name: t('nav.salesHistory'), path: '/sales-history', tour: 'sales' },
			],
		},
		{
			name: 'Inventory',
			items: [
				{ name: t('nav.products'), path: '/products', tour: 'inventory' },
			],
		},
		{
			name: 'Finance',
			items: [
				{ name: t('nav.expenses'), path: '/expenses', tour: 'expenses' },
				{ name: t('nav.debtBook'), path: '/debt-book', tour: 'debt' },
			],
		},
		{
			name: 'Reports',
			items: [
				{ name: t('nav.analytics'), path: '/analytics', tour: 'reports' },
			],
		},
	];

	const singleLinks = [
		{ name: t('nav.dashboard'), path: '/dashboard', tour: 'dashboard' },
		{ name: t('nav.settings'), path: '/settings', tour: 'settings' },
	];

	const isActive = (path: string) => {
		if (path === '/dashboard') return location.pathname === path;
		return location.pathname.startsWith(path);
	};

	const isGroupActive = (group: NavGroup) => {
		return group.items.some(item => isActive(item.path));
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setOpenDropdown(null);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<header className="sticky h-20 flex items-center top-0 z-40 w-full bg-surface border-b border-border">
			<div className="container mx-auto px-4 xl:px-0 h-16 flex items-center justify-between">
				{/* Left: Logo */}
				<Link to="/" className="flex items-center gap-2 text-primary">
					<span className="text-xl font-bold tracking-tight text-text">Duka Ledger</span>
				</Link>

				{/* Middle: Desktop Navigation */}
				{isAuthenticated && (
					<nav className="hidden xl:flex items-center gap-1" ref={dropdownRef}>
						{/* Single Links */}
						{singleLinks.map((link) => (
							<Link
								key={link.name}
								to={link.path}
								data-tour={link.tour}
								className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
									isActive(link.path)
										? 'bg-accent text-white'
										: 'text-muted hover:text-primary hover:bg-bg'
								}`}
							>
								{link.name}
							</Link>
						))}

						{/* Dropdown Groups */}
						{navGroups.map((group) => (
							<div key={group.name} className="relative">
								<button
									onClick={() => setOpenDropdown(openDropdown === group.name ? null : group.name)}
									className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
										isGroupActive(group)
											? 'bg-accent text-white'
											: 'text-muted hover:text-primary hover:bg-bg'
									}`}
								>
									{group.name}
									<ChevronDown size={14} className={`transition-transform ${openDropdown === group.name ? 'rotate-180' : ''}`} />
								</button>
								
								{openDropdown === group.name && (
									<div className="absolute top-full left-0 mt-1 w-48 bg-surface border border-border rounded-lg shadow-lg py-1 z-50">
										{group.items.map((item) => (
											<Link
												key={item.path}
												to={item.path}
												onClick={() => setOpenDropdown(null)}
												className={`block px-4 py-2 text-sm font-medium transition-colors ${
													isActive(item.path)
														? 'bg-accent/10 text-accent'
														: 'text-muted hover:text-primary hover:bg-bg'
												}`}
											>
												{item.name}
											</Link>
										))}
									</div>
								)}
							</div>
						))}
					</nav>
				)}

				{/* Right: Sync Badge & Mobile Menu */}
				<div className="flex items-center gap-8">
					{isAuthenticated && (
						<>
							<SyncBadge />
							
							<button
								onClick={toggleMenu}
								className="xl:hidden p-2 text-muted hover:text-primary hover:bg-bg rounded-lg transition-colors"
								aria-label="Toggle menu"
							>
								{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
							</button>

							<div className="hidden xl:flex items-center gap-8">
								<button
									onClick={toggleTheme}
									className="py-2 text-muted hover:text-primary hover:bg-bg rounded-lg transition-colors"
									aria-label="Toggle theme"
								>
									{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
								</button>
								
								<button
									onClick={logout}
									className="py-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
									aria-label="Logout"
									title="Logout"
								>
									<SquareArrowRightExit size={20} />
								</button>
							</div>
						</>
					)}

					{!isAuthenticated && (
						<button
							onClick={toggleTheme}
							className="p-2 text-muted hover:text-primary hover:bg-bg rounded-lg transition-colors"
							aria-label="Toggle theme"
						>
							{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
						</button>
					)}
				</div>
			</div>

			{/* Mobile Dropdown Menu */}
			{isMenuOpen && isAuthenticated && (
				<div className="xl:hidden fixed inset-0 z-50 bg-text/20 backdrop-blur-sm" onClick={toggleMenu}>
					<div 
						className="absolute top-0 left-0 h-full w-3/4 bg-surface shadow-2xl border-r border-border p-6 flex flex-col gap-6 animate-slide-in-left"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center gap-2 text-primary mb-4">
							<span className="text-xl font-bold tracking-tight text-text">Duka Ledger</span>
						</div>
						
						<nav className="flex flex-col gap-2">
							{/* Single Links */}
							{singleLinks.map((link) => (
								<Link
									key={link.name}
									to={link.path}
									onClick={toggleMenu}
									className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${
										isActive(link.path)
											? 'bg-accent text-white'
											: 'text-text hover:text-primary hover:bg-bg'
									}`}
								>
									{link.name}
								</Link>
							))}

							{/* Group Headers */}
							{navGroups.map((group) => (
								<div key={group.name}>
									<div className="text-xs font-semibold text-muted uppercase tracking-wider px-4 py-2">
										{group.name}
									</div>
									{group.items.map((item) => (
										<Link
											key={item.path}
											to={item.path}
											onClick={toggleMenu}
											className={`block text-lg font-medium py-3 px-4 rounded-lg transition-colors ${
												isActive(item.path)
													? 'bg-accent text-white'
													: 'text-text hover:text-primary hover:bg-bg'
											}`}
										>
											{item.name}
										</Link>
									))}
								</div>
							))}
							
							<div className="border-t border-border pt-4 mt-2 space-y-2">
								<button
									onClick={() => {
										toggleTheme();
										toggleMenu();
									}}
									className="w-full text-lg font-medium text-text hover:text-primary py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
								>
									{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
									{isDarkMode ? 'Light Mode' : 'Dark Mode'}
								</button>
								
								<button
									onClick={() => {
										toggleMenu();
										logout();
									}}
									className="w-full text-lg font-medium text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors flex items-center gap-2 border border-red-100"
								>
									<SquareArrowRightExit size={20} />
									Logout
								</button>
							</div>
						</nav>
					</div>
				</div>
			)}
		</header>
	);
}
