const url = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiWZu-jpb9Cu1v0fimD4TAzS-LPdNqGYTaY7Q5gQ95Gk_UVRU0s3fCb5BjseDNusVj0nGZoUTy7ejp-RvTB8prPRLIO-hD71oUE2kiDeSeOoUHCJmKWI9flKqtQvpCzHEcQWnSm--FexvVtielgt5Sxop-M7LUY1-ko-Kl1rfzpFMC-S9C2WBQXDJ8U0bPI88A88PR_LHeuXaS4DWPnO-pUqpG5YUKie3vVr9id7M4pYpEm1-Es02txq_CLFQ7Lq_n3xE6R8WTz9UevO0ywK3ZS37nzUA&lib=MnQYBkRsDbv4uLRxNoSIgA-aoJlzzZ8rm";
const numeroWhatsApp = "5546920001218";
var Vinhos = [];
var VinhosTabela = [];
var VinhosFiltados = [];
var marcas = [];
var maiorValor = 0;
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const itemsPerPage = 20; // Number of items per page
let currentPage = 1; // Current page number
let isfiltro = false;
let totalCarrinho=0;
let totalGarrafas=0;


$(document).ready(function() {
    // Load the cart from localStorage if it exists and is not expired
    loadCart();
    // Carrega os produtos
    carregarProdutos();
});

function atualizarContador() {
    totalGarrafas = 0;
    carrinho?.forEach(item => {
        totalGarrafas += item.quantidade; // Update total
    });
    document.getElementById('carrinhoContador').textContent = totalGarrafas;
}

async function carregarProdutos() {
    // const correctPassword = 'pttViado'; 

    // let tentativas = 0;
    // let erroDemais = false;
    // // Show password prompt using SweetAlert2
    // let result = await Swal.fire({
    //     title: 'Digite a Senha para acessar o site',
    //     input: 'password',
    //     inputAttributes: {
    //         autocapitalize: 'off'
    //     },
    //     showCancelButton: false,
    //     confirmButtonText: 'Entrar',
    //     showLoaderOnConfirm: true,
    //     preConfirm: (password) => {
    //         if (password !== correctPassword) {
    //             if (tentativas > 10){
    //                 erroDemais= true;
    //                 return true;
    //             }
    //             Swal.showValidationMessage('Senha incorreta!');
    //             tentativas++
    //             return false;
    //         }
    //         return true;
    //     },
    //     allowOutsideClick: () => !Swal.isLoading()
    // })
    // if (!result.isConfirmed || erroDemais) {
    //     document.body.innerHTML = `
    //     <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
    //         <img src="https://media.tenor.com/6t9GqNTLAR4AAAAj/ilisinka.gif" alt="Access Denied" style="max-width: 100%; height: auto;">
    //         <img src="https://media1.tenor.com/m/InzuVTz0zM8AAAAd/tralalelo-tralala-bombardiro-crocodilo.gif" alt="Access Denied" style="max-width: 100%; height: auto;">
    //     </div>
    // `;
    //     return;
    // }

    document.getElementById("loadingMessage").style.display = "flex";

    fetch(url)
        .then(res => res.json())
        .then(data => {
            VinhosTabela=data;
            console.log(data);
            Vinhos = data.map((produto,index) => ({
                id:index,
                descricao: produto.Descrição || "",
                nome: produto["Nome do Vinho"] || "",
                marca: produto.Marca || "",
                imagem: produto["Link Imagem"] && produto["Link Imagem"].trim() !== '' ? produto["Link Imagem"] : 'assets/img/semfoto.jpeg',
                preco: produto.Preço || "0", // Use 0 if not available
                precoNum: Number(produto.Preço.replace('R$', '').replace('.', '').replace(',', '.')) || 0 // Use 0 if not available
            }));
            VinhosFiltados=Vinhos;
            renderPage(currentPage);
            carregaFiltros();
        })
        .catch(error => {
            console.error("Erro:", error);

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Não foi possivel carregar nossos produtos!",
              });

        })
        .finally(()=>{
            document.getElementById("loadingMessage").style.display = "none";
        })
}


