import { countryCodes } from "../data/countryCodes";

export const validatePhoneNumber = (
  phoneNumber: string,
  dialCode: string
): boolean => {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, "");

  const validationRules: { [key: string]: RegExp } = {
    // North America
    "+1": /^\d{10}$/, // US/Canada: 10 digits

    // Europe
    "+44": /^\d{10,11}$/, // UK: 10-11 digits
    "+33": /^\d{9,10}$/, // France: 9-10 digits
    "+49": /^\d{10,12}$/, // Germany: 10-12 digits
    "+39": /^\d{9,11}$/, // Italy: 9-11 digits
    "+34": /^\d{9}$/, // Spain: 9 digits
    "+31": /^\d{9}$/, // Netherlands: 9 digits
    "+32": /^\d{8,9}$/, // Belgium: 8-9 digits
    "+41": /^\d{9}$/, // Switzerland: 9 digits
    "+43": /^\d{10,11}$/, // Austria: 10-11 digits
    "+46": /^\d{8,9}$/, // Sweden: 8-9 digits
    "+47": /^\d{8}$/, // Norway: 8 digits
    "+45": /^\d{8}$/, // Denmark: 8 digits
    "+358": /^\d{9,10}$/, // Finland: 9-10 digits
    "+48": /^\d{9}$/, // Poland: 9 digits
    "+420": /^\d{9}$/, // Czech Republic: 9 digits
    "+36": /^\d{8,9}$/, // Hungary: 8-9 digits
    "+30": /^\d{10}$/, // Greece: 10 digits
    "+351": /^\d{9}$/, // Portugal: 9 digits
    "+353": /^\d{8,9}$/, // Ireland: 8-9 digits
    "+352": /^\d{6,11}$/, // Luxembourg: 6-11 digits
    "+356": /^\d{8}$/, // Malta: 8 digits
    "+357": /^\d{8}$/, // Cyprus: 8 digits
    "+371": /^\d{8}$/, // Latvia: 8 digits
    "+370": /^\d{8}$/, // Lithuania: 8 digits
    "+372": /^\d{7,8}$/, // Estonia: 7-8 digits
    "+421": /^\d{9}$/, // Slovakia: 9 digits
    "+386": /^\d{8}$/, // Slovenia: 8 digits
    "+385": /^\d{8,9}$/, // Croatia: 8-9 digits
    "+359": /^\d{8,9}$/, // Bulgaria: 8-9 digits
    "+40": /^\d{9}$/, // Romania: 9 digits
    "+90": /^\d{10}$/, // Turkey: 10 digits

    // Asia-Pacific
    "+81": /^\d{10,11}$/, // Japan: 10-11 digits
    "+82": /^\d{10,11}$/, // South Korea: 10-11 digits
    "+86": /^\d{11}$/, // China: 11 digits
    "+91": /^\d{10}$/, // India: 10 digits
    "+65": /^\d{8}$/, // Singapore: 8 digits
    "+60": /^\d{9,10}$/, // Malaysia: 9-10 digits
    "+66": /^\d{8,9}$/, // Thailand: 8-9 digits
    "+63": /^\d{10}$/, // Philippines: 10 digits
    "+62": /^\d{8,12}$/, // Indonesia: 8-12 digits
    "+84": /^\d{8,9}$/, // Vietnam: 8-9 digits
    "+94": /^\d{9}$/, // Sri Lanka: 9 digits
    "+880": /^\d{10}$/, // Bangladesh: 10 digits
    "+92": /^\d{10}$/, // Pakistan: 10 digits
    "+977": /^\d{10}$/, // Nepal: 10 digits
    "+960": /^\d{7}$/, // Maldives: 7 digits
    "+61": /^\d{9}$/, // Australia: 9 digits

    // Middle East
    "+971": /^\d{8,9}$/, // UAE: 8-9 digits
    "+966": /^\d{8,9}$/, // Saudi Arabia: 8-9 digits
    "+974": /^\d{8}$/, // Qatar: 8 digits
    "+965": /^\d{8}$/, // Kuwait: 8 digits
    "+973": /^\d{8}$/, // Bahrain: 8 digits
    "+968": /^\d{8}$/, // Oman: 8 digits
    "+962": /^\d{8,9}$/, // Jordan: 8-9 digits
    "+961": /^\d{7,8}$/, // Lebanon: 7-8 digits
    "+972": /^\d{8,9}$/, // Israel: 8-9 digits

    // Africa
    "+20": /^\d{10}$/, // Egypt: 10 digits
    "+27": /^\d{9}$/, // South Africa: 9 digits
    "+234": /^\d{10}$/, // Nigeria: 10 digits
    "+254": /^\d{9}$/, // Kenya: 9 digits
    "+233": /^\d{9}$/, // Ghana: 9 digits
    "+256": /^\d{9}$/, // Uganda: 9 digits
    "+255": /^\d{9}$/, // Tanzania: 9 digits
    "+250": /^\d{9}$/, // Rwanda: 9 digits
    "+251": /^\d{9}$/, // Ethiopia: 9 digits

    // Americas
    "+52": /^\d{10}$/, // Mexico: 10 digits
    "+55": /^\d{10,11}$/, // Brazil: 10-11 digits
    "+54": /^\d{10}$/, // Argentina: 10 digits
    "+56": /^\d{8,9}$/, // Chile: 8-9 digits
    "+57": /^\d{10}$/, // Colombia: 10 digits
    "+51": /^\d{9}$/, // Peru: 9 digits
    "+58": /^\d{10}$/, // Venezuela: 10 digits
    "+598": /^\d{8}$/, // Uruguay: 8 digits
    "+595": /^\d{8,9}$/, // Paraguay: 8-9 digits
    "+591": /^\d{8}$/, // Bolivia: 8 digits
    "+593": /^\d{8,9}$/, // Ecuador: 8-9 digits
    "+592": /^\d{7}$/, // Guyana: 7 digits
    "+597": /^\d{6,7}$/, // Suriname: 6-7 digits
    "+500": /^\d{5}$/, // Falkland Islands: 5 digits

    // CIS Countries
    "+7": /^\d{10}$/, // Russia/Kazakhstan: 10 digits
    "+998": /^\d{9}$/, // Uzbekistan: 9 digits
    "+996": /^\d{9}$/, // Kyrgyzstan: 9 digits
    "+992": /^\d{9}$/, // Tajikistan: 9 digits
    "+993": /^\d{8}$/, // Turkmenistan: 8 digits
    "+93": /^\d{9}$/, // Afghanistan: 9 digits
    "+374": /^\d{8}$/, // Armenia: 8 digits
    "+994": /^\d{8,9}$/, // Azerbaijan: 8-9 digits
    "+995": /^\d{9}$/, // Georgia: 9 digits
    "+373": /^\d{8}$/, // Moldova: 8 digits
    "+380": /^\d{9}$/, // Ukraine: 9 digits
    "+375": /^\d{9}$/, // Belarus: 9 digits
  };

  const rule = validationRules[dialCode];
  if (rule) {
    return rule.test(cleanNumber);
  }

  // Enhanced fallback validation for countries not explicitly listed
  // Most mobile numbers worldwide are between 7-15 digits (excluding country code)
  // This covers edge cases and new countries
  if (cleanNumber.length < 6 || cleanNumber.length > 15) {
    return false;
  }

  // Additional checks for common patterns
  // Reject numbers that are all the same digit (like 1111111111)
  if (/^(\d)\1+$/.test(cleanNumber)) {
    return false;
  }

  // Reject numbers that are sequential (like 1234567890)
  const isSequential = cleanNumber
    .split("")
    .every(
      (digit, index) =>
        index === 0 ||
        Number.parseInt(digit) === Number.parseInt(cleanNumber[index - 1]) + 1
    );
  if (isSequential) {
    return false;
  }

  // Default validation: 7-15 digits
  return /^\d{7,15}$/.test(cleanNumber);
};

