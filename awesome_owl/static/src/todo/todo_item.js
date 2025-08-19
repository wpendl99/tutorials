/** @odoo-module **/

import { Component } from "@odoo/owl";

export class TodoItem extends Component {
    static template = "awesome_owl.todoItem";
    static props = {
        // minimal validation: a todo object is required
        todo: { type: Object },
        toggleState: { type: Function }, // required callback
        removeTodo: { type: Function }, // required callback
    };

    onToggle() {
        this.props.toggleState(this.props.todo.id);
    }

    onRemove() {
        this.props.removeTodo(this.props.todo.id);
    }
}
