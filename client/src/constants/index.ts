export const ERRORS = {
  REQUIRED: 'This field is required.',
  TOO_LONG_ERROR: (max: number) => `Maximum number of characters is ${max}.`,
  TOO_SHORT_ERROR: (min: number) => `Minimum number of characters is ${min}.`,
  STRING_ERROR: 'Must be a string',
  PASSWORD_CHECK_ERROR: 'The passwords do not match',
  WEAK_PASSWORD: 'Weak password',
  EMAIL_ERROR: 'Invalid E-Mail format',
  USERNAME_TAKEN: 'Username already taken',
  WRONG_INPUT: 'Allowed character [0-9][a-f]',
};

const emailRegex =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const specialRegex = /^[0-9a-f]{1,32}$/;

export const FORM_FIELDS = {
  name: { name: 'name' },
  username: {
    name: 'username',
    validate: (v: string | null | undefined) => {
      if (v === null || v === undefined) {
        return ERRORS.REQUIRED;
      }
      if (typeof v !== 'string') {
        return ERRORS.STRING_ERROR;
      }
      if (v?.length < 2) {
        return ERRORS.TOO_SHORT_ERROR(2);
      }

      if (!specialRegex.test(v)) {
        return ERRORS.WRONG_INPUT;
      }
      return true;
    },
  },

  password: {
    name: 'password',
    validate: (v: string | null | undefined) => {
      if (v === null || v === undefined) {
        return true;
      }
      if (typeof v !== 'string') {
        return ERRORS.STRING_ERROR;
      }
      if (v?.length < 6) {
        return ERRORS.TOO_SHORT_ERROR(6);
      }
      return true;
    },
  },
};

export const INPUT_TYPES = {
  TEXTAREA: 'textArea',
};
