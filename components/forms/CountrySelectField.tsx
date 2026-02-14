/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Control, Controller, FieldError } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxValue,
} from "@/components/ui/combobox";
import countryList from "react-select-country-list";

type CountrySelectProps = {
  name: string;
  label: string;
  control: Control<any>;
  error?: FieldError;
  required?: boolean;
};

// Helper function to get flag emoji
const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const CountrySelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const countries = countryList().getData();
  const selectedCountry = countries.find((c) => c.value === value);

  // Filter countries based on search input
  const filteredCountries = React.useMemo(() => {
    if (!searchValue) return countries;
    const search = searchValue.toLowerCase();
    return countries.filter(
      (country) =>
        country.label.toLowerCase().includes(search) ||
        country.value.toLowerCase().includes(search),
    );
  }, [searchValue, countries]);

  const handleValueChange = (newValue: string | null) => {
    if (newValue) {
      // เลือกประเทศ
      onChange(newValue);
      setSearchValue("");
      setIsOpen(false);
    } else {
      // กดปุ่ม clear (X)
      onChange("");
      setSearchValue("");
      setIsOpen(false);
    }
  };

  // Get display value for input
  const displayValue = React.useMemo(() => {
    if (isOpen) {
      return searchValue;
    }
    if (selectedCountry) {
      return `${getFlagEmoji(selectedCountry.value)} ${selectedCountry.label}`;
    }
    return "";
  }, [isOpen, searchValue, selectedCountry]);

  return (
    <Combobox
      value={value}
      onValueChange={handleValueChange}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <ComboboxInput
        placeholder="Search countries..."
        onChange={(e) => setSearchValue(e.target.value)}
        value={displayValue}
        onFocus={() => setIsOpen(true)}
        showTrigger
        showClear
      />
      <ComboboxContent>
        <ComboboxList>
          {filteredCountries.length === 0 && (
            <ComboboxEmpty>No country found.</ComboboxEmpty>
          )}
          {filteredCountries.map((country) => (
            <ComboboxItem key={country.value} value={country.value}>
              <span className="flex items-center gap-2">
                <span>{getFlagEmoji(country.value)}</span>
                <span>{country.label}</span>
              </span>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export const CountrySelectField = ({
  name,
  label,
  control,
  error,
  required = false,
}: CountrySelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <CountrySelect value={field.value} onChange={field.onChange} />
        )}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
      <p className="text-xs text-gray-500">
        Helps us show market data and news relevant to you.
      </p>
    </div>
  );
};
