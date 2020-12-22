declare global {
  interface String {
    isLowerCase(): boolean;
    isUpperCase(): boolean;
    isNumber(): boolean;
    toCamelCase(): string;
  }

  type AllianceColor = 'WHITE' | 'BLACK';
}

export{}