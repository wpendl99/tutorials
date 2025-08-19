/** @odoo-module **/

import {
    Component,
    onWillStart,
    onMounted,
    onWillUnmount,
    useRef,
    useEffect,
} from "@odoo/owl";
import { loadJS } from "@web/core/assets";

export class PieChart extends Component {
    static template = "awesome_dashboard.PieChart";
    static props = {
        labels: { type: Array }, // e.g., ["S","M","L","XL","XXL"]
        data: { type: Array }, // e.g., [10, 20, 15, 7, 3]
        title: { type: String, optional: true },
    };

    setup() {
        this.canvasRef = useRef("canvas");
        this._chart = null;

        onWillStart(async () => {
            // Lazy load Chart.js from Odoo’s bundled lib
            await loadJS("/web/static/lib/Chart/Chart.js");
        });

        onMounted(() => {
            const ctx = this.canvasRef.el.getContext("2d");
            // eslint-disable-next-line no-undef
            this._chart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: this.props.labels,
                    datasets: [
                        {
                            label: this.props.title || "Pie",
                            data: this.props.data,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: "bottom" },
                        title: this.props.title
                            ? { display: true, text: this.props.title }
                            : { display: false },
                    },
                },
            });
        });

        // 🔁 Update dataset whenever labels or data props change
        useEffect(
            () => {
                if (!this._chart) return;
                this._chart.data.labels = this.props.labels;
                this._chart.data.datasets[0].data = this.props.data;
                this._chart.update();
            },
            () => [this.props.labels, this.props.data] // dependencies
        );

        onWillUnmount(() => {
            if (this._chart) {
                this._chart.destroy();
                this._chart = null;
            }
        });
    }
}
