import * as EmailValidator from "email-validator";

const passwordLength = 8;

export const checkEmailAddress = (emailAddress: string): boolean => {
  return EmailValidator.validate(emailAddress) || emailAddress === "";
}

export const checkPassword = (password: string): boolean => {
  return password.length >= passwordLength || password === "";
}

export const checkEmailAndPass = (emailAddress: string, password: string): boolean => {
  return !checkEmailAddress(emailAddress) || !checkPassword(password) || emailAddress === "" || password === "";
}