/**
 * Shared domain contracts.
 * Domain-specific types (User, Product, etc.) will be added in later features.
 * Keep this package free of runtime business logic.
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

/** Application roles — aligned with RBAC requirements */
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
