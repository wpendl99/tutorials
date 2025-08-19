/** @odoo-module **/

import { Component, useState } from "@odoo/owl";

export class Card extends Component {
    static template = "awesome_owl.card";
    static props = {
        title: { type: String }, // required string
        slots: { type: Object, optional: true },
    };

    setup() {
        this.state = useState({ open: true });
    }

    toggle() {
        this.state.open = !this.state.open;
    }
}
