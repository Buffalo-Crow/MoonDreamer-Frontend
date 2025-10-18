import React, { useState, useRef, useEffect } from "react";
import "./MultiSelectDropDown.css";

// Multi-select dropdown component
export const MultiSelectDropdown = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select categories...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Delay listener slightly so opening click doesn’t immediately close it
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter((item) => item !== option)
      : [...selectedValues, option];

    onChange(newSelectedValues);
  };

  const removeItem = (item, e) => {
    e.stopPropagation();
    const newSelectedValues = selectedValues.filter(
      (selected) => selected !== item
    );
    onChange(newSelectedValues);
  };

  return (
    <div className={`multiselect-dropdown ${className}`} ref={dropdownRef}>
      <div
        className="multiselect-dropdown__trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="multiselect-dropdown__selected">
          {selectedValues.length === 0 ? (
            <span className="multiselect-dropdown__placeholder">
              {placeholder}
            </span>
          ) : (
            <div className="multiselect-dropdown__tags">
              {selectedValues.map((item) => (
                <span key={item} className="multiselect-dropdown__tag">
                  {item}
                  <button
                    type="button"
                    className="multiselect-dropdown__tag-remove"
                    onClick={(e) => removeItem(item, e)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className={`multiselect-dropdown__arrow ${isOpen ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation(); // prevent bubbling to trigger
            setIsOpen((prev) => !prev); // just toggle open/close
          }}
        >
          ▼
        </button>
      </div>

      {isOpen && (
        <div className="multiselect-dropdown__menu">
          {options.map((option) => (
            <div
              key={option}
              className={`multiselect-dropdown__option ${
                selectedValues.includes(option) ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={() => {}} // Handled by parent click
                className="multiselect-dropdown__checkbox"
              />
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
