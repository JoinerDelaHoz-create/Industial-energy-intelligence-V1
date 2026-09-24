const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api/v1';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      return {
        success: false,
        error: errJson?.detail || `Error HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const json = await response.json();
    return {
      success: true,
      data: json.data !== undefined ? json.data : json,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error de comunicación de red';
    return {
      success: false,
      error: message,
    };
  }
}
