from odoo import models, fields


class EstateProperty(models.Model):
    _name = "estate.property"
    _description = "Estate Property"

    name = fields.Char("Name", required=True)
    description = fields.Text("Description")
    postcode = fields.Char("Postcode")
    date_availability = fields.Date("Availability Date")
    expected_price = fields.Float("Expected Price", required=True)
    selling_price = fields.Float("Selling Price")
    bedrooms = fields.Integer("# of Bedrooms")
    living_area = fields.Integer("Area of Living")
    facades = fields.Integer("# of Facades")
    garage = fields.Boolean("Has Garage?")
    garden = fields.Boolean("Has Garden?")
    garden_area = fields.Integer("Area of Garden")
    garden_orientation = fields.Selection(
        selection=[("north", "North"), ("south", "South"), ("east", "East"), ("west", "West")],
        string="Garden Orientation",
    )


print(">>> EstateProperty model is being loaded")
