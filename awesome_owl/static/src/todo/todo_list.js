/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { TodoItem } from "./todo_item.js";
import { useAutofocus } from "../utils.js";

export class TodoList extends Component {
    static template = "awesome_owl.todoList";
    static components = { TodoItem };

    setup() {
        this.todos = useState([
            { id: 1, description: "Learn Owl", isCompleted: false },
            { id: 2, description: "Build a Todo App", isCompleted: false },
        ]);
        this.nextId = 3; // start from 3 since we have 2 sample todos
        this.inputRef = useAutofocus("todoInput");
    }

    toggleTodo(id) {
        const t = this.todos.find((x) => x.id === id);
        if (t) t.isCompleted = !t.isCompleted; // reactive flip
    }

    addTodo(event) {
        if (event.keyCode !== 13) return; // Enter only
        const desc = event.target.value.trim();
        if (!desc) return; // bonus: ignore empty/whitespace

        this.todos.push({
            id: this.nextId++,
            description: desc,
            isCompleted: false,
        });

        event.target.value = ""; // clear input
        this.inputRef.el?.focus(); // refocus input
    }

    removeTodo(id) {
        const idx = this.todos.findIndex((x) => x.id === id);
        if (idx >= 0) this.todos.splice(idx, 1); // reactive removal
    }
}
