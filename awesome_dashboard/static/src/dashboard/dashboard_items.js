/** @odoo-module **/
import { registry } from "@web/core/registry";
import { NumberCard } from "./number_card/number_card";
import { PieChartCard } from "./pie_chart_card/pie_chart_card";

// We'll use our own category for dashboard items
const cat = registry.category("awesome_dashboard.items");

// Helper: add items with a stable key and an optional sequence for ordering
cat.add("nb_new_orders", {
    id: "nb_new_orders",
    description: "Number of new orders this month",
    sequence: 10,
    Component: NumberCard,
    size: 1,
    props: (data) => ({
        title: "New Orders (This Month)",
        value: data.nb_new_orders ?? 0,
    }),
});

cat.add("total_amount", {
    id: "total_amount",
    description: "Total amount of new orders this month",
    sequence: 20,
    Component: NumberCard,
    size: 1,
    props: (data) => ({
        title: "Total Amount (This Month)",
        value: data.total_amount ?? 0,
    }),
});

cat.add("avg_qty", {
    id: "avg_qty",
    description: "Average amount of t-shirt by order this month",
    sequence: 30,
    Component: NumberCard,
    size: 1,
    props: (data) => ({
        title: "Avg T‑Shirts per Order",
        value: data.average_quantity ?? 0,
    }),
});

cat.add("nb_cancelled", {
    id: "nb_cancelled",
    description: "Number of cancelled orders this month",
    sequence: 40,
    Component: NumberCard,
    size: 1,
    props: (data) => ({
        title: "Cancelled Orders (This Month)",
        value: data.nb_cancelled_orders ?? 0,
    }),
});

cat.add("avg_time_to_close", {
    id: "avg_time_to_close",
    description:
        "Average time for an order to go from ‘new’ to ‘sent’ or ‘cancelled’",
    sequence: 50,
    Component: NumberCard,
    size: 2,
    props: (data) => ({
        title: "Avg Time to Close (New → Sent/Cancelled)",
        value: data.average_time ?? 0,
        note: "Updated periodically",
    }),
});

cat.add("sizes_pie", {
    id: "sizes_pie",
    description: "T‑Shirts sold by size",
    sequence: 60,
    Component: PieChartCard,
    size: 2,
    props: (data) => {
        const labels = ["S", "M", "L", "XL", "XXL"];
        const counts = data.orders_by_size || {};
        return {
            title: "T‑Shirts by Size",
            labels,
            data: labels.map((l) => Number(counts[l.toLowerCase()] || 0)),
        };
    },
});
