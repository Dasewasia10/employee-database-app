import React, { useContext, useState } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';
import { FaSearch } from 'react-icons/fa';

import countryPhoneData from '../assets/countryPhoneNumber.json';

const Search: React.FC<{ className?: string; placeholder?: string }> = ({ className, placeholder }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [phoneNumberPrefix, setPhoneNumberPrefix] = useState('+62'); // Default prefix
  const [phoneLength, setPhoneLength] = useState<number | undefined>(12); // Default phone length, adjust based on your needs

  const handlePrefixChange = (prefix: string) => {
    const selectedCountry = countryPhoneData.find((country) => country.phone?.includes(prefix));
    if (selectedCountry) {
      setPhoneNumberPrefix(prefix);
      setPhoneLength(
        Array.isArray(selectedCountry.phoneLength)
          ? selectedCountry.phoneLength[0] // Use the first element of the array
          : selectedCountry.phoneLength ?? 12
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle input change logic
    const inputValue = e.target.value;
    // Add your logic here based on the input value
  };

  return (
    <section className={`flex flex-col ${className}`}>
      <section className="flex flex-row gap-4">
        {placeholder === 'Phone Number' ? (
          <div className="flex flex-col gap-4">
            {/* Dropdown for phone number prefix */}
            <select
              value={phoneNumberPrefix}
              onChange={(e) => handlePrefixChange(e.target.value)}
              className={`px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${
                darkMode ? 'focus:ring-gray-500' : 'focus:ring-gray-700'
              }`}
            >
              {countryPhoneData.map((country, index) => (
                <option key={index} value={country.phone}>
                  {`${country.name} (${country.phone})`}
                </option>
              ))}
            </select>
            {/* Input for phone number */}
            <span className="relative flex items-center">
              <input
                maxLength={phoneLength}
                type="text"
                placeholder="Enter phone number"
                className={`w-72 px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${
                  darkMode ? 'focus:ring-gray-500' : 'focus:ring-gray-700'
                }`}
                onChange={handleInputChange}
              />
              <FaSearch className="text-gray-600 flex w-12 -translate-x-12" />
            </span>
          </div>
        ) : (
          // Default search input
          <span className="relative flex items-center">
            <FaSearch className="text-gray-600 absolute right-0 flex w-12" />
            <input
              type="text"
              placeholder={placeholder}
              className={`w-96 px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${
                darkMode ? 'focus:ring-gray-500' : 'focus:ring-gray-700'
              }`}
              onChange={handleInputChange}
            />
          </span>
        )}
      </section>
    </section>
  );
};

export default Search;