function alterarQuantidade(produtoId, delta) {
    const input = document.getElementById(`quantidade-${produtoId}`);
    let quantidade = Number(input.value) || 0; // Get current quantity or default to 0
    quantidade += delta; // Adjust quantity by delta

    // Ensure quantity stays within bounds
    if (quantidade < 0) quantidade = 0;

    input.value = quantidade; // Update the input field
}

function renderPagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(VinhosFiltados.length / itemsPerPage);



    if (currentPage !=1){
        // Botão de página anterior
        const prevButton = document.createElement("button");
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>'; // Ícone de flecha para a esquerda
        prevButton.disabled = currentPage === 1; // Desabilita se for a primeira página
        prevButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
                renderPagination();
            }
        };
        paginationContainer.appendChild(prevButton);
        // Botão da última página
        const lastButton = document.createElement("button");
        lastButton.textContent = 1; // Última página
        lastButton.onclick = () => {
            currentPage = 1;
            renderPage(currentPage);
            renderPagination();
        };
        paginationContainer.appendChild(lastButton);
    }
    if (currentPage > 2){
        const lastPageButton = document.createElement("button");
        lastPageButton.textContent = currentPage-1; // Exibe o número da página atual
        lastPageButton.onclick = () => {
            currentPage = currentPage-1;
            renderPage(currentPage-1);
            renderPagination();
        };
        paginationContainer.appendChild(lastPageButton);
    }
    // Botão da página atual
    const currentPageButton = document.createElement("button");
    currentPageButton.textContent = currentPage; // Exibe o número da página atual
    currentPageButton.disabled = true; // Desabilita o botão
    currentPageButton.className = 'current-page-button'; // Adiciona a classe para estilização
    paginationContainer.appendChild(currentPageButton);

    if (currentPage < totalPages-1){
        const nextPageButton = document.createElement("button");
        nextPageButton.textContent = "..."; // Exibe o número da página atual
        nextPageButton.style.cursor="default"
        paginationContainer.appendChild(nextPageButton);
    }

    if (currentPage !=totalPages){
        // Botão da última página
        const lastButton = document.createElement("button");
        lastButton.textContent = totalPages; // Última página
        lastButton.onclick = () => {
            currentPage = totalPages;
            renderPage(currentPage);
            renderPagination();
        };
        paginationContainer.appendChild(lastButton);
        // Botão de próxima página
        const nextButton = document.createElement("button");
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>'; // Ícone de flecha para a direita
        nextButton.disabled = currentPage === totalPages; // Desabilita se for a última página
        nextButton.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
                renderPagination();
            }
        };
        paginationContainer.appendChild(nextButton);
    }

}

