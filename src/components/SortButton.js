import React from 'react';

const SortButton = ({ setSortOrder }) => {
  return (
    <div>
      <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={() => setSortOrder('ASC')}>
        Sort A-Z
      </button>
      <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setSortOrder('DESC')}>
        Sort Z-A
      </button>
    </div>
  );
};

export default SortButton;
