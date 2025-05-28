from odoo import models, fields, api
from dateutil.relativedelta import relativedelta


class EstatePropertyOffer(models.Model):
    _name = "estate.property.offer"
    _description = "Estate Property Offer"

    price = fields.Float("Price", digits=(10, 2))
    status = fields.Selection(
        selection=[("accepted", "Accepted"), ("refused", "Refused")], string="Status", copy=False
    )
    validity = fields.Integer("Validity (days)", default=7)
    date_deadline = fields.Date("Deadline", compute="_compute_date_deadline", inverse="_inverse_date_deadline")

    # Foreign IDs
    partner_id = fields.Many2one("res.partner", string="Partner", required=True)
    property_id = fields.Many2one("estate.property", string="Property", required=True)

    @api.depends("validity", "create_date")
    def _compute_date_deadline(self):
        for record in self:
            base_date = record.create_date.date() if record.create_date else fields.Datetime.today()
            record.date_deadline = base_date + relativedelta(days=record.validity)

    def _inverse_date_deadline(self):
        for record in self:
            base_date = record.create_date.date() if record.create_date else fields.Datetime.today()
            record.validity = (record.date_deadline - base_date).days
