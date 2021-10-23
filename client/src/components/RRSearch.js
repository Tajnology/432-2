import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

/**
 * Page where users can search for games by entering in keywords
 */
function RRSearch() {
  // Update the page title
  useEffect(() => {
    document.title = "Homepage - Reddit Recon";
  }, []);

  return <div>Search</div>;
}

export default RRSearch;
