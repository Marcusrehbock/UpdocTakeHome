// src/services/api.ts
import axios from 'axios';
import { Request } from '../types.ts';

const API_BASE_URL = 'https://your-n8n-instance.com/webhook'; // Replace with your n8n webhook URL

export const fetchRequests = async (): Promise<Request[]> => {
  const response = await axios.get('https://n8n.rehbock.xyz/webhook-test/get-all'); // Update with your actual endpoint
  return response.data;
};

// New function to fetch pending requests
export const fetchPendingRequests = async (): Promise<Request[]> => {
  const response = await axios.get('https://n8n.rehbock.xyz/webhook/get-pending');
  return response.data;
};

export const confirmRequest = async (id: string, days: number) => {
  return axios.post(`${API_BASE_URL}/confirm-request`, { id, days });
};

export const denyRequest = async (id: string, reason: string) => {
  return axios.post(`${API_BASE_URL}/deny-request`, { id, reason });
};
