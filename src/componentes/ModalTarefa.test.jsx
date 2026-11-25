import {describe, test, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
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

    test('aberto para criar, mostra o título e os campos')
})