/** @odoo-module **/
import { reactive } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { rpc } from "@web/core/network/rpc";

const REFRESH_MS = 10_000; // use 600_000 (10 min) in real life

const statisticsService = {
    start() {
        // Shared reactive object — any component doing useState() on this will re-render
        const state = reactive({
            loaded: false,
            error: null,
            // the server returns: average_quantity, average_time, nb_cancelled_orders,
            // nb_new_orders, total_amount, orders_by_size (keys: s/m/l/xl/xxl)
            average_quantity: undefined,
            average_time: undefined,
            nb_cancelled_orders: undefined,
            nb_new_orders: undefined,
            total_amount: undefined,
            orders_by_size: {},
        });

        async function fetchAndUpdate() {
            try {
                const res = await rpc("/awesome_dashboard/statistics", {});
                const payload = res?.result ?? res ?? {};
                // mutate in place so subscribers re-render
                state.error = null;
                state.loaded = true;
                state.average_quantity = payload.average_quantity;
                state.average_time = payload.average_time;
                state.nb_cancelled_orders = payload.nb_cancelled_orders;
                state.nb_new_orders = payload.nb_new_orders;
                state.total_amount = payload.total_amount;
                state.orders_by_size = payload.orders_by_size || {};
            } catch (e) {
                state.error = e?.message || "Failed to load statistics";
                state.loaded = true;
            }
        }

        // initial load + periodic refresh
        fetchAndUpdate();
        const interval = setInterval(fetchAndUpdate, REFRESH_MS);

        // expose an explicit refresh for manual reloads if needed
        return {
            state,
            refresh: fetchAndUpdate,
            // (optional) stop(){ clearInterval(interval); }
        };
    },
};

registry
    .category("services")
    .add("awesome_dashboard.statistics", statisticsService);
