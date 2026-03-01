import { useState, useEffect } from 'react';

export function useTheme() {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const saved = localStorage.getItem('theme');
		return saved === 'dark';
	});

	useEffect(() => {
		const root = document.documentElement;
		if (isDarkMode) {
			root.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			root.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}, [isDarkMode]);

	const toggleTheme = () => setIsDarkMode(!isDarkMode);

	return { isDarkMode, toggleTheme };
}
