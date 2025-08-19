/** @odoo-module **/
import { Component, useState } from "@odoo/owl";
import { Dialog } from "@web/core/dialog/dialog";

export class SettingsDialog extends Component {
    static template = "awesome_dashboard.SettingsDialog";
    static components = { Dialog };
    static props = {
        items: { type: Array },
        initiallyHidden: { type: Array }, // array of item ids
        onApply: { type: Function },
        close: { type: Function, optional: true }, // injected (v18)
    };

    setup() {
        const hidden = new Set(this.props.initiallyHidden || []);
        // keep keys numeric to match item ids
        const checks = Object.fromEntries(
            this.props.items.map((it) => [it.id, !hidden.has(it.id)])
        );
        this.state = useState({ checks });
        console.log("SettingsDialog state:", this.state);
        console.log("SettingsDialog props:", this.props);
        console.log("Checks:", this.state.checks);
    }

    // NOTE: only event arg; no accidental shadowing
    toggle(ev) {
        const id = Number(ev.currentTarget.dataset.id); // normalize type
        this.state.checks[id] = ev.currentTarget.checked;
    }

    apply() {
        // derive hidden directly from items to avoid string/number pitfalls
        console.log("Imtes:", this.props.items);
        console.log("Checks:", this.state.checks);
        const hidden = this.props.items
            .filter((it) => !this.state.checks[it.id])
            .map((it) => it.id);

        console.log("Applying hidden items:", hidden);

        this.props.onApply(hidden);
        this.props.close?.();
    }

    cancel() {
        this.props.close?.();
    }
}
