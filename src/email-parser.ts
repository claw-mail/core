/**
 * Email parsing utilities for extracting data from raw MIME emails
 * Uses postal-mime in the Workers environment
 */

export interface ParsedEmail {
  messageId?: string;
  from: { address: string; name?: string };
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
export function extractAgentId(toAddress: string): string | null {
  const match = toAddress.match(/^([^@]+)@/);
  return match?.[1] ?? null;
}

/**
 * Generate an email address for an agent
 */
export function generateAgentEmail(agentId: string, domain: string): string {
  return `${agentId}@${domain}`;
}

/**
 * Parse email addresses from various formats
 * Handles: "Name <email@example.com>", "email@example.com", etc.
 */
export function parseEmailAddress(input: string): EmailAddress {
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
export function formatEmailAddress(addr: EmailAddress): string {
  if (addr.name) {
    return `${addr.name} <${addr.address}>`;
  }
  return addr.address;
}

/**
 * Generate a unique email ID
 */
export function generateEmailId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}`;
}

/**
 * Sanitize HTML content (basic)
 * For production, use a proper HTML sanitizer
 */
export function sanitizeHtml(html: string): string {
  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s*on\w+\s*=\s*(['"])[^'"]*\1/gi, '');
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Extract plain text preview from email body
 */
export function extractPreview(text?: string, html?: string, maxLength = 150): string {
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
