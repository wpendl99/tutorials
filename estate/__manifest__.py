{
    "name": "Estate Management",
    "version": "1.0",
    "summary": "Manage properties, clients, and sales",
    "depends": ["base"],
    "data": [
        "views/estate_property_offer_views.xml",
        "views/estate_property_tag_views.xml",
        "views/estate_property_type_views.xml",
        "views/estate_property_views.xml",
        "views/estate_menus.xml",
        "security/ir.model.access.csv",
    ],
    "application": True,
    "installable": True,
    "license": "LGPL-3",
}
