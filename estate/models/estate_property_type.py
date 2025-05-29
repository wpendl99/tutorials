from odoo import models, fields, api


class EstatePropertyType(models.Model):
    _name = "estate.property.type"
    _description = "Estate Property Type"
    _order = "sequence, name"

    name = fields.Char("Name", required=True)
    property_ids = fields.One2many("estate.property", "property_type_id")
    sequence = fields.Integer("Sequence", default=1)
    offer_ids = fields.One2many("estate.property.offer", "property_type_id")
    offer_count = fields.Integer(compute="_count_offers")

    @api.depends("offer_ids")
    def _count_offers(self):
        for record in self:
            record.offer_count = len(record.offer_ids)

    _sql_constraints = [
        ("type_name_unique", "UNIQUE(name)", "The type name must be unique"),
    ]
