import { Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import SearchResultsPage from "./pages/search-results/SearchResultsPage";
import SearchPage from "./pages/search/SearchPage";

function App() {
  return (
    <Router>
      <Route path="/" component={SearchPage} exact />
      <Route path="/search" component={SearchResultsPage} />
    </Router>
  );
}

export default App;
