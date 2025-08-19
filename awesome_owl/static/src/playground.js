/** @odoo-module **/

import { Component, useState, markup } from "@odoo/owl";
import { Counter } from "./counter/counter.js";
import { Card } from "./card/card.js";
import { TodoList } from "./todo/todo_list.js";

export class Playground extends Component {
    static template = "awesome_owl.playground";
    static components = { Counter, Card, TodoList };

    setup() {
        this.state = useState({
            // plain string (will be escaped even with t-out unless marked)
            rawHtml: "<strong>This will be escaped</strong>",
            // explicitly safe HTML
            safeHtml: markup("<strong>This will be bold</strong>"),

            // a number to be used to sum the counters
            sum: 2,
        });
    }

    incrementSum(delta = 1) {
        this.state.sum += delta;
    }
}
