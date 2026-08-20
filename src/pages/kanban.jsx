import Header from "../componentes/Header";
import ListaTarefas from "../componentes/ListaTarefas";
import Sidebar from "../componentes/sidebar";
import ModalTarefa from "../componentes/ModalTarefa";
import axios from "axios";
import { useState, useEffect } from "react";

function Kanban() {
  // const [tarefas, setTarefas] = useState(() => {
  //   const tarefasSalvas = localStorage.getItem("tarefas");
  //   if (!tarefasSalvas) return [];
  //   const tarefasConvertidas = JSON.parse(tarefasSalvas);
  //   return Array.isArray(tarefasConvertidas) ? tarefasConvertidas : [];
  // });

  const URL_API = "https://6a85b16c9c451dc67a63fb26.mockapi.io/";

  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro("");
        const resposta = await axios.get(URL_API);
        setTarefas(resposta.data);
      } catch (e) {
        setErro("Erro ao carregar tarefas. Verifique a conexao");
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }
    carregarTarefas();
  }, []);

  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  function abrirModalCriar(coluna) {
    setTarefaEditando(null);
    setColunaAtiva(coluna);
    setModalAberto(true);
  }

  function salvarTarefa(dados) {
    if (dados.id) {
      setTarefas(
        tarefas.map((t) => (t.id === dados.id ? { ...t, ...dados } : t)),
      );
    } else {
      setTarefas([...tarefas, { ...dados, id: Date.now() }]); //ALTERAR ESTE DATE.NOW
    }
  }

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  const deletarTarefa = (id) => {
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  };

  const alternarConcluida = (id) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
      ),
    );
  };

  const moverTarefa = (id, novaColuna) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, coluna: novaColuna } : tarefa,
      ),
    );
  };

  return (
    <>
      <Sidebar />
      <Header
        titulo="Seja Bem-Vindo!"
        subtitulo="Estas, são suas tarefas:"
        tarefas={tarefas}
      />
      <main className="container">
        {carregando && (
          <p style={{ textAling: "center", color: "#94A3b8" }}>Carregando...</p>
        )}
        {erro && (
          <p style={{ textAlign: "center", color: "#ef4444" }}>{erro}</p>
        )}
        {!carregando && !erro(
            <div className="kanban-quadro">
              <div className="kanban-coluna">
                <div className="kanban-coluna-header">
                  <h3>A Fazer</h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span className="kanban-contador">
                      {tarefas.filter((t) => t.coluna === "afazer").length}
                    </span>
                    <button
                      className="kanban-btn-add"
                      onClick={() => abrirModalCriar("afazer")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <ListaTarefas
                  tarefas={tarefas.filter((t) => t.coluna === "afazer")}
                  onDeletar={deletarTarefa}
                  onConcluir={alternarConcluida} // <-- Use esta em vez de onEditar
                  onMover={moverTarefa}
                  colunaAnterior={null}
                  colunaProxima="andamento"
                />
              </div>
              <div className="kanban-coluna">
                <div className="kanban-coluna-header">
                  <h3>Em Andamento</h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span className="kanban-contador">
                      {tarefas.filter((t) => t.coluna === "andamento").length}
                    </span>
                    <button
                      className="kanban-btn-add"
                      onClick={() => abrirModalCriar("andamento")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <ListaTarefas
                  tarefas={tarefas.filter((t) => t.coluna === "andamento")}
                  onDeletar={deletarTarefa}
                  onConcluir={alternarConcluida}
                  onMover={moverTarefa}
                  colunaAnterior="afazer"
                  colunaProxima="concluido"
                />
              </div>

              <div className="kanban-coluna">
                <div className="kanban-coluna-header">
                  <h3>Concluído</h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span className="kanban-contador">
                      {tarefas.filter((t) => t.coluna === "concluido").length}
                    </span>
                    <button
                      className="kanban-btn-add"
                      onClick={() => abrirModalCriar("concluido")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <ListaTarefas
                  tarefas={tarefas.filter((t) => t.coluna === "concluido")}
                  onDeletar={deletarTarefa}
                  onConcluir={alternarConcluida}
                  onMover={moverTarefa}
                  colunaAnterior="andamento"
                  colunaProxima={null}
                />
              </div>
              {modalAberto && (
                <ModalTarefa
                  aberto={modalAberto}
                  onFechar={() => setModalAberto(false)}
                  onSalvar={salvarTarefa}
                  tarefa={tarefaEditando}
                  coluna={colunaAtiva}
                />
              )}
            </div>,
          )}
      </main>
      <footer>
        <p>
          TaskFlow &copy; 2026 &mdash; Aluno: Pablo Augusto da Silva Lope
          &mdash; SENAI CTGAS-ER
        </p>
      </footer>
    </>
  );
}

export default Kanban;