export const formatPhoneNumber = (
  phoneNumber: string,
  dialCode: string
): string => {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, "");

  // Enhanced formatting for more countries
  const formatters: { [key: string]: (num: string) => string } = {
    "+1": (num) => {
      // US/Canada: (123) 456-7890
      if (num.length === 10) {
        return `(${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6)}`;
      }
      return num;
    },
    "+44": (num) => {
      // UK: 020 1234 5678 or 07123 456789
      if (num.length === 10) {
        return `${num.slice(0, 3)} ${num.slice(3, 7)} ${num.slice(7)}`;
      }
      if (num.length === 11) {
        return `${num.slice(0, 5)} ${num.slice(5, 8)} ${num.slice(8)}`;
      }
      return num;
    },
    "+33": (num) => {
      // France: 01 23 45 67 89
      if (num.length >= 9) {
        return num.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
      }
      return num;
    },
    "+49": (num) => {
      // Germany: 030 12345678
      if (num.length >= 10) {
        return `${num.slice(0, 3)} ${num.slice(3)}`;
      }
      return num;
    },
    "+81": (num) => {
      // Japan: 090-1234-5678
      if (num.length === 10) {
        return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
      }
      if (num.length === 11) {
        return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
      }
      return num;
    },
    "+86": (num) => {
      // China: 138 0013 8000
      if (num.length === 11) {
        return `${num.slice(0, 3)} ${num.slice(3, 7)} ${num.slice(7)}`;
      }
      return num;
    },
    "+91": (num) => {
      // India: 98765 43210
      if (num.length === 10) {
        return `${num.slice(0, 5)} ${num.slice(5)}`;
      }
      return num;
    },
    "+94": (num) => {
      // Sri Lanka: 77 123 4567
      if (num.length === 9) {
        return `${num.slice(0, 2)} ${num.slice(2, 5)} ${num.slice(5)}`;
      }
      return num;
    },
    "+61": (num) => {
      // Australia: 0412 345 678
      if (num.length === 9) {
        return `${num.slice(0, 4)} ${num.slice(4, 7)} ${num.slice(7)}`;
      }
      return num;
    },
    "+65": (num) => {
      // Singapore: 9123 4567
      if (num.length === 8) {
        return `${num.slice(0, 4)} ${num.slice(4)}`;
      }
      return num;
    },
    "+971": (num) => {
      // UAE: 050 123 4567
      if (num.length >= 8) {
        return `${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6)}`;
      }
      return num;
    },
    "+966": (num) => {
      // Saudi Arabia: 050 123 4567
      if (num.length >= 8) {
        return `${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6)}`;
      }
      return num;
    },
  };

  const formatter = formatters[dialCode];
  if (formatter) {
    return formatter(cleanNumber);
  }

  // Default formatting: add spaces every 3-4 digits
  if (cleanNumber.length <= 4) return cleanNumber;
  if (cleanNumber.length <= 7)
    return cleanNumber.replace(/(\d{3})(\d+)/, "$1 $2");
  if (cleanNumber.length <= 10)
    return cleanNumber.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3");
  return cleanNumber.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1 $2 $3 $4");
};

