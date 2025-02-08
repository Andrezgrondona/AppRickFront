import React from 'react';
import { Link } from 'react-router-dom';

const CharacterCard = ({ character }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img src={character.image} alt={character.name} className="mb-2 rounded-md w-full" />
      <h2 className="text-lg font-semibold">{character.name}</h2>
      <p className="text-gray-600">Species: {character.species}</p>
      <Link to={`/characters/${character.id}`} className="text-blue-500 hover:underline">
        View Details
      </Link>
    </div>
  );
};

export default CharacterCard;
