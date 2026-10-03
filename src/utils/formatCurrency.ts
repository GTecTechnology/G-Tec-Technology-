/**
 * Utility functions for Ethiopian Birr (ETB) currency formatting
 */

export function formatETB(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'ETB 0';
  }
  return `ETB ${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatETBWithDecimals(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'ETB 0.00';
  }
  return `ETB ${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
