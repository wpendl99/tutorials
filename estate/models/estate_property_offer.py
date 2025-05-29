from odoo import models, fields, api
from odoo.exceptions import UserError, ValidationError
from odoo.tools.translate import _
from dateutil.relativedelta import relativedelta


class EstatePropertyOffer(models.Model):
    _name = "estate.property.offer"
    _description = "Estate Property Offer"
    _order = "price desc"

    price = fields.Float("Price", digits=(10, 2))
    status = fields.Selection(
        selection=[("accepted", "Accepted"), ("refused", "Refused")], string="Status", copy=False
    )
    validity = fields.Integer("Validity (days)", default=7)
    date_deadline = fields.Date("Deadline", compute="_compute_date_deadline", inverse="_inverse_date_deadline")

    # Foreign IDs
    partner_id = fields.Many2one("res.partner", string="Partner", required=True, ondelete="set default")
    property_id = fields.Many2one("estate.property", string="Property", required=True, ondelete="cascade")
    property_type_id = fields.Many2one(
        related="property_id.property_type_id", store=True, readonly=True, ondelete="set null"
    )

    _sql_constraints = [
        ("check_offer_price", "CHECK(price > 0)", "The offer price must be a positive value"),
    ]

    @api.depends("validity", "create_date")
    def _compute_date_deadline(self):
        for record in self:
            base_date = record.create_date.date() if record.create_date else fields.Datetime.today()
            record.date_deadline = base_date + relativedelta(days=record.validity)

    def _inverse_date_deadline(self):
        for record in self:
            base_date = record.create_date.date() if record.create_date else fields.Datetime.today()
            record.validity = (record.date_deadline - base_date).days

    # Actions
    def action_accept_offer(self):
        for record in self:
            if record.property_id.offer_ids.filtered(lambda o: o.status == "accepted"):
                raise UserError(_("Only one offer can be accepted for a property."))

            record.status = "accepted"
            record.property_id.state = "offer_accepted"
            record.property_id.buyer_id = record.partner_id
            record.property_id.selling_price = record.price
        return True

    def action_decline_offer(self):
        for record in self:
            record.status = "refused"

            if not record.property_id.offer_ids.filtered(lambda o: o.status == "accepted"):
                record.property_id.state = "offer_received"
        return True

    @api.model_create_multi
    def create(self, vals_list):
        offers = super().create(vals_list)
        for offer in offers:
            property_id = offer.property_id
            offer_price = offer.price

            if property_id:
                max_price = max(property_id.offer_ids.filtered(lambda o: o.id != offer.id).mapped("price"), default=0)

                if offer_price < max_price:
                    raise ValidationError(
                        _("The offer must be higher than the current highest offer of %.2f") % max_price
                    )

                if property_id.state == "new":
                    property_id.state = "offer_received"

        return offers
