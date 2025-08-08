import React from 'react';

const PageCountInput = ({ value, onChange, name = 'page_count', min = 1, max = 200, placeholder = 'Enter Page Count', className = '' }) => {
  const handleInputChange = (e) => {
    let val = e.target.value;

    // Allow empty input for user to clear field
    if (val === '') {
      onChange(e);
      return;
    }

    const numVal = Number(val);

    if (numVal > max) {
      // Set value to max if exceeded
      e.target.value = max.toString();
      onChange({
        ...e,
        target: {
          ...e.target,
          value: max.toString(),
          name,
        },
      });
    } else if (numVal < min) {
      // Optional: restrict values below min
      e.target.value = min.toString();
      onChange({
        ...e,
        target: {
          ...e.target,
          value: min.toString(),
          name,
        },
      });
    } else {
      onChange(e);
    }
  };

  return (
    <input
      type="number"
      name={name}
      value={value}
      onChange={handleInputChange}
      min={min}
      max={max}
      placeholder={placeholder}
      className={className}
      inputMode="numeric"
      pattern="[0-9]*"
    />
  );
};

export default PageCountInput;
