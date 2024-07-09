import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PilotView from "./component/PilotView";
import AddEmployeeDetail from "./component/AddEmployee";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PilotView />} />
          <Route path="/AddEmployee" element={<AddEmployeeDetail />} />
          {/* <Route path="*" element={<NoPage />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
