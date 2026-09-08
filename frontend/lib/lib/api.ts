/**
 * API Client for frontend to communicate with the backend.
 * This replaces the direct Prisma client for security and separation of concerns.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  // Users
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    return response.json();
  },

  async getUser(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    return response.json();
  },

  // Tutorials
  async getTutorials(): Promise<Tutorial[]> {
    const response = await fetch(`${API_BASE_URL}/tutorials`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tutorials: ${response.statusText}`);
    }
    return response.json();
  },

  async getTutorial(id: string): Promise<Tutorial> {
    const response = await fetch(`${API_BASE_URL}/tutorials/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tutorial: ${response.statusText}`);
    }
    return response.json();
  },

  // Generic fetch for custom endpoints
  async fetch(endpoint: string, options?: RequestInit): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
  },
};

export default api;
