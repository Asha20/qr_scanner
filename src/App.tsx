import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Scan } from "~/pages/Scan";
import { History } from "~/pages/History";
import { Export } from "~/pages/Export";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Scan />} />
        <Route path="/history" element={<History />} />
        <Route path="/export" element={<Export />} />
      </Routes>
    </Router>
  );
}
