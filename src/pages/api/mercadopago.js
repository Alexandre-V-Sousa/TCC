// src/pages/api/mercadopago.js
import mercadopago from "mercadopago";

// Pegue seu token de teste do .env.local
// EX: MP_ACCESS_TOKEN=APP_USR-xxxxxxxxxx
const token = process.env.MP_ACCESS_TOKEN;

if (!token) {
    console.error("MP_ACCESS_TOKEN não definido em .env.local");
}

mercadopago.configurations.setAccessToken(token);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: `Método ${req.method} não permitido` });
    }

    try {
        const incomingItems = req.body.items || [];

        // Mapeia produtos para o formato do MercadoPago
        const items = incomingItems.map((item) => {
            const rawPrice = item.valor_venda || item.valor || item.price || 0;
            const unit_price = Number(String(rawPrice).replace("R$", "").replace(",", ".").trim());
            return {
                title: item.nome || "Produto",
                quantity: Number(item.quantity) || 1,
                unit_price: unit_price <= 0 ? 0.01 : unit_price,
            };
        });

        const preference = {
            items: items.map(item => ({
                title: item.nome,
                unit_price: Number(item.valor_venda || item.valor || item.price || 0),
                quantity: item.quantity || 1,
            })),
            payment_methods: {
                excluded_payment_types: [{ id: "ticket" }], // exemplo de exclusão
                installments: 12, // máximo de parcelas no cartão
            },
            back_urls: {
                success: "http://localhost:3000/finalPag?status=success",  // sua página de sucesso
                pending: "http://localhost:3000/finalPag?status=pending",
                failure: "http://localhost:3000/finalPag?status=failure",
            },
            auto_return: "approved", // volta automaticamente para back_urls.success quando aprovado
        };

        const response = await mercadopago.preferences.create(preference);
        res.status(200).json(response.body);


        // Retorna sandbox_init_point para teste
        return res.status(200).json({
            init_point: response.body.init_point, // produção
            sandbox_init_point: response.body.sandbox_init_point, // teste
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}
