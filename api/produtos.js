const GOOGLE_SCRIPT_URL =
    "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiWZu-jpb9Cu1v0fimD4TAzS-LPdNqGYTaY7Q5gQ95Gk_UVRU0s3fCb5BjseDNusVj0nGZoUTy7ejp-RvTB8prPRLIO-hD71oUE2kiDeSeOoUHCJmKWI9flKqtQvpCzHEcQWnSm--FexvVtielgt5Sxop-M7LUY1-ko-Kl1rfzpFMC-S9C2WBQXDJ8U0bPI88A88PR_LHeuXaS4DWPnO-pUqpG5YUKie3vVr9id7M4pYpEm1-Es02txq_CLFQ7Lq_n3xE6R8WTz9UevO0ywK3ZS37nzUA&lib=MnQYBkRsDbv4uLRxNoSIgA-aoJlzzZ8rm";

export default async function handler(request, response) {
    try {
        const upstream = await fetch(GOOGLE_SCRIPT_URL, {
            headers: { Accept: "application/json" },
            redirect: "follow",
        });

        if (!upstream.ok) {
            return response.status(upstream.status).json({
                error: "Não foi possível carregar os produtos da planilha.",
            });
        }

        const data = await upstream.json();
        response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
        return response.status(200).json(data);
    } catch (error) {
        return response.status(500).json({
            error: error.message || "Erro ao buscar produtos.",
        });
    }
}
