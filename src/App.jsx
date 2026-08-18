import { Route, Routes } from "react-router";
import "./App.css";
import Kanban from "./pages/kanban";
import Sobre from "./pages/sobre";
import Login from "./pages/login";
import RotaPrivada from "./componentes/RotaPrivada";

function App() {
//
  return (
    <div className="app-layout">
      <main className="app-conteudo">
        <Routes>
          <Route path="/" element={<RotaPrivada><Kanban/></RotaPrivada>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/sobre" element={<Sobre/>} />
          <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
