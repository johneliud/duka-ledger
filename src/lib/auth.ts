const API_URL = import.meta.env.VITE_API_URL;

interface AuthResponse {
	token: string;
	user: {
		id: string;
		name: string;
	};
	shop: {
		id: string;
		name: string;
	};
	role?: string;
}

export async function login(name: string, pin: string): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/api/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, pin })
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Login failed');
	}

	return response.json();
}

export async function register(name: string, pin: string, shopName: string): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/api/auth/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, pin, shop_name: shopName })
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Registration failed');
	}

	return response.json();
}

export async function joinShop(name: string, pin: string, inviteCode: string): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/api/auth/join`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, pin, invite_code: inviteCode })
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Failed to join shop');
	}

	return response.json();
}
