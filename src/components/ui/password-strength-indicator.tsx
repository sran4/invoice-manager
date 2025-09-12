'use client';

import { PasswordValidationResult, getPasswordStrengthColor, getPasswordStrengthText } from '@/lib/password-validation';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  validation: PasswordValidationResult;
  showDetails?: boolean;
}

export function PasswordStrengthIndicator({ validation, showDetails = true }: PasswordStrengthIndicatorProps) {
  const { isValid, errors, warnings, strength } = validation;
  const strengthColor = getPasswordStrengthColor(strength);
  const strengthText = getPasswordStrengthText(strength);

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Password Strength:</span>
          <span className={`font-medium ${
            strength === 'very-weak' || strength === 'weak' ? 'text-red-600' :
            strength === 'fair' ? 'text-yellow-600' :
            strength === 'good' ? 'text-blue-600' :
            'text-green-600'
          }`}>
            {strengthText}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${strengthColor}`}
            style={{ width: `${(validation.score / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      {showDetails && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Requirements:</div>
          <div className="space-y-1">
            {/* Length */}
            <div className="flex items-center space-x-2 text-sm">
              {validation.errors.some(e => e.includes('characters long')) ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className={validation.errors.some(e => e.includes('characters long')) ? 'text-red-600' : 'text-green-600'}>
                At least 8 characters
              </span>
            </div>

            {/* Uppercase */}
            <div className="flex items-center space-x-2 text-sm">
              {validation.errors.some(e => e.includes('uppercase')) ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className={validation.errors.some(e => e.includes('uppercase')) ? 'text-red-600' : 'text-green-600'}>
                One uppercase letter (A-Z)
              </span>
            </div>

            {/* Lowercase */}
            <div className="flex items-center space-x-2 text-sm">
              {validation.errors.some(e => e.includes('lowercase')) ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className={validation.errors.some(e => e.includes('lowercase')) ? 'text-red-600' : 'text-green-600'}>
                One lowercase letter (a-z)
              </span>
            </div>

            {/* Numbers */}
            <div className="flex items-center space-x-2 text-sm">
              {validation.errors.some(e => e.includes('number')) ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className={validation.errors.some(e => e.includes('number')) ? 'text-red-600' : 'text-green-600'}>
                One number (0-9)
              </span>
            </div>

            {/* Special Characters */}
            <div className="flex items-center space-x-2 text-sm">
              {validation.errors.some(e => e.includes('special character')) ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className={validation.errors.some(e => e.includes('special character')) ? 'text-red-600' : 'text-green-600'}>
                One special character (!@#$%^&*)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-1">
          {warnings.map((warning, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-red-600">
              <XCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
