import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

/**
 * Searching component where a searchbar will be embedded
 */
function RRSearch(props) {
  // Query state
  const {
    query,
    setQuery
  } = props;

  return (
    <div className="container py-5">
      <div className="row py-lg-5">
        <div className="col-lg-6 col-md-8 mx-auto text-center">
          <h1 className="fw">Reddit Recon</h1>
          <p className="lead text-muted">
            Find out what people think about topics on Reddit!
          </p>
          <span>
            <SearchInput
              query={query}
              setQuery={setQuery}
            />
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Searchbar which updates the query prop with the user entered keywords
 */
 function SearchInput(props) {
  const {
    query,
    setQuery
  } = props;

  return (
    <div className="input-group mb-3">
      <input
        id="searchInput"
        type="text"
        className="form-control"
        placeholder=""
        value={query}
        onChange={(event) => {
          const { value } = event.target;
          setQuery(value);
        }}
        aria-label="topic keywords"
        aria-describedby="searchInputButton"
      />

      <button
        id="searchInputButton"
        className="btn btn-primary"
        type="button"
        value=""
      >
        Search
      </button>

    </div>
  );
}

export default RRSearch;
