/**
 * Email parsing utilities for extracting data from raw MIME emails
 * Uses postal-mime in the Workers environment
 */
export interface ParsedEmail {
    messageId?: string;
    from: {
        address: string;
        name?: string;
    };
    to: string[];
    subject?: string;
    text?: string;
    html?: string;
}
export interface EmailAddress {
    address: string;
    name?: string;
}
/**
 * Extract the agent ID from a recipient email address
 * Expected format: {agentId}@domain.com
 */
export declare function extractAgentId(toAddress: string): string | null;
/**
 * Generate an email address for an agent
 */
export declare function generateAgentEmail(agentId: string, domain: string): string;
/**
 * Parse email addresses from various formats
 * Handles: "Name <email@example.com>", "email@example.com", etc.
 */
export declare function parseEmailAddress(input: string): EmailAddress;
/**
 * Convert EmailAddress to display string
 */
export declare function formatEmailAddress(addr: EmailAddress): string;
/**
 * Generate a unique email ID
 */
export declare function generateEmailId(): string;
/**
 * Sanitize HTML content (basic)
 * For production, use a proper HTML sanitizer
 */
export declare function sanitizeHtml(html: string): string;
/**
 * Truncate text to a maximum length
 */
export declare function truncateText(text: string, maxLength: number): string;
/**
 * Extract plain text preview from email body
 */
export declare function extractPreview(text?: string, html?: string, maxLength?: number): string;
//# sourceMappingURL=email-parser.d.ts.map