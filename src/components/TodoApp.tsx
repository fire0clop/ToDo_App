import React, { useState, useEffect } from 'react';
import {
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Typography,
    Paper,
    Button,
    Box
} from '@mui/material';
import { Delete as DeleteIcon, Check as CheckIcon } from '@mui/icons-material';
import './TodoApp.css';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

const TodoApp: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const saved = localStorage.getItem('todos');
        return saved ? JSON.parse(saved) : [];
    });

    const [inputValue, setInputValue] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const handleAddTodo = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const trimmedValue = inputValue.trim();
            if (trimmedValue) {
                setTodos([...todos, {
                    id: Date.now(),
                    text: trimmedValue,
                    completed: false
                }]);
                setInputValue('');
            }
        }
    };

    const handleToggleTodo = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const handleDeleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const clearCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed));
    };

    const activeTodosCount = todos.filter(todo => !todo.completed).length;
    const completedTodosCount = todos.length - activeTodosCount;

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    return (
        <div className="app-container">
            <div>
                <Typography variant="h1" className="todo-header">todos</Typography>
                <Paper className="todo-paper" elevation={0}>
                    <TextField
                        label="New task"
                        className="todo-input"
                        placeholder="What needs to be done?"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleAddTodo}
                        autoFocus
                        fullWidth
                        inputProps={{ 'data-testid': 'new-task-input' }}
                    />

                    <List className="todo-list">
                        {filteredTodos.map((todo) => (
                            <ListItem
                                key={todo.id}
                                className="todo-item"
                                divider
                                data-testid={`todo-item-${todo.id}`}
                            >
                                <ListItemIcon
                                    className="checkbox-container"
                                    onClick={() => handleToggleTodo(todo.id)}
                                    data-testid={`checkbox-${todo.id}`}
                                    data-checked={todo.completed ? "true" : "false"}
                                >
                                    {todo.completed ? (
                                        <CheckIcon style={{ fontSize: '16px' }} /> /* Уменьшаем размер иконки */
                                    ) : (
                                        <div style={{ width: 24, height: 24 }} /> /* Пустой div с фиксированными размерами */
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={todo.text}
                                    style={{
                                        textDecoration: todo.completed ? 'line-through' : 'none',
                                    }}
                                />
                                <IconButton
                                    onClick={() => handleDeleteTodo(todo.id)}
                                    className="delete-button"
                                    data-testid={`delete-btn-${todo.id}`}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>

                    {todos.length > 0 && (
                        <Box className="footer">
              <span className="items-count">
                {activeTodosCount} item{activeTodosCount !== 1 ? 's' : ''} left
              </span>

                            <Box className="filter-buttons">
                                <Button
                                    onClick={() => setFilter('all')}
                                    className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                                    data-testid="filter-all"
                                    sx={{
                                        color: filter === 'all' ? 'black' : '#777',
                                        fontWeight: 300,
                                        minWidth: 'auto',
                                        fontSize: '14px',
                                        textTransform: 'none',
                                        border: filter === 'all' ? '1px solid rgba(175, 47, 47, 0.2)' : '1px solid transparent',
                                        borderRadius: '3px',
                                        '&:hover': {
                                            borderColor: 'rgba(175, 47, 47, 0.1)'
                                        }
                                    }}
                                >
                                    All
                                </Button>
                                <Button
                                    onClick={() => setFilter('active')}
                                    className={`filter-button ${filter === 'active' ? 'active' : ''}`}
                                    data-testid="filter-active"
                                    sx={{
                                        color: filter === 'active' ? 'black' : '#777',
                                        fontWeight: 300,
                                        minWidth: 'auto',
                                        fontSize: '14px',
                                        textTransform: 'none',
                                        border: filter === 'active' ? '1px solid rgba(175, 47, 47, 0.2)' : '1px solid transparent',
                                        borderRadius: '3px',
                                        '&:hover': {
                                            borderColor: 'rgba(175, 47, 47, 0.1)'
                                        }
                                    }}
                                >
                                    Active
                                </Button>
                                <Button
                                    onClick={() => setFilter('completed')}
                                    className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
                                    data-testid="filter-completed"
                                    sx={{
                                        color: filter === 'completed' ? 'black' : '#777',
                                        fontWeight: 300,
                                        minWidth: 'auto',
                                        fontSize: '14px',
                                        textTransform: 'none',
                                        border: filter === 'completed' ? '1px solid rgba(175, 47, 47, 0.2)' : '1px solid transparent',
                                        borderRadius: '3px',
                                        '&:hover': {
                                            borderColor: 'rgba(175, 47, 47, 0.1)'
                                        }
                                    }}
                                >
                                    Completed
                                </Button>
                            </Box>

                            <Button
                                onClick={clearCompleted}
                                className={`clear-completed ${completedTodosCount > 0 ? '' : 'disabled'}`}
                                disabled={completedTodosCount === 0}
                                data-testid="clear-completed"
                                sx={{
                                    color: '#777',
                                    fontWeight: 300,
                                    fontSize: '14px',
                                    textTransform: 'none',
                                    minWidth: 'auto',
                                    '&:hover': {
                                        textDecoration: completedTodosCount > 0 ? 'underline' : 'none'
                                    },
                                    '&.disabled': {
                                        opacity: 0.5,
                                        cursor: 'default'
                                    }
                                }}
                            >
                                Clear completed
                            </Button>
                        </Box>
                    )}
                </Paper>
            </div>
        </div>
    );
};

export default TodoApp;