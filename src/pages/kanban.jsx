import Header from "../componentes/Header";
import ListaTarefas from "../componentes/ListaTarefas";
import Sidebar from "../componentes/sidebar";
import ModalTarefa from "../componentes/ModalTarefa";
import api from "../api";
import { useState, useEffect } from "react";

function Kanban() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro("");
        const resposta = await api.get('/tarefas');
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

  function abrirModalCriar(coluna) {
    setTarefaEditando(null); // Corrigido: antes estava passando 'tarefas' inteiro
    setColunaAtiva(coluna);
    setModalAberto(true);
  }

  async function salvarTarefa(dados) {
    try {
      setErro("");
      if (dados.id !== undefined) {
        // Editar tarefa existente - Corrigida a rota
        const { data: tarefaEditada } = await api.put(`/tarefas/${dados.id}`, dados);
        setTarefas(tarefasAtuais => tarefasAtuais.map(t => t.id === dados.id ? tarefaEditada : t));
      } else {
        // Nova tarefa - Corrigido o envio do corpo da requisição
        const { data: novaTarefa } = await api.post('/tarefas', dados);
        setTarefas(tarefasAtuais => [...tarefasAtuais, novaTarefa]);
      }
      setModalAberto(false);
    } catch (e) {
      // Aqui captura e exibe a mensagem de erro da nossa regra de negócio (limite de 2 tarefas)
      alert(e.response?.data?.erro || 'Erro ao salvar tarefa. Tente novamente.');
      console.error(e);
    }
  }

  async function deletarTarefa(id) {
    const confirmado = window.confirm('Tem certeza que deseja deletar esta tarefa?');
    if (!confirmado) return;
    try {
      // Corrigido: usando 'api.delete' em vez de axios puro com URL_API inexistente
      await api.delete(`/tarefas/${id}`);
      setTarefas(tarefasAtuais => tarefasAtuais.filter(t => t.id !== id));
    } catch (e) {
      alert('Erro ao deletar tarefa. Tente Novamente.');
      console.error(e);
    }
  }

  async function moverTarefa(id, novaColuna) {
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return;
    
    try {
      // Agora o front-end avisa o back-end da mudança de coluna
      const { data: tarefaAtualizada } = await api.put(`/tarefas/${id}`, { ...tarefa, coluna: novaColuna });
      setTarefas(tarefasAtuais => tarefasAtuais.map(t => t.id === id ? tarefaAtualizada : t));
    } catch (e) {
      // Exibe alerta se a regra de máximo 2 tarefas impedir a ação
      alert(e.response?.data?.erro || 'Erro ao mover tarefa.');
    }
  }

  // Sincroniza dupla-clique com o back-end
  async function alternarConcluida(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (!tarefa) return;
    
    const novaColuna = tarefa.coluna === "concluido" ? "afazer" : "concluido";
    moverTarefa(id, novaColuna);
  }

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
          <p style={{ textAlign: "center", color: "#94A3b8" }}>Carregando...</p>
        )}
        {erro && (
          <p style={{ textAlign: "center", color: "#ef4444" }}>{erro}</p>
        )}
        {!carregando && !erro && (
          <div className="kanban-quadro">
            {/* Coluna A Fazer */}
            <div className="kanban-coluna">
              <div className="kanban-coluna-header">
                <h3>A Fazer</h3>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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
                onConcluir={alternarConcluida}
                onMover={moverTarefa}
                colunaAnterior={null}
                colunaProxima="andamento"
              />
            </div>

            {/* Coluna Em Andamento */}
            <div className="kanban-coluna">
              <div className="kanban-coluna-header">
                <h3>Em Andamento</h3>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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

            {/* Coluna Concluído */}
            <div className="kanban-coluna">
              <div className="kanban-coluna-header">
                <h3>Concluído</h3>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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
            
            {/* Modal */}
            {modalAberto && (
              <ModalTarefa
                aberto={modalAberto}
                onFechar={() => setModalAberto(false)}
                onSalvar={salvarTarefa}
                tarefa={tarefaEditando}
                coluna={colunaAtiva}
              />
            )}
          </div>
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