import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Scan } from "~/pages/Scan";
import { History } from "~/pages/History";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Scan />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}
