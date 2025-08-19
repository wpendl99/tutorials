from odoo import models, api


class ResUsers(models.Model):
    _inherit = "res.partner"

    @api.model
    def hello_world(self, message):
        print("Got message: ", message)
        return {"Status": "done", "Message": "Hello There!"}
