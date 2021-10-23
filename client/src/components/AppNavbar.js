import { NavLink } from "react-router-dom";

/**
 * Site logo which can be clicked to navigate back to home
 */
function RRNavbar() {
  return (
    <nav className="navbar navbar-dark bg-primary">
      <NavLink
        to="/"
        className="container-fluid"
      >
        <div className="navbar-brand">
          <img src="/favicon.png" alt="Reddit Recon Logo" height="27" className="d-inline-block align-text-top me-2"/>
          Reddit Recon
        </div>
      </NavLink>
    </nav>
  );
}

export default RRNavbar;
