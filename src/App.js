import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PilotView from "./component/PilotView";
import AddEmployeeDetail from "./component/AddEmployee";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<PilotView />} />
          <Route path="/AddEmployee" element={<AddEmployeeDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
