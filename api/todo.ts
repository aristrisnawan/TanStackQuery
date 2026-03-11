const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

export async function getTodos(): Promise<Todo[]> {

    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) {
        throw new Error('Failed to fetch todos');
    }
    const data = await response.json();
    return data;
}

export async function addTodo(text: string): Promise<Todo> {
    const todo = {
        id: Date.now().toString(),
        title: text,
        completed: false
    }

    const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    })
    if (!response.ok) {
        throw new Error('Failed to add todo');
    }

    const data = await response.json();
    return data;
}

export async function deleteTodo(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
    })
    if (!response.ok) {
        throw new Error('Failed to delete todo');
    }
    const data = await response.json();
    return data;
}

export async function updateTodo(todo: Todo): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    })
    if (!response.ok) {
        throw new Error('Failed to update todo');
    }
    const data = await response.json();
    return data;
}

export async function getTodoById(id: string): Promise<Todo> {
    const response = await fetch(`${API_URL}/todos/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch todo');
    }
    const data = await response.json();
    return data;
}