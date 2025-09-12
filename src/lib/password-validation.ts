export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0-4 (weak to very strong)
  errors: string[];
  warnings: string[];
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  specialChars: string;
}

export const defaultPasswordRequirements: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

export function validatePassword(
  password: string,
  requirements: PasswordRequirements = defaultPasswordRequirements
): PasswordValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 0;

  // Length check
  if (password.length < requirements.minLength) {
    errors.push(`Password must be at least ${requirements.minLength} characters long`);
  } else {
    score += 1;
  }

  // Uppercase check
  if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (requirements.requireUppercase) {
    score += 1;
  }

  // Lowercase check
  if (requirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (requirements.requireLowercase) {
    score += 1;
  }

  // Numbers check
  if (requirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (requirements.requireNumbers) {
    score += 1;
  }

  // Special characters check
  if (requirements.requireSpecialChars) {
    // Use a simpler approach - check if password contains any of the special characters
    const hasSpecialChar = requirements.specialChars.split('').some(char => password.includes(char));
    if (!hasSpecialChar) {
      errors.push(`Password must contain at least one special character (${requirements.specialChars})`);
    } else {
      score += 1;
    }
  }

  // Additional strength checks
  if (password.length >= 12) {
    score += 0.5;
  }
  if (password.length >= 16) {
    score += 0.5;
  }
  if (/(.)\1{2,}/.test(password)) {
    warnings.push('Avoid repeating characters');
    score -= 0.5;
  }
  if (/123|abc|qwe|asd|zxc/i.test(password)) {
    warnings.push('Avoid common patterns');
    score -= 0.5;
  }

  // Determine strength
  let strength: PasswordValidationResult['strength'];
  if (score < 2) {
    strength = 'very-weak';
  } else if (score < 3) {
    strength = 'weak';
  } else if (score < 4) {
    strength = 'fair';
  } else if (score < 5) {
    strength = 'good';
  } else {
    strength = 'strong';
  }

  return {
    isValid: errors.length === 0,
    score: Math.max(0, Math.min(5, score)),
    errors,
    warnings,
    strength
  };
}

export function getPasswordStrengthColor(strength: PasswordValidationResult['strength']): string {
  switch (strength) {
    case 'very-weak':
      return 'bg-red-500';
    case 'weak':
      return 'bg-orange-500';
    case 'fair':
      return 'bg-yellow-500';
    case 'good':
      return 'bg-blue-500';
    case 'strong':
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
}

export function getPasswordStrengthText(strength: PasswordValidationResult['strength']): string {
  switch (strength) {
    case 'very-weak':
      return 'Very Weak';
    case 'weak':
      return 'Weak';
    case 'fair':
      return 'Fair';
    case 'good':
      return 'Good';
    case 'strong':
      return 'Strong';
    default:
      return 'Unknown';
  }
}
