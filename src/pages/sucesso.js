"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";

export default function Sucesso() {
  const router = useRouter();
  const [pedido, setPedido] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem("ultimoPedidoFake"));
    if (!p) {
      router.push("/produtos");
      return;
    }
    setPedido(p);

    // Gerar QR do PIX se o método for PIX
    if ((p.method || "").toLowerCase().includes("pix")) {
      gerarQrCode(p.pix || "00000000"); // p.pix deve conter o payload do PIX
    }

    // Imprimir automaticamente a nota fiscal bonita
    setTimeout(() => imprimirNota(p), 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gerarQrCode = async (pixPayload) => {
    try {
      const url = await QRCode.toDataURL(pixPayload, { width: 200 });
      setQrCodeUrl(url);
    } catch (err) {
      console.error("Erro ao gerar QR do PIX:", err);
    }
  };

  const imprimirNota = (pedido) => {
    if (!pedido) return;

    const total = pedido.items
      .reduce(
        (acc, item) =>
          acc + Number(item.valor_venda || item.valor || item.price || 0) * (item.quantity || 1),
        0
      )
      .toFixed(2);

    const html = `
      <html>
      <head>
        <title>Recibo Pedido ${pedido.id}</title>
        <meta charset="utf-8"/>
        <style>
          @page { margin: 12mm; }
          body { font-family: Arial, sans-serif; margin:0; padding:18px; color:#000; background:#fff; }
          .nota { border:2px solid #1f7a3a; border-radius:12px; padding:18px; max-width:480px; margin:auto; }
          h1 { text-align:center; color:#1f7a3a; margin:0 0 4px 0; font-size:20px; }
          h2 { text-align:center; margin:0 0 10px 0; font-weight:600; font-size:14px; color:#222; }
          .meta { font-size:12px; color:#333; margin-bottom:10px; display:flex; justify-content:space-between; }
          .items { margin-top:8px; font-size:13px; }
          .item { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #eee; }
          .totals { margin-top:10px; display:flex; justify-content:space-between; font-weight:700; font-size:15px; }
          .gatinho { display:block; margin:14px auto; width:120px; border-radius:8px; }
          .msg { font-size:12px; color:#333; margin-top:10px; line-height:1.3; text-align:center; }
          .qr { display:block; margin:10px auto; width:150px; height:150px; }
        </style>
      </head>
      <body>
        <div class="nota">
          <h1>Obrigado pela compra!</h1>
          <h2>Recibo — Pedido ${pedido.id}</h2>

          <div class="meta">
            <div>Cliente: ${escapeHtml(pedido.user?.nome || pedido.user?.email || "Cliente")}</div>
            <div>${new Date(pedido.created_at).toLocaleString()}</div>
          </div>

          <div class="items">
            ${pedido.items
              .map((it) => {
                const name = escapeHtml(it.nome || "Produto");
                const qty = it.quantity || 1;
                const price = (Number(it.valor_venda || it.valor || it.price || 0) * qty).toFixed(2);
                return `<div class="item"><div>${name} x${qty}</div><div>R$ ${price}</div></div>`;
              })
              .join("")}
          </div>

          <div class="totals">
            <div>Total:</div>
            <div>R$ ${total}</div>
          </div>

          ${qrCodeUrl ? `<img class="qr" src="${qrCodeUrl}" alt="QR do PIX"/>` : ""}
          <img class="gatinho" src="/gatinho_fofo.png" alt="Gatinho fofo" />

          <div class="msg">
            <strong>Obrigado!</strong><br/>
            Sua participação ajuda a manter e evoluir este projeto de TCC. Agradecemos o apoio!
          </div>
        </div>

        <script>
          setTimeout(() => window.print(), 500);
          function escapeHtml(text) {
            if (!text) return "";
            return String(text)
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
          }
        </script>
      </body>
      </html>
    `;

    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      window.print();
      return;
    }
    newWindow.document.write(html);
    newWindow.document.close();
  };

  if (!pedido) return <p className="text-center mt-10 text-black">Carregando recibo...</p>;

  return (
    <main className="min-h-screen bg-[#ECFFEB] p-6 md:p-12 text-black">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md text-black text-center">
        <h1 className="text-2xl font-bold mb-2">Pagamento Concluído!</h1>
        <h2 className="text-lg mb-2">Pedido: {pedido.id}</h2>
        <p className="mb-4">Método: {String(pedido.method || "").replace("_falso", "")}</p>

        {qrCodeUrl && <img src={qrCodeUrl} alt="QR do PIX" className="mx-auto mb-4 w-36 h-36" />}
        <Image src="/gatinho_fofo.png" alt="Gatinho fofo" width={150} height={150} className="mx-auto mb-4" />

        <p className="mb-4">A nota fiscal será impressa automaticamente. Obrigado por apoiar nosso projeto!</p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md hover:opacity-90">
            Voltar à loja
          </Link>

          <button
            onClick={() => imprimirNota(pedido)}
            className="inline-block bg-green-700 text-black px-6 py-3 rounded-md hover:bg-green-800"
          >
            Reimprimir Recibo
          </button>
        </div>
      </div>
    </main>
  );
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
