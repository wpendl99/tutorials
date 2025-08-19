/** @odoo-module **/

import { Component, useState } from "@odoo/owl";

export class Counter extends Component {
    static template = "awesome_owl.counter";
    static props = {
        onChange: { type: Function, optional: true }, // optional callback for when the counter changes
    };

    setup() {
        this.state = useState({ value: 1 });
    }

    increment() {
        this.state.value += 1;
        if (this.props.onChange) {
            this.props.onChange(1);
        }
    }
}
