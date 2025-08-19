/** @odoo-module **/

import { useRef, onMounted } from "@odoo/owl";

export function useAutofocus(refName = "input") {
    const ref = useRef(refName);
    onMounted(() => {
        ref.el?.focus();
    });
    return ref;
}
