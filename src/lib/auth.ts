const API_URL = import.meta.env.API_URL;

interface AuthResponse {
	token: string;
	user: {
		id: string;
		name: string;
		id_number: string;
	};
	shop: {
		id: string;
		name: string;
	};
	role?: string;
}

export async function login(idNumber: string, pin: string): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/api/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id_number: idNumber, pin })
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Login failed');
	}

	return response.json();
}

export async function register(name: string, idNumber: string, pin: string, shopName: string): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/api/auth/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, id_number: idNumber, pin, shop_name: shopName })
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Registration failed');
	}

	return response.json();
}

export async function joinShop(name: string, idNumber: string, pin: string, inviteCode: string): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/api/auth/join`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, id_number: idNumber, pin, invite_code: inviteCode })
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Failed to join shop');
	}

	return response.json();
}
