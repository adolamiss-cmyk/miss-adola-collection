// Todo App with Local Storage

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.currentSort = 'date-new';
        this.storageKey = 'todoAppData';
        
        this.init();
    }

    // Initialize the app
    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.render();
        console.log('Todo App initialized successfully!');
    }

    // Setup all event listeners
    setupEventListeners() {
        // Add todo
        document.getElementById('addBtn').addEventListener('click', () => this.addTodo());
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.closest('button').dataset.filter));
        });

        // Sort menu
        document.getElementById('sortBtn').addEventListener('click', () => this.toggleSortMenu());
        document.querySelectorAll('.sort-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.setSortOption(e.target.closest('button').dataset.sort));
        });

        // Clear completed
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());

        // Close sort menu when clicking outside
        document.addEventListener('click', (e) => {
            const sortMenu = document.getElementById('sortMenu');
            const sortBtn = document.getElementById('sortBtn');
            if (!sortMenu.contains(e.target) && !sortBtn.contains(e.target)) {
                sortMenu.classList.remove('show');
            }
        });
    }

    // Add new todo
    addTodo() {
        const input = document.getElementById('todoInput');
        const category = document.getElementById('categorySelect').value;
        const priority = document.getElementById('prioritySelect').value;
        const text = input.value.trim();

        if (!text) {
            this.showNotification('Please enter a task!', 'warning');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            category: category,
            priority: priority,
            completed: false,
            createdAt: new Date().toISOString(),
            dueDate: null
        };

        this.todos.unshift(todo);
        this.saveToLocalStorage();
        this.render();
        
        // Clear input
        input.value = '';
        input.focus();
        
        this.showNotification('Task added successfully!', 'success');
    }

    // Toggle todo completion
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }

    // Delete todo
    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveToLocalStorage();
            this.render();
            this.showNotification('Task deleted!', 'success');
        }
    }

    // Edit todo
    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        // Create and show edit modal
        this.showEditModal(todo);
    }

    // Show edit modal
    showEditModal(todo) {
        const modal = document.createElement('div');
        modal.className = 'edit-modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Task</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="form-group">
                    <label for="editTodoText">Task Title</label>
                    <input type="text" id="editTodoText" value="${this.escapeHtml(todo.text)}" required>
                </div>
                <div class="form-group">
                    <label for="editCategory">Category</label>
                    <select id="editCategory">
                        <option value="work" ${todo.category === 'work' ? 'selected' : ''}>Work</option>
                        <option value="personal" ${todo.category === 'personal' ? 'selected' : ''}>Personal</option>
                        <option value="shopping" ${todo.category === 'shopping' ? 'selected' : ''}>Shopping</option>
                        <option value="health" ${todo.category === 'health' ? 'selected' : ''}>Health</option>
                        <option value="education" ${todo.category === 'education' ? 'selected' : ''}>Education</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editPriority">Priority</label>
                    <select id="editPriority">
                        <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editDueDate">Due Date (Optional)</label>
                    <input type="date" id="editDueDate" value="${todo.dueDate ? todo.dueDate.split('T')[0] : ''}">
                </div>
                <div class="modal-buttons">
                    <button class="save-btn">Save Changes</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners for modal
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('.cancel-btn').addEventListener('click', () => modal.remove());
        modal.querySelector('.save-btn').addEventListener('click', () => {
            const newText = document.getElementById('editTodoText').value.trim();
            if (!newText) {
                alert('Please enter a task title!');
                return;
            }

            todo.text = newText;
            todo.category = document.getElementById('editCategory').value;
            todo.priority = document.getElementById('editPriority').value;
            todo.dueDate = document.getElementById('editDueDate').value;

            this.saveToLocalStorage();
            this.render();
            modal.remove();
            this.showNotification('Task updated!', 'success');
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    // Set filter
    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        this.render();
    }

    // Toggle sort menu
    toggleSortMenu() {
        const sortMenu = document.getElementById('sortMenu');
        sortMenu.classList.toggle('show');
    }

    // Set sort option
    setSortOption(sortType) {
        this.currentSort = sortType;
        document.getElementById('sortMenu').classList.remove('show');
        this.render();
    }

    // Clear completed todos
    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        
        if (completedCount === 0) {
            this.showNotification('No completed tasks to clear!', 'info');
            return;
        }

        if (confirm(`Delete ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveToLocalStorage();
            this.render();
            this.showNotification('Completed tasks cleared!', 'success');
        }
    }

    // Get filtered todos
    getFilteredTodos() {
        let filtered = this.todos;

        switch (this.currentFilter) {
            case 'active':
                filtered = filtered.filter(t => !t.completed);
                break;
            case 'completed':
                filtered = filtered.filter(t => t.completed);
                break;
        }

        return this.sortTodos(filtered);
    }

    // Sort todos
    sortTodos(todos) {
        const sorted = [...todos];

        switch (this.currentSort) {
            case 'date-old':
                sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
            case 'title':
                sorted.sort((a, b) => a.text.localeCompare(b.text));
                break;
            case 'date-new':
            default:
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return sorted;
    }

    // Render todos
    render() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filteredTodos = this.getFilteredTodos();

        todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            const createdDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });

            todoItem.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="todoApp.toggleTodo(${todo.id})"
                >
                <div class="todo-content">
                    <p class="todo-text">${this.escapeHtml(todo.text)}</p>
                    <div class="todo-meta">
                        <span class="todo-category ${todo.category}">${this.capitalize(todo.category)}</span>
                        <span class="todo-priority ${todo.priority}">${this.capitalize(todo.priority)} Priority</span>
                        <span class="todo-date">
                            <i class="fas fa-calendar"></i> ${createdDate}
                        </span>
                        ${todo.dueDate ? `<span class="todo-date"><i class="fas fa-clock"></i> Due: ${new Date(todo.dueDate).toLocaleDateString()}</span>` : ''}
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="action-btn edit-btn" onclick="todoApp.editTodo(${todo.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="todoApp.deleteTodo(${todo.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            todoList.appendChild(todoItem);
        });

        this.updateStats();
    }

    // Update statistics
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const remaining = total - completed;
        const percentage = total === 0 ? 0 : (completed / total) * 100;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('remainingTasks').textContent = remaining;
        document.getElementById('progressFill').style.width = `${percentage}%`;
    }

    // Save to local storage
    saveToLocalStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
        console.log('Data saved to localStorage');
    }

    // Load from local storage
    loadFromLocalStorage() {
        const saved = localStorage.getItem(this.storageKey);
        this.todos = saved ? JSON.parse(saved) : [];
        console.log(`Loaded ${this.todos.length} todos from localStorage`);
    }

    // Utility: Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Utility: Capitalize
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background-color: ${this.getNotificationColor(type)};
            color: white;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 2000;
            animation: slideIn 0.3s ease-out;
            font-weight: 500;
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Get notification color
    getNotificationColor(type) {
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        return colors[type] || colors.success;
    }

    // Export todos as JSON
    exportData() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `todos_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        this.showNotification('Data exported successfully!', 'success');
    }

    // Import todos from JSON
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    this.todos = imported;
                    this.saveToLocalStorage();
                    this.render();
                    this.showNotification('Data imported successfully!', 'success');
                } else {
                    this.showNotification('Invalid file format!', 'error');
                }
            } catch (error) {
                this.showNotification('Error importing data!', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Clear all data
    clearAllData() {
        if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone!')) {
            this.todos = [];
            this.saveToLocalStorage();
            this.render();
            this.showNotification('All tasks cleared!', 'success');
        }
    }

    // Get stats summary
    getStatsSummary() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const highPriority = this.todos.filter(t => t.priority === 'high' && !t.completed).length;
        
        return {
            total,
            completed,
            highPriority,
            completionRate: total === 0 ? 0 : Math.round((completed / total) * 100)
        };
    }
}

// Add CSS animations
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(animationStyle);

// Initialize app when DOM is ready
let todoApp;
document.addEventListener('DOMContentLoaded', () => {
    todoApp = new TodoApp();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            todoApp.exportData();
        }
    });

    console.log('%cTodo App Ready!', 'font-size: 16px; font-weight: bold; color: #ff006e;');
    console.log('Use todoApp object to access app methods');
});

// Make todoApp globally accessible for debugging
window.todoApp = todoApp || null;
