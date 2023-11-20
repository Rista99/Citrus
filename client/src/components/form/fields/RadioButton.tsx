import React from "react";
import styles from "../../../styles/components/form.module.scss";

type RadioButtonData = {
  id: string;
  htmlFor: string;
  name: string;
  checked?: boolean;
  onChange?: (ev: any) => void;
  value: string | number;
  label?: string | number;
};

const RadioButton = ({
  id,
  name,
  checked,
  onChange,
  value,
  label,
  htmlFor,
}: RadioButtonData) => {
  return (
    <div className={`${styles.fieldRadio__item}`}>
      <input
        type="radio"
        name={name}
        id={id}
        onChange={onChange}
        checked={checked}
        value={value}
      />
      <label className={styles.fieldLabel} htmlFor={htmlFor}>
        {label && label}
      </label>
    </div>
  );
};

export default RadioButton;
