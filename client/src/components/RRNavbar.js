/**
 * Site logo which can be clicked to navigate back to home
 */
function RRNavbar(props) {
  const {
    scalingMode,
    setScalingMode
  } = props;

  return (
    <nav className="navbar navbar-dark bg-primary d-flex justify-content-between">
      <div className="container-fluid">

        <div className="navbar-brand">
          <img src="/favicon.png" alt="Reddit Recon Logo" height="27" className="d-inline-block align-text-top me-2" />
          Reddit Recon
        </div>

        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {setScalingMode(!scalingMode)}}
          >
            {scalingMode ? "Scaling Mode On" : "Scaling Mode Off"}
          </button>
        </div>

      </div>
    </nav>
  );
}

export default RRNavbar;
