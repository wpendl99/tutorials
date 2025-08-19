/** @odoo-module **/
import { Component } from "@odoo/owl";
import { LazyComponent } from "@web/core/assets";
import { registry } from "@web/core/registry";

export class AwesomeDashboardLoader extends Component {
    static components = { LazyComponent };
    static template = "awesome_dashboard.AwesomeDashboardLoader";
}

// Register the client action (use your action xml_id here)
registry
    .category("actions")
    .add("awesome_dashboard.dashboard", AwesomeDashboardLoader);
