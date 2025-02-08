import React from "react";
import { FiSliders } from "react-icons/fi";

const FilterButton = ({ onClick }) => {
  return (
    <button
      className="absolute right-3 top-2 bg-purple-200 p-2 rounded-lg"
      onClick={onClick}
    >
      <FiSliders className="text-purple-600 text-lg" />
    </button>
  );
};

export default FilterButton;
