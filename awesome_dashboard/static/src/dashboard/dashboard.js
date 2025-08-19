/** @odoo-module **/
import { Component, useState, onWillStart } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { useService } from "@web/core/utils/hooks";
import { DashboardItem } from "./dashboard_item/dashboard_item";
import { PieChart } from "./pie_chart/pie_chart"; // still used by PieChartCard
import "./dashboard_items"; // ensure our default items register into the category
import { SettingsDialog } from "./settings_dialog/settings_dialog";

const STORAGE_KEY = "awesome_dashboard.hidden_items";

export class AwesomeDashboard extends Component {
    static template = "awesome_dashboard.AwesomeDashboard";
    static components = { Layout, DashboardItem, PieChart };

    setup() {
        this.display = {
            controlPanel: {
                breadcrumbs: true,
            },
        };

        this.action = useService("action");
        this.dialog = useService("dialog");
        this.statsSvc = useService("awesome_dashboard.statistics");

        // subscribe to the reactive statistics
        this.statistics = useState(this.statsSvc.state);

        // pull ALL registered items, sort by sequence, and keep only the descriptors
        const entries = registry
            .category("awesome_dashboard.items")
            .getEntries(); // [[key, value], ...]
        this.allItems = entries
            .map(([, v]) => v)
            .sort((a, b) => (a.sequence ?? 1000) - (b.sequence ?? 1000));

        // load hidden ids from localStorage (array of strings)
        const hidden = this._loadHidden();
        // keep in reactive state so UI updates when settings change
        this.state = useState({ hiddenIds: hidden });

        onWillStart(async () => {
            if (!this.statistics.loaded) await this.statsSvc.refresh();
        });
    }

    // Visible items = allItems minus hidden ids
    get items() {
        const hiddenSet = new Set(this.state.hiddenIds || []);
        return this.allItems.filter((it) => !hiddenSet.has(it.id));
    }

    openCustomers() {
        this.action.doAction("contacts.action_contacts");
    }
    openLeads() {
        this.action.doAction({
            type: "ir.actions.act_window",
            name: "Leads",
            res_model: "crm.lead",
            views: [
                [false, "list"],
                [false, "form"],
            ],
            target: "current",
        });
    }

    // ⚙️ Open the settings dialog
    openSettings() {
        this.dialog.add(SettingsDialog, {
            items: this.allItems,
            initiallyHidden: this.state.hiddenIds,
            onApply: (hiddenIds) => {
                this.state.hiddenIds = hiddenIds; // trigger rerender
                this._saveHidden(hiddenIds); // persist
            },
        });
    }

    _loadHidden() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }
    _saveHidden(arr) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(arr || []));
        } catch {
            /* ignore */
        }
    }
}
registry.category("lazy_components").add("AwesomeDashboard", AwesomeDashboard);
