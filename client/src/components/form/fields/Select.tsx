import React, { forwardRef } from "react";
import styles from "../../../styles/components/form.module.scss";

type SelectType = {
  values: string[];
  onChange: (e: any) => void;
  name: string;
  label: string;
  required?: boolean;
};

const Select = (
  { values, name, onChange, label, required }: SelectType,
  ref: React.LegacyRef<HTMLSelectElement> | undefined
) => {
  return (
    <div className={styles.fieldSelect}>
      <label className={styles.fieldLabel}>{label}</label>
      <select ref={ref} onChange={onChange} name={name}>
        {values.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
};

export default forwardRef(Select);
