// Finish the code here.
// Feel free to modify any of the code in this project, this is just a starting point if it's helpful.

import { useState, useEffect, useRef } from "react";
import styles from "./combo-box.module.css";
interface ComboBoxProps {
  options: string[];
  onSelect: (value: string) => void;
}

export const ComboBox = ({ options, onSelect }: ComboBoxProps) => {
  const [query, setQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOptions(filtered);
    setHighlightedIndex(-1);
  }, [query, options]);

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
          Math.min(filteredOptions.length - 1, prevIndex + 1)
        );
        setIsDropdownOpen(true);
        break;
      case "ArrowUp":
        setHighlightedIndex((prevIndex) => Math.max(0, prevIndex - 1));
        setIsDropdownOpen(true);
        break;
      case "Enter":
        if (highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedOption(event.target.value);
    setIsDropdownOpen(true);
  };

  const handleSelect = (value: string) => {
    setQuery("");
    setIsDropdownOpen(false);
    onSelect(value);
    setSelectedOption(value);
  };

  const handleOptionClick = (value: string) => {
    handleSelect(value);
  };

  return (
    <div ref={dropdownRef} className={styles.outercombobox}>
      <label className="text-red-500"> Option</label>
      <div className={styles.combobox}>
        <input
          ref={inputRef}
          type="text"
          value={selectedOption}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onClick={() => setIsDropdownOpen(true)}
          placeholder="Search..."
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="dropdown"
          aria-expanded={isDropdownOpen}
        />
        {isDropdownOpen && (
          <>
            {filteredOptions.length > 0 ? (
              <div className={styles.dropdown}>
                {filteredOptions.map((option, index) => (
                  <div
                    key={option}
                    className={` ${
                      index === highlightedIndex
                        ? styles.highlighted
                        : styles.option
                    }`}
                    onClick={() => {
                      handleOptionClick(option);
                    }}
                    style={{
                      padding: "8px 10px",
                      cursor: "pointer",
                      backgroundColor:
                        index === highlightedIndex ? "#b3d4fc" : "transparent",
                    }}
                  >
                    {option}
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
