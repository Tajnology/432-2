import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useState } from "react";

import './App.css';

import NotFound from "./components/NotFound";
import RRNavbar from "./components/RRNavbar";
import RRHomepage from "./components/RRHomepage";

function App() {
  const [scalingMode, setScalingMode] = useState(false);

  return (
    <Router>
      <RRNavbar
        scalingMode={scalingMode}
        setScalingMode={setScalingMode}
      />

      <div className="container">
        <Switch>

          <Route exact path="/">
            <RRHomepage
              scalingMode={scalingMode}
            />
          </Route>

          <Route path="*" component={NotFound} />

        </Switch>
      </div>
    </Router>
  );
}

export default App;
