import { api } from './axios';
import type { Property } from '../types/property.types';

export interface CreatePropertyPayload {
  name: string;
  address: string;
  units: number;
  managerId: string;
}

export const getProperties = async (): Promise<Property[]> => {
  const res = await api.get<Property[]>('/properties');
  return res.data;
};

export const getPropertyById = async (id: string): Promise<Property> => {
  const res = await api.get<Property>(`/properties/${id}`);
  return res.data;
};

export const createProperty = async (payload: CreatePropertyPayload): Promise<Property> => {
  const res = await api.post<Property>('/properties', payload);
  return res.data;
};

