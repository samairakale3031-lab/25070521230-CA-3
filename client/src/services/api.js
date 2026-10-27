// Base API utility supporting both HttpOnly cookies and Bearer tokens

const API_BASE = '/api';

const request = async (endpoint, options = {}) => {
  const config = {
    ...options,
    credentials: 'include', // sends and receives cookies
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  };

  // If a token was saved in localStorage as a fallback, attach it
  const token = localStorage.getItem('orbit_jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data?.message || `Request failed with status ${res.status}`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
};

export const authApi = {
  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),

  me: () => request('/auth/me'),
};

export const planetsApi = {
  getAll: () => request('/planets'),
  getBySlug: (slug) => request(`/planets/${slug}`),
};

export const savedDiscoveriesApi = {
  getAll: () => request('/saved-discoveries'),
  save: (planetSlug) =>
    request('/saved-discoveries', {
      method: 'POST',
      body: JSON.stringify({ planetSlug }),
    }),
  remove: (slugOrId) =>
    request(`/saved-discoveries/${slugOrId}`, {
      method: 'DELETE',
    }),
};

export const quizApi = {
  getQuestions: () => request('/quiz/questions'),
  evaluate: (answers) =>
    request('/quiz/evaluate', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
  submitAttempt: (answers) =>
    request('/quiz/attempts', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
  getHistory: () => request('/quiz/attempts'),
};

export const nasaApi = {
  search: (query) => request(`/nasa/search?q=${encodeURIComponent(query)}`),
};

export const healthApi = {
  check: () => request('/health'),
};
