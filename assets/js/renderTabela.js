function renderPage(page) {
    const table = document.getElementById("produtosTabela");
    const tableBody = document.getElementById("produtosTabelaBody");
    tableBody.innerHTML = '';


    table.style.display = 'table';
    VinhosFiltados.forEach((produto) => {
        tableBody.innerHTML += `
            <tr class="texto-tabela">
                <td>${produto.imagem !="assets/img/semfoto.jpeg" ? `<button style="border-radius: 10px;" onclick="montadetalhes(${produto.id})"><i class="fas fa-camera"></i></button>`: ""}</td>
              <td style="white-space: nowrap;text-align:start;font-weight: bolder;"  onclick="document.getElementById('quantidade-${produto.id}').focus();">${produto.nome}</td>
                <td style="font-weight: bolder;background:#fff1ce;white-space: nowrap;">${formataNumeros(produto.preco)}</td>
                <td>`+
                //    ` <button onclick="alterarQuantidade(${produto.id}, -1)" style="color: red; border-radius: 50%; width: 10px; height: 10px; border: none; padding:0; background:none;">
                //         <i class="fas fa-minus"></i>
                //     </button>`+
                   ` <input class="input-qtde" id="quantidade-${produto.id}"  onblur="adicionarCarrinho(${produto.id},true)" name="quantidade-${produto.id}" type="number" value="" max="99" min="0" onkeydown="if(event.key === 'Enter') adicionarCarrinho(${produto.id})" />`+
                //    ` <button onclick="alterarQuantidade(${produto.id}, 1)" style="color: green; border-radius: 50%; width: 10px; height: 10px; border: none;padding:0; background:none">
                //         <i class="fas fa-plus"></i>
                //     </button>`+
                    `<button class="botao-small" style="background: none;border-radius: 5px;margin-left:5px;">
                        <div id="adicionar-${produto.id}">
                           
                        </div>
                        <span  id="adicionado-${produto.id}" style="display: none;color: green;">
                            OK
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
