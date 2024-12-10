// Finish the code here.
// Feel free to modify any of the code in this project, this is just a starting point if it's helpful.

import { useState, useEffect, useRef } from "react";
import styles from "./combo-box.module.css";
interface ComboBoxProps {
  options: any[];
  itemOnClick: (value: string) => void;
  label?: string;
  placeholder?: string;
  renderOption?: any;
  value?: string;
  handleInputChange?: any;
}

export const ComboBox = ({
  options,
  itemOnClick,
  label,
  placeholder,
  renderOption,
  value,
  handleInputChange,
}: ComboBoxProps) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        setHighlightedIndex((prevIndex) =>
          Math.min(options.length - 1, prevIndex + 1)
        );
        setIsDropdownOpen(true);
        break;
      case "ArrowUp":
        setHighlightedIndex((prevIndex) => Math.max(0, prevIndex - 1));
        setIsDropdownOpen(true);
        break;
      case "Enter":
        if (highlightedIndex >= 0) {
          itemOnClick(options[highlightedIndex]);
          setIsDropdownOpen(false);
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.outercombobox}>
      {label && <label className="text-red-500"> {label}</label>}
      <div className={styles.combobox}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsDropdownOpen(true);
          }}
          placeholder={placeholder || "Search"}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="dropdown"
          aria-expanded={isDropdownOpen}
        />
        {isDropdownOpen && (
          <>
            {options.length > 0 ? (
              <div ref={dropdownRef} className={styles.dropdown}>
                {options.map((option, index) => (
                  <div
                    key={option}
                    className={` ${
                      index === highlightedIndex
                        ? styles.highlighted
                        : styles.option
                    }`}
                    onClick={() => {
                      itemOnClick(option);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      padding: "8px 10px",
                      cursor: "pointer",
                      backgroundColor:
                        index === highlightedIndex ? "#b3d4fc" : "transparent",
                    }}
                  >
                    {renderOption ? renderOption(option) : `${option}`}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.dropdown}>
                <div className={styles.option}>No results</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
