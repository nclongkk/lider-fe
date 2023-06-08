import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PrivateRoute } from "./routes/PrivateRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route
            path="/*"
            element={
              <ProtectedRoute isProtected>
                <PrivateRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute>
                <Register />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <div id="endDiv"></div>
    </>
  );
}

export default App;
