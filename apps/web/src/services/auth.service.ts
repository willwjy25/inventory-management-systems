import type { ApiSuccessResponse, AuthLoginData, AuthUserDto } from '@ims/types';

import { apiClient } from '@/services/api-client';

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthLoginData> {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthLoginData>>(
      '/auth/login',
      payload,
    );
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async me(): Promise<AuthUserDto> {
    const { data } = await apiClient.get<ApiSuccessResponse<{ user: AuthUserDto }>>('/auth/me');
    return data.data.user;
  },

  async refresh(): Promise<AuthLoginData> {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthLoginData>>('/auth/refresh');
    return data.data;
  },
};
