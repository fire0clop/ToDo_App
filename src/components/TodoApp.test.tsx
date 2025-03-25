import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoApp from './TodoApp';

describe('TodoApp', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('renders correctly', () => {
        render(<TodoApp />);
        expect(screen.getByText('todos')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    });

    test('adds new todo', async () => {
        render(<TodoApp />);
        const input = screen.getByTestId('new-task-input');

        // Добавляем новую задачу
        fireEvent.change(input, { target: { value: 'Test todo' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        // Проверяем, что задача отобразилась
        const todoItem = await screen.findByTestId(/todo-item-/);
        expect(todoItem).toBeInTheDocument();
        expect(todoItem).toHaveTextContent('Test todo');
    });

    test('toggles todo completion', async () => {
        render(<TodoApp />);
        const input = screen.getByTestId('new-task-input');

        // Добавляем задачу
        fireEvent.change(input, { target: { value: 'Unique todo' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        const todoItem = await screen.findByTestId(/todo-item-/);
        const checkbox = todoItem.querySelector('[data-testid^="checkbox-"]');

        if (!checkbox) throw new Error('Checkbox not found');

        // Кликаем по чекбоксу
        fireEvent.click(checkbox);

        // Проверяем, что задача завершена
        expect(checkbox).toHaveAttribute('data-checked', 'true');
    });

    test('deletes todo', async () => {
        render(<TodoApp />);
        const input = screen.getByTestId('new-task-input');

        // Добавляем новую задачу
        fireEvent.change(input, { target: { value: 'Test delete' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        const todoItem = await screen.findByTestId(/todo-item-/);
        const deleteButton = todoItem.querySelector('[data-testid^="delete-btn-"]');

        if (!deleteButton) throw new Error('Delete button not found');

        // Удаляем задачу
        fireEvent.click(deleteButton);

        // Проверяем, что задача больше не отображается
        expect(screen.queryByText('Test delete')).not.toBeInTheDocument();
    });

    test('filters todos', async () => {
        render(<TodoApp />);
        const input = screen.getByTestId('new-task-input');

        // Добавляем активную задачу
        fireEvent.change(input, { target: { value: 'Active todo' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        // Добавляем завершенную задачу
        fireEvent.change(input, { target: { value: 'Completed todo' } });
        fireEvent.keyDown(input, { key: 'Enter' });

        // Завершаем вторую задачу
        const checkboxes = await screen.findAllByTestId(/checkbox-/);
        fireEvent.click(checkboxes[1]);

        // Проверяем фильтр Active
        fireEvent.click(screen.getByTestId('filter-active'));
        expect(await screen.findByText('Active todo')).toBeInTheDocument();
        expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();

        // Проверяем фильтр Completed
        fireEvent.click(screen.getByTestId('filter-completed'));
        expect(screen.queryByText('Active todo')).not.toBeInTheDocument();
        expect(await screen.findByText('Completed todo')).toBeInTheDocument();

        // Проверяем фильтр All
        fireEvent.click(screen.getByTestId('filter-all'));
        expect(await screen.findByText('Active todo')).toBeInTheDocument();
        expect(await screen.findByText('Completed todo')).toBeInTheDocument();
    });
});