function saveCart() {
    const cartData = {
        items: carrinho,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('carrinho', JSON.stringify(cartData));
    atualizarContador();
}

function loadCart() {
    const cartData = JSON.parse(localStorage.getItem('carrinho'));
    if (cartData) {
        const currentTime = new Date().getTime();
        const tenHoursInMilliseconds = 10 * 60 * 60 * 1000;
        if (currentTime - cartData.timestamp < tenHoursInMilliseconds) {
            carrinho = cartData.items;
        } else {
            localStorage.removeItem('carrinho');
            carrinho = [];
        }
    }
    atualizarContador();
}

function adicionarCarrinho(ind,blur = false) {
    let produto = Vinhos[ind];
    produto.quantidade = Number($("#quantidade-" + ind).val());
    if (blur &&  produto.quantidade <= 0) return
    if ((!produto.quantidade || produto.quantidade <= 0)) {
        produto.quantidade = 1
        $("#quantidade-" + ind).val(1);
    }
    const existingProductIndex = carrinho.findIndex(item => item.id === produto.id);

    if (existingProductIndex !== -1) {
        carrinho[existingProductIndex].quantidade = produto.quantidade;
    } else {
        carrinho.push(produto);
    }
    saveCart();

    const button =  document.getElementById("adicionar-"+ind);
    // Oculta o botão e mostra a mensagem de adicionado
    button.style.display = 'none'; // Oculta o botão
    const checkMessage = document.getElementById("adicionado-"+ind);
    checkMessage.style.display = 'block'; // Mostra a mensagem de adicionado

    // Remove a mensagem após um tempo
    setTimeout(() => {
        checkMessage.style.display = 'none'; // Oculta a mensagem
        button.style.display = 'inline-block'; // Mostra o botão novamente
    }, 2000); // Duração da exibição da mensagem
}
function enviaMensagemVazia(){
    const urlWhats = `https://wa.me/${numeroWhatsApp}`;
    window.open(urlWhats, '_blank');
}
function enviarCarrinho(user) {

    carrinho.sort((a, b) => a.nome.localeCompare(b.nome));

    let mensagem = `Olá, sou ${user.nome}!\nGostaria de comprar:\n\n`;
    let total = 0;
    let totalGarrafas = 0;
    carrinho.forEach(item => {
        const itemTotal = item.precoNum * item.quantidade; // Calculate total for each item
        mensagem += `${item.quantidade} - ${item.nome}\n`; // Format message
        total += itemTotal; // Update total
        totalGarrafas += item.quantidade; // Update total
    });

    mensagem += `\nTotal de Garrafas: ${totalGarrafas.toFixed(0)}\n`; // Add total and address to message
    mensagem += `Total do Pedido: R$ ${total.toFixed(2)}\n\n`; // Add total and address to message
    mensagem += `Telefone: ${user.Tel}\n`;
    mensagem += `Obs: ${user.Obs}\n`;


    const urlWhats = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhats, '_blank');



    // Limpa o carrinho após envio
    carrinho = [];
    localStorage.removeItem('carrinho');
    atualizarContador();
}
function formataNumeros(val) {

    const number = Number(val);

    if (isNaN(number)) {
        return val; 
    }

    return number.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
function montadetalhes(index){
    let produto = Vinhos[index]
    Swal.fire({
        title: produto.nome,
        text: produto.descricao,
        imageUrl: produto.imagem,
        imageAlt: "Custom image",
        confirmButtonText: "Fechar"
      });
}
function alterarQuantidadeCarrinho(produtoId,index, delta) {
    // Find the product in the cart
    const produto = carrinho.find(item => item.id === produtoId);
    if (produto) {
        // Update the quantity
        produto.quantidade += delta;

        // Ensure quantity stays within bounds
        if (produto.quantidade <= 0){
            removerDoCarrinho(index);
            produto.quantidade = 0;
        } 
        carrinho[index]=produto
        // Update the cart in localStorage
        saveCart();

        // Refresh the cart display
        const qtdeIn = document.getElementById("carrinhoqtd-"+produtoId);
        qtdeIn.innerHTML = 'Quantidade: '+produto.quantidade;
        const qtdeTotaIn = document.getElementById("carrinhototalitem-"+produtoId);
        qtdeTotaIn.innerHTML ="Valor: R$ "+formataNumeros(produto.precoNum * produto.quantidade);
        const totalValueElement = document.getElementById("totalValue");
        const totalGarrafasElement = document.getElementById("totalValueGar");
        totalCarrinho+= delta*(produto.precoNum);
        totalGarrafas+=delta;
        totalValueElement.textContent = formataNumeros(totalCarrinho);
        totalGarrafasElement.textContent = totalGarrafas
    }
    atualizarContador();
}
function alteraQtdeCar(produtoId,index){
    setTimeout(() => {
    const qtdeNova = Number(document.getElementById("quantidadecar-"+produtoId).value);
    const produto = carrinho.find(item => item.id === produtoId);
    if (produto) {
        let delta = qtdeNova-produto.quantidade;
        // Update the quantity
        produto.quantidade = qtdeNova;
        // Ensure quantity stays within bounds
        if (produto.quantidade <= 0){
            removerDoCarrinho(index);
            produto.quantidade = 0;
            return;
        } 

        carrinho[index]=produto
        // Update the cart in localStorage
        saveCart();

        // Refresh the cart display
        const qtdeTotaIn = document.getElementById("carrinhototalitem-"+produtoId.toString());
        qtdeTotaIn.innerHTML ="R$ "+formataNumeros(produto.precoNum * produto.quantidade);
        const totalValueElement = document.getElementById("totalValue");
        const totalGarrafasElement = document.getElementById("totalValueGar");
        totalCarrinho+= delta*(produto.precoNum);
        totalGarrafas+=delta;
        totalValueElement.textContent = formataNumeros(totalCarrinho);
        totalGarrafasElement.textContent = totalGarrafas;
        atualizarContador();
    }
}, 100); // espera 100ms
}
function mostrarCarrinho() {
    const cartMenu = document.getElementById("cartMenu");
    const cartItemsContainer = document.getElementById("cartItems");
    const totalValueElement = document.getElementById("totalValue");
    const totalGarrafasElement = document.getElementById("totalValueGar");

    // Clear previous items
    cartItemsContainer.innerHTML = '';
    totalCarrinho = 0;
    totalGarrafas = 0;

    carrinho.forEach((item, index) => {
        const itemTotal = item.precoNum * item.quantidade;
        totalCarrinho += itemTotal;
        totalGarrafas += item.quantidade;
    });
    cartItemsContainer.innerHTML = `
    <table class="cart-items-table">
        <thead>
            <tr>
                <th>Nome</th>
                <th>Qtde</th>
                <th style="white-space: nowrap;text-align:start;">Valor Un.</th>
                <th>Valor</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            ${carrinho.map((item, index) =>                 
                `
                <tr class="texto-tabela-car">
                    <td  style="white-space: nowrap;text-align:start;"><strong>${item.nome}</strong></td>
                    <td >
                       <input onblur="alteraQtdeCar(${item.id},${index})" class="input-qtde" id="quantidadecar-${item.id}" name="quantidade-${item.id}" type="number" value="${item.quantidade}" max="99"  maxlength="2" min="0"  />
                    </td>
                    <td  style="white-space: nowrap;text-align:start;font-weight: bolder;" id="valorunitario-${item.id}">${formataNumeros(item.preco)}</td>
                    <td  style="white-space: nowrap;text-align:start;font-weight: bolder;" id="carrinhototalitem-${item.id}">R$ ${formataNumeros(item.precoNum * item.quantidade)}<div  id="carrinhototalitem-${item.id}"></div></td>
                    <td style="font-size:15px">
                        <button style="border:none;color:red;background:none;" onclick="removerDoCarrinho(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>
`;

    // Update total value
    totalValueElement.textContent = formataNumeros(totalCarrinho);
    totalGarrafasElement.textContent = totalGarrafas

    // Show the cart modal
    cartMenu.classList.add('show');
}

function fecharCarrinho() {
    const cartMenu = document.getElementById("cartMenu");
    cartMenu.classList.remove('show'); // Hide the cart modal
}
function mostraFiltro() {
    const cartMenu = document.getElementById("filtosList");
    if (isfiltro){
        cartMenu.style.left = '-300px'; // show the cart menu
    }else{
        cartMenu.style.left = '0'; // Hide the cart menu
    }
    isfiltro=!isfiltro
}

function removerDoCarrinho(index) {
    // Remove item from the cart
    const produto = carrinho[index];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContador();
    mostrarCarrinho(); // Refresh the cart display
    saveCart();
}

async function carregaFiltros() {
    Vinhos.forEach((item) => {
        if (item.marca !=""){
            const intMarcas = marcas.find((x)=> x===item.marca);
            if (!intMarcas){
                marcas.push(item.marca);
            }
        }
        if (item.precoNum > maiorValor){
            maiorValor= item.precoNum;
        }
    });
   
    document.getElementById("priceSlider").max = maiorValor;
    document.getElementById("priceSlider").value = maiorValor; // Set default max value
    document.getElementById("minPrice").value = 0; // Set default min value
    document.getElementById("maxPrice").value = maiorValor; // Set default max value
    document.getElementById("priceRangeValue").textContent = `0 - ${maiorValor}`; // Display the initial range
    carregarFiltros();
}

function filtra() {
    const pesquisa = document.getElementById("searchInput").value.toLowerCase();
    const selectedIndexMarcas = Array.from(document.querySelectorAll('input[id^="marcas-"]:checked')).map(input => {
        return parseInt(input.id.split('-')[1], 10); // Get the number after the hyphen
    });
    let selectedMarcas = [];
    selectedIndexMarcas.forEach((item) => {
       selectedMarcas.push(marcas[item])
    });
    const minPrice = Number(document.getElementById("minPrice").value.replace('R$', '').replace('.', '').replace(',', '.')) || 0;
    const maxPrice = Number(document.getElementById("maxPrice").value.replace('R$', '').replace('.', '').replace(',', '.')) || Infinity;

    VinhosFiltados = Vinhos.filter(item => {
        let insere = true;

        if (pesquisa && pesquisa !="") {
            insere = insere && item.nome.toLowerCase().includes(pesquisa);
        }

        // if (selectedMarcas.length > 0) {
        //     insere = insere && selectedMarcas.includes(item.marca);
        // }
        insere = insere && (item.precoNum >= minPrice && item.precoNum <= maxPrice);

        return insere;
    });
    renderPage(1,true);
}


function fecharFiltros() {
    const filterModal = document.getElementById("filterModal");
    filterModal.style.display = "none";
    filtra();
}
function carregarFiltros() {
    // const marcaCheckboxes = document.getElementById("marcaCheckboxes");
    // marcaCheckboxes.innerHTML = ''; // Clear existing checkboxes

    // // Populate the select with unique brands
    // marcas.forEach((marca,i) => {
    //     const label = document.createElement("label");
    //     label.innerHTML = `
    //         <input type="checkbox" id="marcas-${i}" onchange="filtra()"> ${marca}
    //     `;
    //     marcaCheckboxes.appendChild(label);
    // });
}
function atualizaSliderMin() {
    const minPriceInput = document.getElementById("minPrice");
    const slider = document.getElementById("priceSlider");
    const minValue = Number(minPriceInput.value.replace('R$', '').replace('.', '').replace(',', '.')) || 0;
    slider.value = Math.max(maiorValor, 0); // Ensure the slider does not go below 0
    filtra(); // Reapply filters
    atualizaPrecoDisplay(); // Update display
}

function atualizaSliderMax() {
    const slider = document.getElementById("priceSlider");
    slider.value = Math.min(maxValue, slider.max); // Ensure the slider does not exceed max
    filtra(); // Reapply filters
    atualizaPrecoDisplay(); // Update display
}

function atualizaPrecoDisplay() {
    const slider = document.getElementById("priceSlider");
    const priceRangeValue = document.getElementById("priceRangeValue");
    const minPriceInput = document.getElementById("minPrice");
    const maxPriceInput = document.getElementById("maxPrice");

    // Update the displayed range
    priceRangeValue.textContent = `${minPriceInput.value} - ${slider.value}`;
    maxPriceInput.value = slider.value; // Update max input when slider changes
    filtra();
}
function toggleFilterMenu() {
    const filterMenu = document.getElementById("filterMenu");
    filterMenu.classList.toggle("hidden");
}
function finalizarPedido(){
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    document.getElementById("orderModal").style.display = "block"; // Show the modal

}
function submitOrder(event) {
    if (event) {
        event.preventDefault();
    }
    let user ={
        nome: document.getElementById("userName").value,
        Tel:document.getElementById("userTel").value,
        Obs:document.getElementById("userObs").value,
    }


    // You can pass userName and userAddress to enviarCarrinho if needed
    enviarCarrinho(user); // Modify enviarCarrinho to accept these parameters
    fecharModal(); // Close the modal
}

function fecharModal() {
    document.getElementById("orderModal").style.display = "none"; // Hide the modal
}

function toggleView(vlr) {
    isCardView = vlr; // Alterna entre true e false
    renderPage(currentPage); // Re-renderiza a página atual
}
