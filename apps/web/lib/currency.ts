/**
 * Currency utilities - FROZEN TO AMD ONLY
 * 
 * IMPORTANT: All prices in the database MUST be stored in AMD.
 * No currency conversion is performed - prices are displayed as-is.
 * 
 * This ensures consistency between:
 * - Product prices (stored in AMD)
 * - Cart totals (calculated in AMD)
 * - Order totals (stored in AMD)
 * - Payment amounts (sent to payment gateway in AMD)
 */
export const CURRENCIES = {
  AMD: { code: 'AMD', symbol: '֏', name: 'Armenian Dram', rate: 1 }, // Base currency, no conversion
} as const;

export type CurrencyCode = 'AMD'; // Only AMD is supported

const CURRENCY_STORAGE_KEY = 'shop_currency';

// Always return AMD - currency is frozen to AMD only
export function getStoredCurrency(): CurrencyCode {
  // Force AMD everywhere - no other currencies supported
  return 'AMD';
}

// Currency is frozen to AMD - no conversion needed
export function setStoredCurrency(currency: CurrencyCode): void {
  // Currency is frozen to AMD - do nothing
  // This function is kept for compatibility but doesn't change currency
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, 'AMD');
    window.dispatchEvent(new Event('currency-updated'));
  } catch (error) {
    console.error('Failed to save currency:', error);
  }
}

// Format price in AMD - prices are already in AMD, no conversion needed
export function formatPrice(price: number, currency: CurrencyCode = 'AMD'): string {
  // Prices are stored in AMD, so no conversion needed
  const currencyInfo = CURRENCIES.AMD;
  
  // Show AMD without decimals (remove .00)
  const minimumFractionDigits = 0;
  const maximumFractionDigits = 0;
  
  return new Intl.NumberFormat('hy-AM', {
    style: 'currency',
    currency: 'AMD',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(price);
}

// No conversion needed - all prices are in AMD
export function convertPrice(price: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode): number {
  // All prices are in AMD - no conversion needed
  return price;
}


