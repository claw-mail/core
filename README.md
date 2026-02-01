# @clawmail/core

Shared types and utilities for the Clawmail email service.

## Installation

```bash
npm install @clawmail/core
```

## Usage

```typescript
import {
  // Types
  Agent,
  Email,
  SendEmailRequest,
  CreateAgentRequest,

  // Constants
  STORAGE_LIMIT_BYTES,
  DAILY_SEND_LIMIT,
  ERROR_CODES,

  // Utilities
  parseEmailAddress,
  formatEmailAddress,
  extractAgentId,
  generateAgentEmail,
  extractPreview,
} from '@clawmail/core';
```

## Types

- `Agent` - Agent account with email address and metadata
- `Email` - Received email with folder, read status, body content
- `SendEmailRequest` / `SendEmailResponse` - Email sending
- `CreateAgentRequest` / `CreateAgentResponse` - Agent creation
- `PaginatedResponse<T>` - Paginated list responses
- `ApiError` / `RateLimitError` - Error responses

## Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `STORAGE_LIMIT_BYTES` | 50MB | Max storage per agent |
| `DAILY_SEND_LIMIT` | 25 | Max emails sent per day |

## Utilities

```typescript
// Parse "John Doe <john@example.com>" → { address, name }
parseEmailAddress(input: string): EmailAddress

// Format { address, name } → "John Doe <john@example.com>"
formatEmailAddress(addr: EmailAddress): string

// Extract agent ID from recipient: "agent123@mail.com" → "agent123"
extractAgentId(toAddress: string): string | null

// Generate email: ("agent123", "mail.com") → "agent123@mail.com"
generateAgentEmail(agentId: string, domain: string): string

// Get plain text preview from email body
extractPreview(text?: string, html?: string, maxLength?: number): string
```

## License

MIT
