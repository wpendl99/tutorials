from odoo import models, fields
from dateutil.relativedelta import relativedelta


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

    def _compute_display_name(self):
        for record in self:
            record.display_name = f"{record.postcode or ''} - {record.title or ''}"


print(">>> EstateProperty model is being loaded")
