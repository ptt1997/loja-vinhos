
function renderPage(page) {
    const table = document.getElementById("produtosTabela");
    const tableBody = document.getElementById("produtosTabelaBody");
    tableBody.innerHTML = '';


    table.style.display = 'table';
    VinhosFiltados.forEach((produto) => {
        tableBody.innerHTML += `
            <tr class="texto-tabela">
                <td>${produto.imagem !="assets/img/semfoto.jpeg" ? `<button style="border-radius: 10px;" onclick="montadetalhes(${produto.id})"><i class="fas fa-camera"></i></button>`: ""}</td>
                <td>${produto.nome}</td>
                <td>R$ ${formataNumeros(produto.preco)}</td>
                <td>
                    <button onclick="alterarQuantidade(${produto.id}, -1)" style="color: red; border-radius: 50%; width: 15px; height: 15px; border: none; padding:0; background:none;">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input class="input-qtde" id="quantidade-${produto.id}" name="quantidade-${produto.id}" type="number" value="0" max="99" min="0"  />
                    <button onclick="alterarQuantidade(${produto.id}, 1)" style="color: green; border-radius: 50%; width: 15px; height: 15px; border: none;padding:0; background:none">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="botao-small" onclick='adicionarCarrinho(${produto.id})'>
                        <div id="adicionar-${produto.id}">
                            <i class="fas fa-cart-shopping"></i>
                        </div>
                        <span  id="adicionado-${produto.id}" style="display: none;color: green;">
                            <i class="fas fa-check"></i>
                        </span>
                    </button>
                </td>
            </tr>
        `;
    });
    

    if (VinhosFiltados.length === 0) {
        tableBody.innerHTML = '<p>Nenhum produto encontrado.</p>'; // Display message if no products found
    }
    renderPagination();
}
