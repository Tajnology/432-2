import { useEffect, useState } from "react";

import RRSearch from "./RRSearch";
import RRDetails from "./RRDetails";

/**
 * Homepage
 */
function RRHomepage(props) {
  const {
    scalingMode
  } = props;

  // Update the page title
  useEffect(() => {
    document.title = "Homepage - Reddit Recon";
  }, []);

  // Used to pass a shared query between components
  const [query, setQuery] = useState("");

  return (
    <div>
      <RRSearch
        query={query}
        setQuery={setQuery}
      />

      <RRDetails
        query={query}
        setQuery={setQuery}
        scalingMode={scalingMode}
      />

    </div>
  );
}

export default RRHomepage;
