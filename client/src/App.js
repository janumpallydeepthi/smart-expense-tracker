import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  const path = window.location.pathname;

  if (path === "/dashboard") {
    return <Dashboard />;
  }

  return <Login />;
}

export default App;