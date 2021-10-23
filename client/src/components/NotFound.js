import { useEffect } from "react";
import { useHistory } from "react-router-dom";

/**
 * Redirect everything that isn't found back to root
 */
function NotFound() {
  const history = useHistory();

  useEffect(() => {
    history.push("/");
  });

  return (
    <div>
      <h1>404 Not Found</h1>
    </div>
  );
}

export default NotFound;
