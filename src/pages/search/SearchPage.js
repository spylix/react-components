import { useState } from "react";
import { Redirect } from "react-router";
import "./SearchPage.css";

const SearchPage = () => {
  const [phrase, setPhrase] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setPhrase(e.target.value);
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.code === "Enter") search();
  };

  const search = () => {
    if (!phrase) {
      setError("Can't search for empty string.");
      return;
    }
    setShouldRedirect(true);
  };

  if (shouldRedirect) {
    return (
      <Redirect
        to={{
          pathname: "/search",
          state: { phrase },
        }}
      />
    );
  }

  return (
    <div id="search-body" className="center">
      <input
        type="search"
        id="search-input"
        placeholder="Search..."
        autoComplete="off"
        value={phrase}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {error ? (
        <p className="search-tip warning">{error}</p>
      ) : (
        <p className="search-tip">Press Enter to search.</p>
      )}
    </div>
  );
};

export default SearchPage;
