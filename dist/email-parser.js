/**
 * Email parsing utilities for extracting data from raw MIME emails
 * Uses postal-mime in the Workers environment
 */
/**
 * Extract the agent ID from a recipient email address
 * Expected format: {agentId}@domain.com
 */
export function extractAgentId(toAddress) {
    const match = toAddress.match(/^([^@]+)@/);
    return match?.[1] ?? null;
}
/**
 * Generate an email address for an agent
 */
export function generateAgentEmail(agentId, domain) {
    return `${agentId}@${domain}`;
}
/**
 * Parse email addresses from various formats
 * Handles: "Name <email@example.com>", "email@example.com", etc.
 */
export function parseEmailAddress(input) {
    // Try to match "Name <email@example.com>" format
    const namedMatch = input.match(/^([^<]*)<([^>]+)>$/);
    if (namedMatch) {
        const name = namedMatch[1]?.trim();
        const address = namedMatch[2]?.trim() ?? '';
        return { address, name: name || undefined };
    }
    // Plain email address
    return { address: input.trim() };
}
/**
 * Convert EmailAddress to display string
 */
export function formatEmailAddress(addr) {
    if (addr.name) {
        return `${addr.name} <${addr.address}>`;
    }
    return addr.address;
}
/**
 * Generate a unique email ID
 */
export function generateEmailId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${random}`;
}
/**
 * Sanitize HTML content (basic)
 * For production, use a proper HTML sanitizer
 */
export function sanitizeHtml(html) {
    // Remove script tags and event handlers
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/\s*on\w+\s*=\s*(['"])[^'"]*\1/gi, '');
}
/**
 * Truncate text to a maximum length
 */
export function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - 3) + '...';
}
/**
 * Extract plain text preview from email body
 */
export function extractPreview(text, html, maxLength = 150) {
    if (text) {
        return truncateText(text.replace(/\s+/g, ' ').trim(), maxLength);
    }
    if (html) {
        // Strip HTML tags for preview
        const stripped = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        return truncateText(stripped, maxLength);
    }
    return '';
}
//# sourceMappingURL=email-parser.js.map