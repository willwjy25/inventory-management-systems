/**
 * Shared domain contracts.
 * Keep this package free of runtime business logic — types and constants only.
 */

/** Standard API success envelope used by apps/api and consumed by apps/web */
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

/** Standard API error envelope */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: ApiFieldError[];
}

export interface ApiFieldError {
  field?: string;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/** Application role names — must match `roles.name` in the database */
export const USER_ROLES = ['SUPER_ADMIN', 'ADMIN', 'STAFF'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const PRODUCT_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const INVENTORY_TRANSACTION_TYPES = ['IN', 'OUT', 'ADJUSTMENT'] as const;
export type InventoryTransactionType = (typeof INVENTORY_TRANSACTION_TYPES)[number];

/** Public user shape returned by auth endpoints (never includes password) */
export interface AuthUserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthLoginData {
  accessToken: string;
  user: AuthUserDto;
}
