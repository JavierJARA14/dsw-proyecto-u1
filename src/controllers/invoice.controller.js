const { createInvoice, getInvoicePDF, getAllInvoices } = require("../services/facturapi.service");

const generarFactura = async (req, res) => {
    try {
        const data = {
        customer: req.body.customer_id,
        payment_form: "01", // Efectivo
        items: req.body.items // [{ product, quantity }]
        };

        const factura = await createInvoice(data);
        res.json({ ok: true, factura });

    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

const listarFacturas = async (req, res) => {
    try {
        const facturas = await getAllInvoices();
        res.json({ ok: true, facturas });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

const mostrarFacturaPDF = async (req, res) => {
    try {
        const { id } = req.params;
        const pdf = await getInvoicePDF(id);

        res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=factura_${id}.pdf`,
        "Content-Length": pdf.length
        });

        res.send(pdf);
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
};

module.exports = {
    generarFactura,
    listarFacturas,
    mostrarFacturaPDF
}