import React from "react";
import searchIcon from "../assets/Search.jpg";


const SearchBar = ({
  searchTerm,
  setSearchTerm,
  title = "Recherche",
  placeholder = "Rechercher...",
}) => {
  return (
    <div className="search-bar-container">
      {title && <h3 className="search-title">{title}</h3>}

      <div className="search-wrapper">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <img src={searchIcon} alt="search" className="search-icon-inside" />
      </div>
    </div>
  );
};

export default SearchBar;