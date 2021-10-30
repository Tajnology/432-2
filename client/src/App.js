import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './App.css';

import NotFound from "./components/NotFound";
import RRNavbar from "./components/RRNavbar";
import RRDisplay from "./components/RRDisplay";

function App() {
  return (
    <Router>
      <RRNavbar />

      <div className="container">
        <Switch>

          <Route exact path="/" component={RRDisplay} />

          <Route path="*" component={NotFound} />

        </Switch>
      </div>
    </Router>
  );
}

export default App;
