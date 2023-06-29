import { TCheckoutInputReturn } from "../@types/TCheckoutInputReturn";
import validator from "validator";

export const checkoutInputChecks: {
  [key: string]: (input: string, input2?: string) => TCheckoutInputReturn;
} = {
  "Mobile number": (mobileNumber: string): TCheckoutInputReturn => {
    if (!validator.isMobilePhone(mobileNumber)) return { valid: false, "message": "Invalid mobile number" };
    return { valid: mobileNumber.length > 0 };
  },
  "Delivery instructions": (instruction: string): TCheckoutInputReturn => {
    return { valid: true };
  },
  "Address line 1": (address: string): TCheckoutInputReturn => {
    if (address.length === 0) return { valid: false, "message": "Must not be empty" }
    return { valid: true };
  },
  "Address line 2": (address: string): TCheckoutInputReturn => {
    return { valid: true };
  },
  "Town/City": (city: string): TCheckoutInputReturn => {
    if (city.length === 0) return { valid: false, "message": "Must not be empty" }
    return { valid: true };
  },
  "Postcode": (postcode: string): TCheckoutInputReturn => {
    if (!validator.isPostalCode(postcode, "GB")) return { valid: false, "message": "Invalid postcode" };
    return { valid: true };
  },
  "First name": (firstName: string): TCheckoutInputReturn => {
    if (firstName.length === 0) return { valid: false, "message": "Must not be empty" }
    return { valid: true };
  },
  "Last name": (lastName: string): TCheckoutInputReturn => {
    if (lastName.length === 0) return { valid: false, "message": "Must not be empty" }
    return { valid: true };
  },
  "Email address": (emailAddress: string): TCheckoutInputReturn => {
    if (emailAddress.length === 0) return { valid: false, "message": "Must not be empty" }
    if (!validator.isEmail(emailAddress)) return { valid: false, "message": "Invalid email address" };
    return { valid: true };
  },
  "Credit card number": (cardNumber: string): TCheckoutInputReturn => {
    if (cardNumber.length === 0) return { valid: false, "message": "Must not be empty" }
    if (!cardNumber.match(new RegExp("[0-9]{13,19}"))) return { valid: false, "message": "Invalid card number" };
    return { valid: true };
  },
  "Expiry date": (expiryDate: string): TCheckoutInputReturn => {
    if (expiryDate.length === 0) return { valid: false, "message": "Must not be empty" }
    if (!validator.isDate(expiryDate) || new Date(expiryDate) < new Date()) {
      return { valid: false, "message": "Invalid expiry date" };
    } else {
      return { valid: true };
    }
  },
  "CVV": (CVV: string): TCheckoutInputReturn => {
    if (CVV.length === 0) return { valid: false, "message": "Must not be empty" }
    else if (!validator.isNumeric(CVV) || CVV.length !== 3) return { valid: false, "message": "CVV must be a 3 digit number" };
    return { valid: true };
  },
}