import React, { useState } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');  // State to store the search query

  const handleInputChange = (e) => {
    setQuery(e.target.value);  // Update the query as the user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", query);  // Example action on submit (can be replaced with actual search logic)
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;
