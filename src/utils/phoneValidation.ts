import { countryCodes } from "../data/countryCodes";

export const validatePhoneNumber = (
  phoneNumber: string,
  dialCode: string
): boolean => {
  // Remove all non-digit characters except the leading +
  const cleanNumber = phoneNumber.replace(/[^\d]/g, "");

  // Basic validation rules based on common patterns
  const validationRules: { [key: string]: RegExp } = {
    "+1": /^\d{10}$/, // US/Canada: 10 digits
    "+44": /^\d{10,11}$/, // UK: 10-11 digits
    "+33": /^\d{9,10}$/, // France: 9-10 digits
    "+49": /^\d{10,12}$/, // Germany: 10-12 digits
    "+81": /^\d{10,11}$/, // Japan: 10-11 digits
    "+86": /^\d{11}$/, // China: 11 digits
    "+91": /^\d{10}$/, // India: 10 digits
    "+94": /^\d{9}$/, // Sri Lanka: 9 digits
    "+61": /^\d{9}$/, // Australia: 9 digits
    "+65": /^\d{8}$/, // Singapore: 8 digits
    "+971": /^\d{8,9}$/, // UAE: 8-9 digits
    "+966": /^\d{8,9}$/, // Saudi Arabia: 8-9 digits
    "+60": /^\d{9,10}$/, // Malaysia: 9-10 digits
    "+62": /^\d{8,12}$/, // Indonesia: 8-12 digits
    "+63": /^\d{10}$/, // Philippines: 10 digits
    "+66": /^\d{8,9}$/, // Thailand: 8-9 digits
    "+84": /^\d{8,9}$/, // Vietnam: 8-9 digits
    "+92": /^\d{10}$/, // Pakistan: 10 digits
    "+880": /^\d{10}$/, // Bangladesh: 10 digits
    "+234": /^\d{10}$/, // Nigeria: 10 digits
    "+27": /^\d{9}$/, // South Africa: 9 digits
    "+20": /^\d{10}$/, // Egypt: 10 digits
    "+52": /^\d{10}$/, // Mexico: 10 digits
    "+55": /^\d{10,11}$/, // Brazil: 10-11 digits
    "+54": /^\d{10}$/, // Argentina: 10 digits
    "+7": /^\d{10}$/, // Russia/Kazakhstan: 10 digits
  };

  const rule = validationRules[dialCode];
  if (rule) {
    return rule.test(cleanNumber);
  }

  // Default validation for countries not in the list
  // Most phone numbers are between 7-15 digits (excluding country code)
  return /^\d{7,15}$/.test(cleanNumber);
};

export const formatPhoneNumber = (
  phoneNumber: string,
  dialCode: string
): string => {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, "");

  // Format based on country
  switch (dialCode) {
    case "+1": // US/Canada
      if (cleanNumber.length === 10) {
        return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(
          3,
          6
        )}-${cleanNumber.slice(6)}`;
      }
      break;
    case "+44": // UK
      if (cleanNumber.length === 10) {
        return `${cleanNumber.slice(0, 4)} ${cleanNumber.slice(
          4,
          7
        )} ${cleanNumber.slice(7)}`;
      }
      break;
    case "+94": // Sri Lanka
      if (cleanNumber.length === 9) {
        return `${cleanNumber.slice(0, 2)} ${cleanNumber.slice(
          2,
          5
        )} ${cleanNumber.slice(5)}`;
      }
      break;
    default:
      // Default formatting: add spaces every 3-4 digits
      return cleanNumber.replace(/(\d{3,4})(?=\d)/g, "$1 ");
  }

  return cleanNumber;
};

export const getCountryByDialCode = (dialCode: string) => {
  return countryCodes.find((country) => country.dialCode === dialCode);
};
