const url = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiWZu-jpb9Cu1v0fimD4TAzS-LPdNqGYTaY7Q5gQ95Gk_UVRU0s3fCb5BjseDNusVj0nGZoUTy7ejp-RvTB8prPRLIO-hD71oUE2kiDeSeOoUHCJmKWI9flKqtQvpCzHEcQWnSm--FexvVtielgt5Sxop-M7LUY1-ko-Kl1rfzpFMC-S9C2WBQXDJ8U0bPI88A88PR_LHeuXaS4DWPnO-pUqpG5YUKie3vVr9id7M4pYpEm1-Es02txq_CLFQ7Lq_n3xE6R8WTz9UevO0ywK3ZS37nzUA&lib=MnQYBkRsDbv4uLRxNoSIgA-aoJlzzZ8rm";
const numeroWhatsApp = "5546920001218";
var Vinhos = [];
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const itemsPerPage = 12; // Number of items per page
let currentPage = 1; // Current page number

// Função para inicializar quando o documento estiver pronto
$(document).ready(function() {
    // Carrega o carrinho do localStorage se existir
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
        atualizarContador();
    }
    // Carrega os produtos
    carregarProdutos();
});

function atualizarContador() {
    document.getElementById('carrinhoContador').textContent = carrinho.length;
}

function carregarProdutos() {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            Vinhos = data.map(produto => ({
                descricao: produto.Descrição || "",
                nome: produto["Nome do Vinho"] || "",
                imagem: produto["Link Imagem"] && produto["Link Imagem"].trim() !== '' ? produto["Link Imagem"] : 'assets/img/semfoto.jpeg', // Default image if empty
                preco: produto["Preço"] || 0 // Use 0 if not available
            }));
            renderPage(currentPage);
        })
        .catch(error => {
            console.error("Erro:", error);

            // Mensagem de erro simplificada
            document.getElementById("produtos").innerHTML = `
      <div style="grid-column:1/-1; text-align:center; color:red">
        Erro ao carregar produtos. Recarregue a página.
      </div>
    `;

        });
}

function renderPage(page) {
    const container = document.getElementById("produtos");
    container.innerHTML = '';
    let produtosHTML = '';

    // Calculate the start and end index for the current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = Vinhos.slice(startIndex, endIndex);

    paginatedItems.forEach((produto, index) => {
        produtosHTML += `
            <div class="produto">
                <h3>${produto.nome}</h3>
                <img src="${produto.imagem}" alt="${produto.nome}" style="width:100%; height:auto;" />
                <p><strong>R$ ${Number(produto.preco).toFixed(2)}</strong></p>
                <button class="botao" onclick='adicionarCarrinho(${index})'>Adicionar ao carrinho</button>
            </div>
        `;
    });

    container.innerHTML = produtosHTML;
    renderPagination();
}

function renderPagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(Vinhos.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            renderPage(currentPage);
        };
        paginationContainer.appendChild(pageButton);
    }
}

function adicionarCarrinho(ind) {
    let produto = Vinhos[ind]
    produto.quantidade = 1;
    carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContador();
    alert(`${produto.nome} adicionado ao carrinho!`);
}

function enviarCarrinho() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "Olá! Gostaria de comprar:\n\n";
    let total = 0;

    carrinho.forEach(item => {
        mensagem += `- ${item.nome} (R$ ${Number(item.preco).toFixed(2)})\n`;
        total += Number(item.preco);
    });

    mensagem += `\nTotal: R$ ${total.toFixed(2)}`;

    const urlWhats = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhats, '_blank');

    // Limpa o carrinho após envio
    carrinho = [];
    localStorage.removeItem('carrinho');
    atualizarContador();
}