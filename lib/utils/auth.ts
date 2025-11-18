/**
 * Format CNIC with dashes
 */
export function formatCNIC(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 5) {
    return cleaned;
  } else if (cleaned.length <= 12) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  } else {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`;
  }
}

/**
 * Validate CNIC format
 */
export function isValidCNIC(cnic: string): boolean {
  const cleaned = cnic.replace(/\D/g, '');
  return cleaned.length === 13;
}

/**
 * Format Pakistani phone number
 */
export function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.startsWith('92')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return cleaned;
  } else if (cleaned.startsWith('3')) {
    return `0${cleaned}`;
  }
  
  return cleaned;
}

/**
 * Validate Pakistani phone number
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  
  // Check for +923XXXXXXXXX or 03XXXXXXXXX format
  if (cleaned.startsWith('92') && cleaned.length === 12) {
    return cleaned[2] === '3';
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    return cleaned[1] === '3';
  }
  
  return false;
}
