import React, { useEffect, useState } from 'react';
import { INPUT_TYPES } from '../../../constants';

type InputData = {
  id?: string;
  type?: string;
  name: string;
  placeholder?: string;
  label: string | undefined;
  onClick?: (ev: any) => void;
  onChange?: (ev: any) => void;
  inputType?: string;
  value?: any;
  error?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  rules?: any;
  required?: boolean;
  maxLength?: number;
};

const Input = ({
  id,
  type,
  name,
  label,
  placeholder,
  onClick,
  inputType,
  onChange,
  value,
  error,
  disabled,
  defaultValue,
  rules,
  required,
  maxLength,
}: InputData) => {
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const inputValue = value;
    if (value == '' && defaultValue == '') {
      setIsEmpty(true);
    } else if (value == undefined && defaultValue == undefined) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [value, defaultValue]);

  return (
    <div
      className={isEmpty ? `text-base label-text` : `text-base label-text `}
      onClickCapture={onClick}
    >
      <label
        htmlFor={id}
        className={
          error
            ? `label text-base label-text text-red-500 justify-start`
            : `label text-base label-text justify-start`
        }
      >
        {label}
        {required && <span className={`text-red-500`}>*</span>}
      </label>
      {error && <span className={'text-red-500'}>{error}</span>}
      {inputType === INPUT_TYPES.TEXTAREA ? (
        <textarea
          className={``}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          defaultValue={defaultValue}
          maxLength={maxLength}
        />
      ) : (
        <input
          className={'w-full input input-bordered input-primary'}
          onChange={onChange}
          id={id}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          defaultValue={defaultValue}
          maxLength={maxLength}
        />
      )}
      {/* {error && <span className={styles.errorMessage__bottom}>{error}</span>} */}
    </div>
  );
};

export default Input;
