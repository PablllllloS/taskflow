import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event'; 
import TarefaItem from './TarefaItem';

describe('TarefaItem', () => {
    test('Mostra o texto e o rótulo da prioridade', () => {
        render(<TarefaItem texto="Estudar Vitest" prioridade="Alto" />);

        expect(screen.getByText('Estudar Vitest')).toBeInTheDocument();
        expect(screen.getByText('Alto')).toBeInTheDocument();
    });
});