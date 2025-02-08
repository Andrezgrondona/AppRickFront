// import React, { useState } from "react";
// import { useQuery } from "@apollo/client";
// import { GET_CHARACTERS } from "../queries";
// import CharacterCard from "../components/CharacterCard";

// const CharacterList = () => {
//   const [selectedCharacter, setSelectedCharacter] = useState(null);
//   const [searchStatus, setSearchStatus] = useState("");
//   const [searchSpecies, setSearchSpecies] = useState("");
//   const [searchGender, setSearchGender] = useState("");

//   const { loading, error, data } = useQuery(GET_CHARACTERS, {
//     variables: { status: searchStatus, species: searchSpecies, gender: searchGender },
//   });

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar con filtros y lista de personajes */}
//       <div className="w-1/3 bg-white p-4 border-r overflow-auto">
//         <h1 className="text-xl font-bold mb-4">Rick and Morty List</h1>
        
//         {/* Filtros */}
//         <div className="mb-4">
//           <label className="block text-sm font-semibold">Status:</label>
//           <select 
//             className="w-full p-2 border rounded"
//             value={searchStatus} 
//             onChange={(e) => setSearchStatus(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="alive">Alive</option>
//             <option value="dead">Dead</option>
//             <option value="unknown">Unknown</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-semibold">Species:</label>
//           <select 
//             className="w-full p-2 border rounded"
//             value={searchSpecies} 
//             onChange={(e) => setSearchSpecies(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="human">Human</option>
//             <option value="alien">Alien</option>
//             <option value="robot">Robot</option>
//             <option value="unknown">Unknown</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-semibold">Gender:</label>
//           <select 
//             className="w-full p-2 border rounded"
//             value={searchGender} 
//             onChange={(e) => setSearchGender(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="genderless">Genderless</option>
//             <option value="unknown">Unknown</option>
//           </select>
//         </div>

//         {/* Lista de personajes */}
//         <div>
//           {data.characters.map((character) => (
//             <div 
//               key={character.id} 
//               className={`p-2 flex items-center gap-4 cursor-pointer rounded-md ${selectedCharacter?.id === character.id ? 'bg-purple-200' : 'hover:bg-gray-200'}`}
//               onClick={() => setSelectedCharacter(character)}
//             >
//               <img src={character.image} alt={character.name} className="w-10 h-10 rounded-full" />
//               <div>
//                 <p className="font-semibold">{character.name}</p>
//                 <p className="text-sm text-gray-500">{character.species}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Detalles del personaje seleccionado */}
//       <div className="w-2/3 p-6">
//         {selectedCharacter ? (
//           <div>
//             <div className="flex items-center gap-4 mb-4">
//               <img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-20 h-20 rounded-full" />
//               <h2 className="text-2xl font-bold">{selectedCharacter.name}</h2>
//             </div>
//             <div className="text-lg">
//               <p><span className="font-semibold">Species:</span> {selectedCharacter.species}</p>
//               <p><span className="font-semibold">Status:</span> {selectedCharacter.status}</p>
//               <p><span className="font-semibold">Gender:</span> {selectedCharacter.gender}</p>
//             </div>
//           </div>
//         ) : (
//           <p className="text-gray-500">Select a character to see details</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CharacterList;

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../queries";
import { FiSearch, FiSliders } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const CharacterList = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [starredCharacters, setStarredCharacters] = useState(new Set());

  const toggleStarred = (id) => {
    setStarredCharacters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: {
      name: searchQuery || undefined,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredCharacters = data.characters.filter((character) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      character.name.toLowerCase().includes(searchLower) ||
      character.status.toLowerCase().includes(searchLower) ||
      character.species.toLowerCase().includes(searchLower) ||
      character.gender.toLowerCase().includes(searchLower) ||
      (character.origin?.name?.toLowerCase() || "").includes(searchLower); // Evita errores si origin o name es undefined
  
    const matchesSpecies = speciesFilter === "All" || character.species === speciesFilter;
    const matchesStarred = statusFilter === "All" || (statusFilter === "Starred" && starredCharacters.has(character.id));
  
    return matchesSearch && matchesSpecies && matchesStarred;
  });
  

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-full md:w-1/3 bg-white p-6 border-r overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Rick and Morty List</h1>
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full p-3 pl-10 border rounded-lg bg-gray-100"
            placeholder="Search or filter results"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-3 text-gray-500 text-lg" />
          <button
            className="absolute right-3 top-2 bg-purple-200 p-2 rounded-lg"
            onClick={() => setFiltersVisible(!filtersVisible)}
          >
            <FiSliders className="text-purple-600 text-lg" />
          </button>
        </div>

        {filtersVisible && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Character Status</h3>
            <div className="flex gap-2 mb-4">
              {["All", "Starred"].map((status) => (
                <button
                  key={status}
                  className={`px-4 py-2 rounded-lg ${statusFilter === status ? "bg-purple-200 text-purple-700" : "bg-white border"}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            <h3 className="text-lg font-semibold mb-2">Species</h3>
            <div className="flex gap-2 mb-4">
              {["All", "Human", "Alien"].map((species) => (
                <button
                  key={species}
                  className={`px-4 py-2 rounded-lg ${speciesFilter === species ? "bg-purple-200 text-purple-700" : "bg-white border"}`}
                  onClick={() => setSpeciesFilter(species)}
                >
                  {species}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          {filteredCharacters.map((character) => (
            <div
              key={character.id}
              className={`p-2 flex items-center gap-4 cursor-pointer rounded-md ${selectedCharacter?.id === character.id ? "bg-purple-200" : "hover:bg-gray-200"}`}
              onClick={() => setSelectedCharacter(character)}
            >
              <img src={character.image} alt={character.name} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <p className="font-semibold">{character.name}</p>
                <p className="text-sm text-gray-500">{character.species}</p>
              </div>
              <FaHeart
                className={`text-2xl cursor-pointer ${starredCharacters.has(character.id) ? "text-green-500" : "text-gray-400"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStarred(character.id);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full md:w-2/3 p-6">
        {selectedCharacter ? (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-20 h-20 rounded-full" />
              <h2 className="text-2xl font-bold">{selectedCharacter.name}</h2>
            </div>
            <div className="text-lg">
              <p><span className="font-semibold">Species:</span> {selectedCharacter.species}</p>
              <p><span className="font-semibold">Status:</span> {selectedCharacter.status}</p>
              <p><span className="font-semibold">Gender:</span> {selectedCharacter.gender}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a character to see details</p>
        )}
      </div>
    </div>
  );
};

export default CharacterList;
