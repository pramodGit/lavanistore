// frontend/src/utils/ApiError.ts

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public field?: string        // for validation errors e.g. "Email taken"
  ) {
    super(message);
    this.name = "ApiError";
  }
}