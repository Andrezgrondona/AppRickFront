import { gql } from '@apollo/client';

export const GET_CHARACTERS = gql`
  query GetCharacters($status: String, $species: String, $gender: String) {
    characters(status: $status, species: $species, gender: $gender) {
      id
      name
      status
      species
      gender
      origin
      image
    }
  }
`;

export const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      image
      status
      species
      gender
      origin
    }
  }
`;
