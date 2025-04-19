const url = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiWZu-jpb9Cu1v0fimD4TAzS-LPdNqGYTaY7Q5gQ95Gk_UVRU0s3fCb5BjseDNusVj0nGZoUTy7ejp-RvTB8prPRLIO-hD71oUE2kiDeSeOoUHCJmKWI9flKqtQvpCzHEcQWnSm--FexvVtielgt5Sxop-M7LUY1-ko-Kl1rfzpFMC-S9C2WBQXDJ8U0bPI88A88PR_LHeuXaS4DWPnO-pUqpG5YUKie3vVr9id7M4pYpEm1-Es02txq_CLFQ7Lq_n3xE6R8WTz9UevO0ywK3ZS37nzUA&lib=MnQYBkRsDbv4uLRxNoSIgA-aoJlzzZ8rm";
const numeroWhatsApp = "5546920001218";
var Vinhos = [];
var VinhosFiltados = [];
var marcas = [];
var maiorValor = 0;
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
    document.getElementById("loadingMessage").style.display = "block";

    fetch(url)
        .then(res => res.json())
        .then(data => {
            Vinhos = data.map((produto,index) => ({
                id:index,
                descricao: produto.Descrição || "",
                nome: produto["Nome do Vinho"] || "",
                marca: produto.Marca || "",
                imagem: produto["Link Imagem"] && produto["Link Imagem"].trim() !== '' ? produto["Link Imagem"] : 'assets/img/semfoto.jpeg',
                preco: produto.Preço || 0 // Use 0 if not available
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

function renderPage(page) {
    const container = document.getElementById("produtos");
    container.innerHTML = '';
    let produtosHTML = '';

    // Calculate the start and end index for the current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = VinhosFiltados.slice(startIndex, endIndex);

    paginatedItems.forEach((produto) => {
        produtosHTML += `
            <div class="produto">
                <h3>${produto.nome}</h3>
                <img src="${produto.imagem}" alt="${produto.nome}" style="width:100%; height:auto; cursor: pointer;" onclick="montadetalhes(${produto.id})"/>
                <p class="descricao">${(produto.descricao)}</p>
                <p><strong>Valor unitário: R$ ${formataNumeros(produto.preco)}</strong></p>
                <div>
                    <label for="quantidade-${produto.id}" >Quantidade: </label>
                    <input id="quantidade-${produto.id}" name="quantidade-${produto.id}" type="number" max="99" min="0"  />
                </div>
                <button class="botao" onclick='adicionarCarrinho(${produto.id})'>Adicionar ao carrinho</button>
            </div>
        `;
    });

    if (VinhosFiltados.length === 0) {
        container.innerHTML = '<p>Nenhum produto encontrado.</p>'; // Display message if no products found
    }else{
        container.innerHTML = produtosHTML;
    }
    renderPagination();
}

function renderPagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(VinhosFiltados.length / itemsPerPage);

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
    produto.quantidade = Number($("#quantidade-" + ind).val());
    if (!produto.quantidade || produto.quantidade <= 0){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Informe uma quantidade!",
          });
        return
    }
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
function mostrarCarrinho() {
    const cartMenu = document.getElementById("cartMenu");
    const cartItemsContainer = document.getElementById("cartItems");
    const totalValueElement = document.getElementById("totalValue");

    // Clear previous items
    cartItemsContainer.innerHTML = '';
    let total = 0;

    // Loop through the cart and create HTML for each item
    carrinho.forEach((item, index) => {
        const itemTotal = item.preco * item.quantidade;
        total += itemTotal;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}" />
                <div>
                    <strong>${item.nome}</strong><br>
                    Quantidade: ${item.quantidade}<br>
                    Valor: R$ ${formataNumeros(itemTotal)}
                </div>
                <button onclick="removerDoCarrinho(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    // Update total value
    totalValueElement.textContent = formataNumeros(total);

    // Show the cart menu
    cartMenu.style.right = '0';
    document.addEventListener('click', function closeCartMenu(event) {
        if (!cartMenu.contains(event.target) && !document.querySelector('.carrinho-contador').contains(event.target)) {
            fecharCarrinho();
            document.removeEventListener('click', closeCartMenu); // Remove the event listener after closing
        }
    });
}

function fecharCarrinho() {
    const cartMenu = document.getElementById("cartMenu");
    cartMenu.style.right = '-300px'; // Hide the cart menu
}

function removerDoCarrinho(index) {
    // Remove item from the cart
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContador();
    mostrarCarrinho(); // Refresh the cart display
}

async function carregaFiltros() {
    Vinhos.forEach((item) => {
        if (item.marca !=""){
            const intMarcas = marcas.find((x)=> x===item.marca);
            if (!intMarcas){
                marcas.push(item.marca);
            }
        }
        if (item.preco > maiorValor){
            maiorValor= item.preco;
        }
    });
   
    document.getElementById("priceSlider").max = maiorValor;
    document.getElementById("priceSlider").value = maiorValor; // Set default max value
    document.getElementById("minPrice").value = 0; // Set default min value
    document.getElementById("maxPrice").value = maiorValor; // Set default max value
    document.getElementById("priceRangeValue").textContent = `0 - ${maiorValor}`; // Display the initial range
}

function filtra() {
    const pesquisa = document.getElementById("searchInput").value.toLowerCase();
    const marcaSelect = document.getElementById("marcaSelect");
    const selectedMarcas = Array.from(marcaSelect.selectedOptions).map(option => option.value);
    const minPrice = Number(document.getElementById("minPrice").value.replace('R$', '').replace('.', '').replace(',', '.')) || 0;
    const maxPrice = Number(document.getElementById("maxPrice").value.replace('R$', '').replace('.', '').replace(',', '.')) || Infinity;

    VinhosFiltados = Vinhos.filter(item => {
        let insere = true;

        if (pesquisa) {
            insere = insere && item.nome.toLowerCase().includes(pesquisa);
        }

        if (selectedMarcas.length > 0) {
            insere = insere && selectedMarcas.includes(item.marca);
        }

        insere = insere && (item.preco >= minPrice && item.preco <= maxPrice);

        return insere;
    });
    renderPage(1);
}
function mostrarFiltros() {
    const filterModal = document.getElementById("filterModal");
    filterModal.style.display = "block";
    carregarFiltros(); // Load brands into the select
}

function fecharFiltros() {
    const filterModal = document.getElementById("filterModal");
    filterModal.style.display = "none";
    filtra();
}
function carregarFiltros() {
    const marcaSelect = document.getElementById("marcaSelect");
    marcaSelect.innerHTML = ''; // Clear existing options

    // Populate the select with unique brands
    marcas.forEach(marca => {
        const option = document.createElement("option");
        option.value = marca;
        option.textContent = marca;
        marcaSelect.appendChild(option);
    });
}
function atualizaSliderMin() {
    const minPriceInput = document.getElementById("minPrice");
    const slider = document.getElementById("priceSlider");
    const minValue = Number(minPriceInput.value.replace('R$', '').replace('.', '').replace(',', '.')) || 0;
    slider.value = Math.max(minValue, 0); // Ensure the slider does not go below 0
    filtra(); // Reapply filters
}

function atualizaSliderMax() {
    const maxPriceInput = document.getElementById("maxPrice");
    const slider = document.getElementById("priceSlider");
    const maxValue = Number(maxPriceInput.value.replace('R$', '').replace('.', '').replace(',', '.')) || 10000;
    slider.value = Math.min(maxValue, slider.max); // Ensure the slider does not exceed max
    filtra(); // Reapply filters
}

function atualizaPrecoDisplay() {
    const slider = document.getElementById("priceSlider");
    const priceRangeValue = document.getElementById("priceRangeValue");
    priceRangeValue.textContent = `0 - ${slider.value}`; // Update the displayed range
}