import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Validation Tests', () => {
  const agreementSchema = z.object({
    forestFileId: z.string().regex(/^RAN\d{6}$/, 'Invalid agreement ID format'),
    agreementTypeId: z.number().int().positive(),
    zoneId: z.number().int().positive(),
  });

  it('should validate a valid agreement ID', () => {
    const result = agreementSchema.safeParse({
      forestFileId: 'RAN073578',
      agreementTypeId: 1,
      zoneId: 1,
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid agreement ID', () => {
    const result = agreementSchema.safeParse({
      forestFileId: 'INVALID',
      agreementTypeId: 1,
      zoneId: 1,
    });
    expect(result.success).toBe(false);
  });

  it('should reject negative zone ID', () => {
    const result = agreementSchema.safeParse({
      forestFileId: 'RAN073578',
      agreementTypeId: 1,
      zoneId: -1,
    });
    expect(result.success).toBe(false);
  });
});

describe('String Utilities', () => {
  it('should format agreement ID correctly', () => {
    const formatAgreementId = (id: string) => {
      if (/^RAN\d{6}$/.test(id)) {
        return `RAN-${id.slice(3)}`;
      }
      return id;
    };

    expect(formatAgreementId('RAN073578')).toBe('RAN-073578');
    expect(formatAgreementId('INVALID')).toBe('INVALID');
  });

  it('should format date correctly', () => {
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    };

    const date = new Date('2026-01-01');
    expect(formatDate(date)).toBe('2026-01-01');
  });
});
