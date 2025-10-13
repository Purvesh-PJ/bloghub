import React, { useState } from 'react';
import { SearchContainer, SearchInput, ButtonRow, Button } from './Search.styles';

const Search = ({ close }) => {
  const [term, setTerm] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to real search once available
    if (close) close();
  };

  return (
    <form onSubmit={onSubmit}>
      <SearchContainer>
        <SearchInput
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search posts..."
        />
        <ButtonRow>
          <Button type="submit">Search</Button>
        </ButtonRow>
      </SearchContainer>
    </form>
  );
};

export default Search;
