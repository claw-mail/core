/**
 * Storage limit per agent in bytes (50MB)
 * ~2,500-10,000 emails depending on content
 */
export declare const STORAGE_LIMIT_BYTES: number;
/**
 * Maximum emails an agent can send per day
 */
export declare const DAILY_SEND_LIMIT = 25;
/**
 * Human-readable storage limit for error messages
 */
export declare const STORAGE_LIMIT_DISPLAY = "50MB";
export interface Agent {
    id: string;
    name: string;
    email: string;
    createdAt: number;
    metadata?: Record<string, unknown>;
    storageUsed?: number;
    verified: boolean;
    verifiedAt?: number;
}
export interface CreateAgentResponse {
    agent: Agent;
    apiKey: string;
    instruction: string;
}
export interface CreateAgentRequest {
    id: string;
    name: string;
    metadata?: Record<string, unknown>;
}
export interface Email {
    id: string;
    agentId: string;
    messageId?: string;
    from: {
        address: string;
        name?: string;
    };
    to: string;
    subject?: string;
    bodyText?: string;
    bodyHtml?: string;
    folder: 'inbox' | 'archive' | 'trash' | string;
    isRead: boolean;
    receivedAt: number;
}
export interface SendEmailRequest {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
}
export interface SendEmailResponse {
    id: string;
    to: string | string[];
    subject: string;
    sentAt: number;
}
export interface UpdateEmailRequest {
    folder?: string;
    isRead?: boolean;
}
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
export interface ApiError {
    error: string;
    message: string;
    statusCode: number;
}
export declare const ERROR_CODES: {
    readonly STORAGE_LIMIT_EXCEEDED: "STORAGE_LIMIT_EXCEEDED";
    readonly DAILY_SEND_LIMIT_EXCEEDED: "DAILY_SEND_LIMIT_EXCEEDED";
    readonly NOT_VERIFIED: "NOT_VERIFIED";
    readonly VERIFICATION_EXPIRED: "VERIFICATION_EXPIRED";
    readonly TWITTER_ALREADY_USED: "TWITTER_ALREADY_USED";
    readonly INVALID_TWEET: "INVALID_TWEET";
};
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
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
export interface RateLimitError extends ApiError {
    code: ErrorCode;
    limit: number;
    current: number;
    resetAt?: number;
}
export interface Env {
    DB: D1Database;
    RESEND_API_KEY?: string;
    DOMAIN?: string;
}
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
//# sourceMappingURL=types.d.ts.map