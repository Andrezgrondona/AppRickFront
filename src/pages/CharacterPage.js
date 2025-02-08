import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CHARACTER } from '../queries';

const CharacterPage = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_CHARACTER, { variables: { id } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const character = data.character;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{character.name}</h1>
      <img src={character.image} alt={character.name} className="mb-4 rounded-md w-full max-w-md" />
      <p><strong>Status:</strong> {character.status}</p>
      <p><strong>Species:</strong> {character.species}</p>
      <p><strong>Gender:</strong> {character.gender}</p>
    </div>
  );
};

export default CharacterPage;
