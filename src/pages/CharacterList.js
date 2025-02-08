import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../queries";
import { FiSearch } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { IoArrowBack } from "react-icons/io5";
import FilterButton from "../components/FilterButon";

const CharacterList = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [starredCharacters, setStarredCharacters] = useState(new Set());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  if (loading) return <p>Cargando Informacion...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredCharacters = data.characters.filter((character) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      character.name.toLowerCase().includes(searchLower) ||
      character.status.toLowerCase().includes(searchLower) ||
      character.species.toLowerCase().includes(searchLower) ||
      character.gender.toLowerCase().includes(searchLower) ||
      (character.origin?.name?.toLowerCase() || "").includes(searchLower);

    const matchesSpecies =
      speciesFilter === "All" || character.species === speciesFilter;
    const matchesStarred =
      statusFilter === "All" ||
      (statusFilter === "Starred" && starredCharacters.has(character.id));

    return matchesSearch && matchesSpecies && matchesStarred;
  });

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="w-full md:w-1/3 bg-white p-6 border-r overflow-auto">
        <h1 className="text-2xl sm:font-normal font-bold mb-4">
          Rick and Morty List
        </h1>

        <div className="relative mb-4">
          <input
            type="text"
            className="w-full p-3 pl-10 border rounded-lg bg-gray-100"
            placeholder="Search or filter results"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-3 text-gray-500 text-lg" />
          <FilterButton onClick={() => setFiltersVisible(!filtersVisible)} />
        </div>

        {filtersVisible && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Character Status</h3>
            <div className="flex gap-2 mb-4">
              {["All", "Starred"].map((status) => (
                <button
                  key={status}
                  className={`px-4 py-2 rounded-lg ${
                    statusFilter === status
                      ? "bg-purple-200 text-purple-700"
                      : "bg-white border"
                  }`}
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
                  className={`px-4 py-2 rounded-lg ${
                    speciesFilter === species
                      ? "bg-purple-200 text-purple-700"
                      : "bg-white border"
                  }`}
                  onClick={() => setSpeciesFilter(species)}
                >
                  {species}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Listado de caracteres del filtro por el buscador , Starred o filtro por species */}

        <div className="mt-4">
          {filteredCharacters.map((character) => (
            <div
              key={character.id}
              className={`p-2 flex items-center gap-4 cursor-pointer rounded-md ${
                selectedCharacter?.id === character.id
                  ? "bg-purple-200"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCharacter(character)}
            >
              <img
                src={character.image}
                alt={character.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-semibold">{character.name}</p>
                <p className="text-sm text-gray-500">{character.species}</p>
              </div>
              <FaHeart
                className={`text-2xl cursor-pointer ${
                  starredCharacters.has(character.id)
                    ? "text-green-500"
                    : "text-gray-400"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStarred(character.id);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desacripcion de los caracteres */}

      <div className="w-full md:w-2/3 p-6">
        {selectedCharacter ? (
          <div>
            <div className="flex flex-col items-start gap-2 mb-4">
              <img
                src={selectedCharacter.image}
                alt={selectedCharacter.name}
                className="rounded-full"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <h2 className="text-2xl font-bold">{selectedCharacter.name}</h2>
            </div>

            <div className="text-lg space-y-4">
              <div className="border-b-2 border-gray-200 pb-2">
                <span className="block font-semibold">Species:</span>
                <span>{selectedCharacter.species}</span>
              </div>
              <div className="border-b-2 border-gray-200 pb-2">
                <span className="block font-semibold">Status:</span>
                <span>{selectedCharacter.status}</span>
              </div>
              <div className="border-b-2 border-gray-200 pb-2">
                <span className="block font-semibold">Occupation:</span>
                <span>{selectedCharacter.gender}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a character to see details</p>
        )}
      </div>
      {/* Dialog (modal) para mostrar el detale en dispositivos moviles  */}
      <Dialog
        open={isMobile && !!selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      >
        <div className="fixed inset-0 flex items-start justify-center bg-white h-screen w-screen pt-0">
          {selectedCharacter && (
            <div className="w-full max-w-md p-6">
              <button
                onClick={() => setSelectedCharacter(null)}
                className="mb-4"
              >
                <IoArrowBack size={24} style={{ color: "#8054C7" }} />
              </button>

              <div className="flex flex-col items-start">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="rounded-full"
                  style={{ width: "75px", height: "75px", objectFit: "cover" }}
                />
                <h2 className="text-2xl font-bold text-center">
                  {selectedCharacter.name}
                </h2>
              </div>

              <div className="mt-6 text-lg">
                <div className="py-2 border-b">
                  <p className="font-semibold">Specie</p>
                  <p className="text-gray-600">{selectedCharacter.species}</p>
                </div>
                <div className="py-2 border-b">
                  <p className="font-semibold">Status</p>
                  <p className="text-gray-600">{selectedCharacter.status}</p>
                </div>
                <div className="py-2 border-b">
                  <p className="font-semibold">Occupation</p>
                  <p className="text-gray-600">{selectedCharacter.gender}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default CharacterList;
