import React from "react";
import { IoSearch } from "react-icons/io5";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = React.memo(function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск по ФИО..."
        aria-label="Поиск по ФИО"
        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
});

export default SearchBar;
