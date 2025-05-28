from odoo import models, fields, api
from odoo.exceptions import UserError, ValidationError
from odoo.tools.translate import _
from odoo.tools.float_utils import float_compare, float_is_zero
from dateutil.relativedelta import relativedelta

import logging

_logger = logging.getLogger(__name__)


class EstateProperty(models.Model):
    _name = "estate.property"
    _description = "Estate Property"

    title = fields.Char("Title", required=True)
    description = fields.Text("Description")
    postcode = fields.Char("Postcode", size=9)
    date_availability = fields.Date(
        "Available From", copy=False, default=(fields.Datetime.today() + relativedelta(months=3))
    )
    expected_price = fields.Float("Expected Price", required=True)
    selling_price = fields.Float("Selling Price", readonly=True, copy=False)
    bedrooms = fields.Integer("Bedrooms", default=2)
    living_area = fields.Integer("Living Area (sqm)")
    facades = fields.Integer("Facades")
    garage = fields.Boolean("Has Garage?")
    garden = fields.Boolean("Has Garden?")
    garden_area = fields.Integer("Garden Area (sqm)")
    garden_orientation = fields.Selection(
        selection=[("north", "North"), ("south", "South"), ("east", "East"), ("west", "West")],
        string="Garden Orientation",
    )
    state = fields.Selection(
        selection=[
            ("new", "New"),
            ("offer_received", "Offer Received"),
            ("offer_accepted", "Offer Accepted"),
            ("sold", "Sold"),
            ("cancelled", "Cancelled"),
        ],
        string="Status",
        default="new",
    )
    active = fields.Boolean("Active", default=True)
    total_area = fields.Integer("Total Area", compute="_compute_total_area")
    best_offer = fields.Float("Best Offer", digits=(10, 2), compute="_compute_best_offer")

    # Foreign IDs
    property_type_id = fields.Many2one("estate.property.type", string="Property Type")
    salesman_id = fields.Many2one("res.users", string="Salesman", default=lambda self: self.env.user)
    buyer_id = fields.Many2one("res.partner", "Buyer", copy=False)
    property_tag_ids = fields.Many2many("estate.property.tag", string="Property Tags")
    offer_ids = fields.One2many("estate.property.offer", "property_id", string="Offers")

    _sql_constraints = [
        ("check_expected_price", "CHECK(expected_price > 0)", "The expected price must be a positive value"),
        ("check_selling_price", "CHECK(selling_price > 0)", "The selling price must be a positive value"),
        ("check_expected_price", "CHECK(expected_price > 0)", "The expected price must be a positive value"),
    ]

    @api.constrains("selling_price", "expected_price")
    def _check_expected_price(self):
        for record in self:
            if float_is_zero(record.selling_price, precision_digits=2):
                continue
            min_selling_price = record.expected_price * 0.9
            if float_compare(record.selling_price, min_selling_price, precision_digits=2) < 0:
                raise ValidationError(_("The selling price cannot be lower than 90% of the expected price"))

    def is_available(self):
        self.ensure_one()
        return self.state == "new" or self.state == "offer_received"

    @api.depends("postcode", "title")
    def _compute_display_name(self):
        for record in self:
            record.display_name = f"{record.postcode or ''} - {record.title or ''}"

    @api.depends("living_area", "garden_area")
    def _compute_total_area(self):
        for record in self:
            record.total_area = self.living_area + self.garden_area

    @api.depends("offer_ids.price")
    def _compute_best_offer(self):
        for record in self:
            record.best_offer = max(record.mapped("offer_ids.price"), default=0)

    @api.onchange("garden")
    def _onchange_garden(self):
        if self.garden:
            self.garden_area = 10
            self.garden_orientation = "north"
        else:
            self.garden_area = 0
            self.garden_orientation = None

    # ACTIONS
    def action_set_property_as_sold(self):
        for record in self:
            if record.state == "cancelled":
                raise UserError(_("Cancelled properties can't be sold"))

            record.state = "sold"
        return True

    def action_set_property_as_cancelled(self):
        for record in self:
            if record.state == "sold":
                raise UserError(_("Sold properties can't be cancelled"))

            record.state = "cancelled"
        return True


print(">>> EstateProperty model is being loaded")
