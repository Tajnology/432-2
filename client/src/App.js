import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './App.css';

import NotFound from "./components/NotFound";
import RRNavbar from "./components/RRNavbar";
import RRHomepage from "./components/RRHomepage";

function App() {
  return (
    <Router>
      <RRNavbar />

      <div className="container">
        <Switch>

          <Route exact path="/" component={RRHomepage} />

          <Route path="*" component={NotFound} />

        </Switch>
      </div>
    </Router>
  );
}

export default App;
