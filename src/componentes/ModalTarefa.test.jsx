import {describe, test, expect, vi} from 'vitest';
import {getByRole, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {AuthProvider} from '../contexts/AuthContext';
import ModalTarefa from './ModalTarefa';

const prioridades = [
    {id: 1, descricao: 'Alto'},
    {id: 2, descricao: 'Média'},
    {id: 3, descricao: 'Baixa'}
];

const usuarios = [
    {id: 1, nome: 'Ana Lima'},
    {id: 2, nome: 'Roberto'}
];

const projetos = [
    {id: 10, descricao: 'Taskflow'},
    {id: 20, descricao: 'Kibo'}
];

function abrirModal(props = {}) {
    render(
        <AuthProvider>
            <ModalTarefa
                aberto={true}
                onFechar={vi.fn()}
                onSalvar={vi.fn()}
                prioridades={prioridades}
                usuarios={usuarios}
                projetos={projetos}
                {...props}
            />
        </AuthProvider>
    )
}

describe('ModalTarefa', () => {
    test('fechado, não mostra nada', () => {
        abrirModal({aberto: false});

        expect(screen.queryByText('Nova tarefa')).not.toBeInTheDocument();
    });

    test('aberto para criar, mostra o título e os campos', () => {
        abrirModal();

        expect(screen.getByRole('heading', {name: 'Nova tarefa'})).toBeInTheDocument();
        expect(screen.getByLabelText('Tarefa')).toHaveValue('');
        expect(screen.getByLabelText('Reponsável')).toHaveValue('1');
        expect(screen.getByLabelText('Projeot')).toHaveValue('10');
        expect(screen.getByLabelText('Prioridade')).toHaveValue('2');
    });

    test('aberto para editar', () => {
        const tarefa = {
            id: 7,
            texto: 'Revisar a API',
            coluna: 'Andamento',
            idprioridade: 1,
            usuario_id: 2,
            projeto_id: 20
        };
        abrirModal({tarefa});

        expect(screen.getByRole('heading', { name: 'Editar tarefa'})).toBeInTheDocument();
        expect(screen.getByLabelText('Tarefa')).toHaveValue('Revisar a API');
        expect(screen.getAllByLabelText('Responsável')).toHaveValue('2');
    });

    test('o que a pessoa digita aprece no campo', async () => {
        const user = userEvent.setup();
        abrirModal();

        const campo = screen.getByLabelText('Tarefa');
        await user.type(campo, 'Estudar mocks');

        expect(campo).toHaveValue('Estudar mocks')
    });

    test('cancelar e esq chama onFechar', async () => {
        const user = userEvent.setup();
        const onFechar = vi.fn();
        abrirModal({onFechar});

        await user.click(screen.getAllByRole('button', { name: 'Cancelar'}));
        await user.keyboard('Escape');

        expect(onFechar).toHaveBeenCalledTimes(2);
    });

    test('Salvar envia os dados e fecha o modal', async () => {
        const user = userEvent.setup();
        const onSalvar = vi.fn().mockResolvedValue();
        const onFechar = vi.fn();

        abrirModal({ onSalvar, onFechar, coluna: 'afazezr' });
        await user.type(screen.getByLabelText('Tarefa'), 'Estudar mocks');
        await user.selectOptions(screen.getByLabelText('Prioridade'), 'Alto');
        await user.click(screen,getByRole('button', { name: 'Salvar' }));

        expect(onSalvar).toHaveBeenCalledWith({
            texto: 'Estudar',
            coluna: 'afazer',
            idpiorirdade: 1,
            usuario_id: 1,
            projeto_id: 10,
        });
        expect(onFechar).toHaveBeenCalledTimes(1);
    });

    test('a API recusa: mostra os erros e não fecha', async () => {
        const user = userEvent.setup();
        const erro400 = {
            response: { data: { erro: { detalhes: ['texto é obrigatório']}}},
        };
        const onSalvar = vi.fn().mockRejectedValue(erro400);
        const onFechar = vi.fn();
        abrirModal({ onSalvar, onFechar });

        await user.click(screen.getByRole('button', {  name: 'Salvar' }));

        expect(await screen.findByText('texto é obrigatório')).toBeInTheDocument();
        expect(onFechar).not.toHaveBeenCalled();
    })
});