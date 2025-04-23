
function renderPage(page) {
    const container = document.getElementById("produtos");

    container.innerHTML = '';

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = VinhosFiltados.slice(startIndex, endIndex);


    container.style.display = 'grid';
    paginatedItems.forEach((produto) => {
        container.innerHTML += `
        <div class="produto">
            <h3 class="titulo-card">${produto.nome}</h3>
            <img src="${produto.imagem}" alt="${produto.nome}" class="imagensCard" onclick="montadetalhes(${produto.id})"/>
            <p class="descricao">${(produto.descricao)}</p>
            <p><strong>Valor unitário: R$ ${formataNumeros(produto.preco)}</strong></p>
            <div>
                <label for="quantidade-${produto.id}">Quantidade: </label>
                <button onclick="alterarQuantidade(${produto.id}, -1)" style="color: red; border-radius: 50%; width: 30px; height: 30px; border: none;">
                    <i class="fas fa-minus"></i>
                </button>
                <input id="quantidade-${produto.id}" name="quantidade-${produto.id}" type="number" value="0" max="99" min="0" style="width: 50px; text-align: center;" />
                <button onclick="alterarQuantidade(${produto.id}, 1)" style="color: green; border-radius: 50%; width: 30px; height: 30px; border: none;">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button class="botao" onclick='adicionarCarrinho(${produto.id})'>
                <div id="adicionar-${produto.id}">
                    Adicionar ao carrinho
                </div>
                <span class="check-message" id="adicionado-${produto.id}" style="display: none;">
                    <i class="fas fa-check"></i> Adicionado!
                </span>
            </button>
        </div>
        `;
    });
    
    if (VinhosFiltados.length === 0) {
        container.innerHTML = '<p>Nenhum produto encontrado.</p>'; // Display message if no products found
        table.style.display = 'none';
    }
    renderPagination();
}
