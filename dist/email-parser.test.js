import { describe, it, expect } from 'vitest';
import { extractAgentId, generateAgentEmail, parseEmailAddress, formatEmailAddress, generateEmailId, sanitizeHtml, truncateText, extractPreview, } from './email-parser.js';
describe('extractAgentId', () => {
    it('should extract agent ID from simple email address', () => {
        expect(extractAgentId('agent1@example.com')).toBe('agent1');
    });
    it('should extract agent ID with dashes and underscores', () => {
        expect(extractAgentId('my-agent_123@example.com')).toBe('my-agent_123');
    });
    it('should extract agent ID from subdomain email', () => {
        expect(extractAgentId('agent@mail.example.com')).toBe('agent');
    });
    it('should return null for invalid email without @', () => {
        expect(extractAgentId('invalid-email')).toBeNull();
    });
    it('should return null for email with empty local part', () => {
        expect(extractAgentId('@example.com')).toBeNull();
    });
    it('should handle complex local part with dots', () => {
        expect(extractAgentId('agent.name.test@example.com')).toBe('agent.name.test');
    });
    it('should handle email with plus addressing', () => {
        expect(extractAgentId('agent+tag@example.com')).toBe('agent+tag');
    });
});
describe('generateAgentEmail', () => {
    it('should generate email address from agent ID and domain', () => {
        expect(generateAgentEmail('agent1', 'example.com')).toBe('agent1@example.com');
    });
    it('should handle agent ID with special characters', () => {
        expect(generateAgentEmail('my-agent_123', 'mail.example.com')).toBe('my-agent_123@mail.example.com');
    });
    it('should handle empty agent ID', () => {
        expect(generateAgentEmail('', 'example.com')).toBe('@example.com');
    });
});
describe('parseEmailAddress', () => {
    it('should parse plain email address', () => {
        const result = parseEmailAddress('test@example.com');
        expect(result).toEqual({ address: 'test@example.com' });
    });
    it('should parse email with display name', () => {
        const result = parseEmailAddress('John Doe <john@example.com>');
        expect(result).toEqual({ address: 'john@example.com', name: 'John Doe' });
    });
    it('should handle email with name but empty name part', () => {
        const result = parseEmailAddress('<test@example.com>');
        expect(result).toEqual({ address: 'test@example.com', name: undefined });
    });
    it('should trim whitespace from address', () => {
        const result = parseEmailAddress('  test@example.com  ');
        expect(result).toEqual({ address: 'test@example.com' });
    });
    it('should trim whitespace from name and address', () => {
        const result = parseEmailAddress('  John Doe  <  john@example.com  >');
        expect(result).toEqual({ address: 'john@example.com', name: 'John Doe' });
    });
    it('should handle name with special characters', () => {
        const result = parseEmailAddress("O'Brien, John <john@example.com>");
        expect(result).toEqual({ address: 'john@example.com', name: "O'Brien, John" });
    });
});
describe('formatEmailAddress', () => {
    it('should format address without name', () => {
        expect(formatEmailAddress({ address: 'test@example.com' })).toBe('test@example.com');
    });
    it('should format address with name', () => {
        expect(formatEmailAddress({ address: 'test@example.com', name: 'John Doe' })).toBe('John Doe <test@example.com>');
    });
    it('should handle undefined name', () => {
        expect(formatEmailAddress({ address: 'test@example.com', name: undefined })).toBe('test@example.com');
    });
    it('should handle empty string name', () => {
        expect(formatEmailAddress({ address: 'test@example.com', name: '' })).toBe('test@example.com');
    });
});
describe('generateEmailId', () => {
    it('should generate a non-empty string', () => {
        const id = generateEmailId();
        expect(id).toBeTruthy();
        expect(typeof id).toBe('string');
    });
    it('should generate unique IDs', () => {
        const ids = new Set();
        for (let i = 0; i < 1000; i++) {
            ids.add(generateEmailId());
        }
        expect(ids.size).toBe(1000);
    });
    it('should contain a hyphen separator', () => {
        const id = generateEmailId();
        expect(id).toContain('-');
    });
    it('should have reasonable length', () => {
        const id = generateEmailId();
        expect(id.length).toBeGreaterThan(10);
        expect(id.length).toBeLessThan(30);
    });
});
describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
        const html = '<p>Hello</p><script>alert("xss")</script><p>World</p>';
        expect(sanitizeHtml(html)).toBe('<p>Hello</p><p>World</p>');
    });
    it('should remove script tags with attributes', () => {
        const html = '<script type="text/javascript">evil()</script>';
        expect(sanitizeHtml(html)).toBe('');
    });
    it('should remove multiline script tags', () => {
        const html = `<script>
      function evil() {
        document.cookie = "stolen";
      }
    </script>`;
        expect(sanitizeHtml(html)).toBe('');
    });
    it('should remove onclick handlers', () => {
        const html = '<button onclick="evil()">Click</button>';
        expect(sanitizeHtml(html)).toBe('<button>Click</button>');
    });
    it('should remove onerror handlers', () => {
        const html = '<img src="x" onerror="evil()">';
        expect(sanitizeHtml(html)).toBe('<img src="x">');
    });
    it('should remove onload handlers with double quotes', () => {
        const html = '<body onload="evil()">';
        expect(sanitizeHtml(html)).toBe('<body>');
    });
    it('should remove onload handlers with single quotes', () => {
        const html = "<body onload='evil()'>";
        expect(sanitizeHtml(html)).toBe('<body>');
    });
    it('should preserve safe HTML', () => {
        const html = '<p class="text">Hello <strong>World</strong></p>';
        expect(sanitizeHtml(html)).toBe('<p class="text">Hello <strong>World</strong></p>');
    });
    it('should handle multiple event handlers', () => {
        const html = '<div onclick="a()" onmouseover="b()" onload="c()">Test</div>';
        expect(sanitizeHtml(html)).toBe('<div>Test</div>');
    });
});
describe('truncateText', () => {
    it('should not truncate short text', () => {
        expect(truncateText('Hello', 10)).toBe('Hello');
    });
    it('should truncate long text with ellipsis', () => {
        expect(truncateText('Hello World', 8)).toBe('Hello...');
    });
    it('should handle exact length', () => {
        expect(truncateText('Hello', 5)).toBe('Hello');
    });
    it('should handle length equal to ellipsis size', () => {
        expect(truncateText('Hello', 3)).toBe('...');
    });
    it('should handle empty string', () => {
        expect(truncateText('', 10)).toBe('');
    });
    it('should handle very long text', () => {
        const longText = 'a'.repeat(1000);
        const result = truncateText(longText, 100);
        expect(result.length).toBe(100);
        expect(result.endsWith('...')).toBe(true);
    });
});
describe('extractPreview', () => {
    it('should extract preview from text', () => {
        const text = 'This is a test email body with some content.';
        expect(extractPreview(text)).toBe(text);
    });
    it('should extract preview from HTML when text is not provided', () => {
        const html = '<p>This is <strong>HTML</strong> content.</p>';
        expect(extractPreview(undefined, html)).toBe('This is HTML content.');
    });
    it('should prefer text over HTML', () => {
        const text = 'Plain text version';
        const html = '<p>HTML version</p>';
        expect(extractPreview(text, html)).toBe('Plain text version');
    });
    it('should truncate long text', () => {
        const text = 'a'.repeat(200);
        const result = extractPreview(text, undefined, 150);
        expect(result.length).toBe(150);
        expect(result.endsWith('...')).toBe(true);
    });
    it('should normalize whitespace in text', () => {
        const text = 'Hello\n\n  World   Test';
        expect(extractPreview(text)).toBe('Hello World Test');
    });
    it('should strip HTML tags for preview', () => {
        const html = '<div><p>Hello</p><br><span>World</span></div>';
        expect(extractPreview(undefined, html)).toBe('Hello World');
    });
    it('should return empty string when both are undefined', () => {
        expect(extractPreview()).toBe('');
    });
    it('should return empty string when both are empty', () => {
        expect(extractPreview('', '')).toBe('');
    });
    it('should handle custom max length', () => {
        const text = 'This is a test message.';
        expect(extractPreview(text, undefined, 10)).toBe('This is...');
    });
});
//# sourceMappingURL=email-parser.test.js.map