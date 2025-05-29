from odoo import models, Command


class EstateProperty(models.Model):
    _inherit = "estate.property"

    def action_set_property_as_sold(self):
        res = super().action_set_property_as_sold()

        if res:
            print(">>> I'm going to make an invoice")
            self.env["account.move"].create(
                {
                    "partner_id": self.buyer_id.id,
                    "move_type": "out_invoice",
                    "invoice_line_ids": [
                        Command.create({"name": self.title, "quantity": 1, "price_unit": self.selling_price * 0.06}),
                        Command.create({"name": "Administrative Fee", "quantity": 1, "price_unit": 100}),
                    ],
                }
            )

        return res
