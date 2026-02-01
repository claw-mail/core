// ===========================================
// Limits & Constants
// ===========================================

/**
 * Storage limit per agent in bytes (50MB)
 * ~2,500-10,000 emails depending on content
 */
export const STORAGE_LIMIT_BYTES = 50 * 1024 * 1024; // 50MB

/**
 * Maximum emails an agent can send per day
 */
export const DAILY_SEND_LIMIT = 25;

/**
 * Human-readable storage limit for error messages
 */
export const STORAGE_LIMIT_DISPLAY = '50MB';

// ===========================================
// Agent types
// ===========================================

export interface Agent {
  id: string;
  name: string;
  email: string; // Generated: {id}@domain.com
  createdAt: number;
  metadata?: Record<string, unknown>;
  storageUsed?: number; // Bytes of storage used
  verified: boolean;
  verifiedAt?: number;
}

// Response when creating a new agent (only time API key is returned)
export interface CreateAgentResponse {
  agent: Agent;
  apiKey: string; // Store this securely - cannot be retrieved again!
  instruction: string; // Instructions for verification
}

// Request to create a new agent
export interface CreateAgentRequest {
  id: string;
  name: string;
  metadata?: Record<string, unknown>;
}

// Email types
export interface Email {
  id: string;
  agentId: string;
  messageId?: string;
  from: { address: string; name?: string };
  to: string;
  subject?: string;
  bodyText?: string;
  bodyHtml?: string;
  folder: 'inbox' | 'archive' | 'trash' | string;
  isRead: boolean;
  receivedAt: number;
}

// Request to send an email
export interface SendEmailRequest {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

// Response from sending an email
export interface SendEmailResponse {
  id: string;
  to: string | string[];
  subject: string;
  sentAt: number;
}

// Request to update an email
export interface UpdateEmailRequest {
  folder?: string;
  isRead?: boolean;
}

// Database row types (matching D1 schema)
export interface AgentRow {
  id: string;
  name: string;
  api_key_hash: string;
  created_at: number;
  metadata: string | null;
  storage_used: number;
  verified: number;
  verification_code: string | null;
  verification_code_expires_at: number | null;
  twitter_user_id: string | null;
  verified_at: number | null;
}

export interface EmailRow {
  id: string;
  agent_id: string;
  message_id: string | null;
  from_address: string;
  from_name: string | null;
  to_address: string;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  raw_email: string | null;
  folder: string;
  is_read: number;
  received_at: number;
}

export interface SentEmailRow {
  id: string;
  agent_id: string;
  to_address: string;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  sent_at: number;
  resend_id: string | null;
}

// Pagination
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

// API Error response
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// Rate limit error codes
export const ERROR_CODES = {
  STORAGE_LIMIT_EXCEEDED: 'STORAGE_LIMIT_EXCEEDED',
  DAILY_SEND_LIMIT_EXCEEDED: 'DAILY_SEND_LIMIT_EXCEEDED',
  NOT_VERIFIED: 'NOT_VERIFIED',
  VERIFICATION_EXPIRED: 'VERIFICATION_EXPIRED',
  TWITTER_ALREADY_USED: 'TWITTER_ALREADY_USED',
  INVALID_TWEET: 'INVALID_TWEET',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// ===========================================
// Verification types
// ===========================================

export interface VerificationStartResponse {
  verificationCode: string;
  expiresAt: number;
  tweetText: string;
  twitterIntentUrl: string;
}

export interface VerificationCompleteRequest {
  tweetUrl: string;
}

export interface VerificationCompleteResponse {
  success: boolean;
  verifiedAt: number;
  twitterUsername: string;
}

export interface VerificationStatusResponse {
  verified: boolean;
  verifiedAt?: number;
  hasActiveCode: boolean;
  codeExpiresAt?: number;
}

// Rate limit error response with additional info
export interface RateLimitError extends ApiError {
  code: ErrorCode;
  limit: number;
  current: number;
  resetAt?: number; // Timestamp when limit resets (for daily limits)
}

// Environment bindings for Cloudflare Workers
export interface Env {
  DB: D1Database;
  RESEND_API_KEY?: string;
  DOMAIN?: string;
}

// D1Database type for Cloudflare
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown[]>(): Promise<T[]>;
}

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: {
    duration: number;
    changes: number;
    last_row_id: number;
    rows_read: number;
    rows_written: number;
  };
}

export interface D1ExecResult {
  count: number;
  duration: number;
}
