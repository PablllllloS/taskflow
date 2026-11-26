import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Kanban from "./kanban";
import { AuthProvider } from "../contexts/AuthContext";
import api from "../api";


// Troca o api.js inteiro por um de mentira

vi.mock("../api", () => ({
  default: { 
    get: vi.fn(), 
    post: vi.fn(), 
    put: vi.fn(), 
    delete: vi.fn() 
    },
  mensagensDeErro: vi.fn(() => ["erro"]),

}));

const respostas = {
    '/prioridades': [
        { id: 1, descricao: 'Alto'},
        { id: 2, descricao: 'Médio'},
    ],
    '/tarefas': [
        {id: 1, texto: 'Modelas o banco', coluna: 'afazer', prioridade: 'Alto', prioridade_cor: '#EF4444'},
        { id: 2, texto: 'Criar a API', coluna: 'andamento',prioridade: 'Médio', prioridade_cor: '#F59E0B' },
    ],
    '/usuarios': [{id: 1, nome: 'Ana Lima'}],
    '/projetos': [{id: 1, nome: 'Taskflow'}],
}

function desenharKanban (){
    render(<AuthProvider><Kanban /></AuthProvider>);
};

beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockImplementation((url) => Promise.resolve({ data: respostas[url]}));
});

describe('Kanban', () => {
    test('mostra Carregando enquanto a API não responde', () => {
        desenharKanban();

        expect(screen.getByText('Carregando tarefas...')).toBeInTheDocument();
    });

    test('depois da resopsta, as tarefas aparecem', async() => {
        desenharKanban();

        expect(await screen.findByText('Modelar o banco')).toBeInTheDocument();
        expect(screen.getByText('Criar a API')).toBeInTheDocument();
        expect(screen.queryByText(''))
    })
});