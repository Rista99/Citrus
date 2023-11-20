import React from "react";
import styles from "../../../styles/components/form.module.scss";

type checkboxType = {
  id: string;
  htmlFor: string;
  name: string;
  checked?: boolean;
  onChange?: (ev: any) => void;
  value?: string;
  label?: string | number;
};

const Checkbox = ({
  id,
  name,
  checked,
  onChange,
  value,
  label,
  htmlFor,
}: checkboxType) => {
  return (
    <div className={styles.fieldCheckbox}>
      <label htmlFor={htmlFor} className={styles.fieldLabel}>
        <input
          id={id}
          name={name}
          type="checkbox"
          value={value}
          placeholder="terms"
          onChange={onChange}
          checked={checked}
        />
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
