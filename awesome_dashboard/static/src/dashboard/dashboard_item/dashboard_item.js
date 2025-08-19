/** @odoo-module **/

import { Component } from "@odoo/owl";

export class DashboardItem extends Component {
    static template = "awesome_dashboard.DashboardItem";
    static props = {
        size: { type: Number, optional: true },
        // allow slotted content without failing validation
        slots: { type: Object, optional: true },
    };

    get widthRem() {
        const size = Number(this.props.size ?? 1);
        return `${18 * (isNaN(size) ? 1 : size)}rem`;
    }
}
