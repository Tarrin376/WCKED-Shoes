
export const isOkPassword = (password: string): boolean => {
  if (password.length >= 10) {
    return true;
  } else {
    return false;
  }
}

export const isMediumPassword = (password: string): boolean => {
  if (password.length >= 13) {
    return true;
  } else {
    return false;
  }
}

export const isStrongPassword = (password: string): boolean => {
  if (password.length >= 15) {
    return true;
  } else {
    return false;
  }
}