export const getCountryByDialCode = (dialCode: string) => {
  return countryCodes.find((country) => country.dialCode === dialCode);
};

// Helper function to get validation info for a country
export const getValidationInfo = (
  dialCode: string
): { minLength: number; maxLength: number; example: string } => {
  const validationExamples: {
    [key: string]: { minLength: number; maxLength: number; example: string };
  } = {
    "+1": { minLength: 10, maxLength: 10, example: "(555) 123-4567" },
    "+44": { minLength: 10, maxLength: 11, example: "020 1234 5678" },
    "+33": { minLength: 9, maxLength: 10, example: "01 23 45 67 89" },
    "+49": { minLength: 10, maxLength: 12, example: "030 12345678" },
    "+81": { minLength: 10, maxLength: 11, example: "090-1234-5678" },
    "+86": { minLength: 11, maxLength: 11, example: "138 0013 8000" },
    "+91": { minLength: 10, maxLength: 10, example: "98765 43210" },
    "+94": { minLength: 9, maxLength: 9, example: "77 123 4567" },
    "+61": { minLength: 9, maxLength: 9, example: "0412 345 678" },
    "+65": { minLength: 8, maxLength: 8, example: "9123 4567" },
    "+971": { minLength: 8, maxLength: 9, example: "050 123 4567" },
    "+966": { minLength: 8, maxLength: 9, example: "050 123 4567" },
  };

  return (
    validationExamples[dialCode] || {
      minLength: 7,
      maxLength: 15,
      example: "Enter valid phone number",
    }
  );
};
