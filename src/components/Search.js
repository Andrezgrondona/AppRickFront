import React from 'react';

const Search = ({ setSearchStatus, setSearchSpecies, setSearchGender }) => {
  return (
    <div className="flex items-center gap-2">
      <input type="text" placeholder="Status" className="border p-2 rounded" onChange={(e) => setSearchStatus(e.target.value)} />
      <input type="text" placeholder="Species" className="border p-2 rounded" onChange={(e) => setSearchSpecies(e.target.value)} />
      <input type="text" placeholder="Gender" className="border p-2 rounded" onChange={(e) => setSearchGender(e.target.value)} />
    </div>
  );
};

export default Search;
