import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page center empty-page">
      <h1>404</h1>
      <h2>This page could not be found</h2>
      <Link to="/" className="btn">Go home</Link>
    </div>
  );
}

export default NotFound;
