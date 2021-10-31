import { useEffect, useState } from "react";
import axios from "axios";

/**
 * Displays the results in sorted columns of cards
 */
function ResultDisplay(props) {
  // Grab the relevant results
  const {
    analysisResults,
    redditResults,
    query
  } = props;

  const [positive, setPositive] = useState([]);
  const [negative, setNegative] = useState([]);

  // Only hook onto analysisResults because that will be the
  // last to be updated
  useEffect(() => {
    if (analysisResults.length != redditResults.length) {
      // An error has occured
      return;
    }

    let p = [];
    let n = [];
    let combined = [];
    for (let i = 0; i < analysisResults.length; i++) {
      combined.push([analysisResults[i], redditResults[i]]);
    }
    combined.sort();

    for (let i = 0; i < combined.length; i++) {
      if (combined[i][0] >= 0) {
        p.push(combined[i]);
      } else {
        n.push(combined[i]);
      }
    }

    n.reverse();
    p.reverse();

    setPositive(p);
    setNegative(n);

  }, [analysisResults]);

  return (
    <section className="my-5">

      <div>
        <h1 className="fw">Search Results</h1>
        <p className="lead mb-5">
          For {query}
        </p>
      </div>

      <div>
        <h2>Positive</h2>
        <CardGrid data={positive} />
      </div>

      <div>
        <h2>Negative</h2>
        <CardGrid data={negative} />
      </div>

    </section>
  );
}

/**
 * Card holder. One column only.
 */
function CardGrid(props) {
  // Grab the card data
  const {
    data
  } = props;

  return (
    <div>
      {data.map((post) => {
        return (
          <div className="row row-cols-1">
            <Card
              title={post[1].title}
              content={post[1].content}
              score={post[0]}
            />
          </div>
        )
      })
      }
    </div>
  );
}

/**
 * Cards that contain a reddit post and it's associated score
 */
function Card(props) {
  // Extract title, content and score
  const {
    title,
    content,
    score
  } = props;

  return (
    <div className="col mb-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{content}</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item" key="0">Score: {score}</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Fetches and displays reddit posts for a given query in cards
 */
function RRDetails(props) {
  // Query state
  const {
    query,
    setQuery,
    scalingMode
  } = props;

  // Reddit results state
  const [redditResults, setRedditResults] = useState([]);

  // Analysis results state
  const [analysisResults, setAnalysisResults] = useState([]);

  // Search reddit for query
  useEffect(() => {
    // Return if no work to be done
    if (!query.length) {
      setRedditResults([]);
      return;
    }

    axios({
      "method": "get",
      "url": "//localhost:8080/api/reddit",
      "params": {
        "q": query
      }
    })
      .then((response) => {
        return response.data;
      })
      .then((response) => {
        // Check if it was a success
        if (response.status && response.data.length > 0) {
          // Set it to redditResults
          setRedditResults(response.data);
        }
      })
      .catch((error) => {
        // Process error
        console.error(error);
      });
  }, [query]);

  // Analyse reddit results
  useEffect(() => {
    // Return if no work to be done
    if (!redditResults.length) {
      setAnalysisResults([]);
      return;
    }

    let mode = scalingMode ? "inefficient" : "efficient";
    axios({
      "method": "post",
      "url": "//localhost:8080/api/analysis",
      "data": {
        "mode": mode,
        "data": redditResults
      }
    })
      .then((response) => {
        return response.data;
      })
      .then((response) => {
        // Check if it was a success
        if (response.status && response.data.length > 0) {
          setAnalysisResults(response.data);
        }
      })
      .catch((error) => {
        // Process error
        console.error(error);
      });
  }, [redditResults]);

  return (
    <div>
      {query &&
        <ResultDisplay
          analysisResults={analysisResults}
          redditResults={redditResults}
          query={query}
        />
      }
    </div>
  );
}

export default RRDetails;
