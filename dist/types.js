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
// Rate limit error codes
export const ERROR_CODES = {
    STORAGE_LIMIT_EXCEEDED: 'STORAGE_LIMIT_EXCEEDED',
    DAILY_SEND_LIMIT_EXCEEDED: 'DAILY_SEND_LIMIT_EXCEEDED',
    NOT_VERIFIED: 'NOT_VERIFIED',
    VERIFICATION_EXPIRED: 'VERIFICATION_EXPIRED',
    TWITTER_ALREADY_USED: 'TWITTER_ALREADY_USED',
    INVALID_TWEET: 'INVALID_TWEET',
};
//# sourceMappingURL=types.js.map