import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './App.css';

import NotFound from "./components/NotFound";
import RRSearch from "./components/RRSearch";
import RRNavbar from "./components/RRNavbar";

function App() {
  return (
    <Router>
      <RRNavbar />

      <div className="container">
        <Switch>

          <Route exact path="/" component={RRSearch} />

          <Route path="*" component={NotFound} />

        </Switch>
      </div>
    </Router>
  );
}

export default App;
