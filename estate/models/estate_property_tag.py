from odoo import models, fields


class EstatePropertyTag(models.Model):
    _name = "estate.property.tag"
    _description = "Estate Property Tag"
    _order = "name"

    name = fields.Char("Name", required=True)
    color = fields.Integer("Color")

    _sql_constraints = [
        ("tag_name_unique", "UNIQUE(name)", "The tag name must be unique"),
    ]
