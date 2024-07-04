let jogadores = [];
let selecoes = [];
let jogadoresSorteados = [];
let selecoesSorteadas = [];
let resultados = [];

function adicionarJogadores() {
  const jogadorInput = document.getElementById("jogadorInput");
  const novosJogadores = jogadorInput.value
    .split(",")
    .map((jogador) => jogador.trim())
    .filter((jogador) => jogador);
  jogadores = [...jogadores, ...novosJogadores];
  atualizarLista("jogadoresList", jogadores);
  jogadorInput.value = "";
}

document
  .getElementById("jogadorInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      adicionarJogadores();
    }
  });

function adicionarSelecoes() {
  const selecaoInput = document.getElementById("selecaoInput");
  const novasSelecoes = selecaoInput.value
    .split(",")
    .map((selecao) => selecao.trim())
    .filter((selecao) => selecao);
  selecoes = [...selecoes, ...novasSelecoes];
  atualizarLista("selecoesList", selecoes);
  selecaoInput.value = "";
}

document
  .getElementById("selecaoInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      adicionarSelecoes();
    }
  });

function atualizarLista(listId, items) {
  const lista = document.getElementById(listId);
  lista.innerHTML = "";
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.onclick = () => removerItem(listId, index);

    removeBtn.textContent = "";

    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash");

    removeBtn.appendChild(trashIcon);

    li.appendChild(removeBtn);
    lista.appendChild(li);
  });
}

function removerItem(listId, index) {
  if (listId === "jogadoresList") {
    jogadores.splice(index, 1);
    atualizarLista("jogadoresList", jogadores);
  } else {
    selecoes.splice(index, 1);
    atualizarLista("selecoesList", selecoes);
  }
}

function mostrarLoading() {
  const loadingOverlay = document.createElement("div");
  loadingOverlay.classList.add("loading-overlay");
  loadingOverlay.innerHTML =
    '<img src="img/footballw.png" class="ball-loading fa-spin"/>';
  document.body.appendChild(loadingOverlay);
}

function esconderLoading() {
  const loadingOverlay = document.querySelector(".loading-overlay");
  if (loadingOverlay) {
    loadingOverlay.remove();
  }
}

async function sortearComLoading(funcaoSorteio) {
  mostrarLoading();
  await new Promise((resolve) => setTimeout(resolve, 5000));
  funcaoSorteio();
  esconderLoading();
}

async function sortearJogador() {
  if (jogadores.length === 0) {
    alert("Adicione pelo menos um jogador antes de realizar o sorteio.");
    return;
  }

  if (jogadoresSorteados.length === jogadores.length) {
    alert("Todos os jogadores já foram sorteados. Reinicie o sorteio.");
    return;
  }

  await sortearComLoading(() => {
    let jogadorSorteado;
    do {
      jogadorSorteado = jogadores[Math.floor(Math.random() * jogadores.length)];
    } while (jogadoresSorteados.includes(jogadorSorteado));

    jogadoresSorteados.push(jogadorSorteado);

    if (
      resultados.length > 0 &&
      resultados[resultados.length - 1].jogador === null
    ) {
      resultados[resultados.length - 1].jogador = jogadorSorteado;
    } else {
      resultados.push({ jogador: jogadorSorteado, selecao: null });
    }

    atualizarTabela();
  });
}

async function sortearSelecao() {
  if (selecoes.length === 0) {
    alert("Adicione pelo menos uma seleção antes de realizar o sorteio.");
    return;
  }

  if (selecoesSorteadas.length === selecoes.length) {
    alert("Todas as seleções já foram sorteadas. Reinicie o sorteio.");
    return;
  }

  await sortearComLoading(() => {
    let selecaoSorteada;
    do {
      selecaoSorteada = selecoes[Math.floor(Math.random() * selecoes.length)];
    } while (selecoesSorteadas.includes(selecaoSorteada));

    selecoesSorteadas.push(selecaoSorteada);

    if (
      resultados.length > 0 &&
      resultados[resultados.length - 1].selecao === null
    ) {
      resultados[resultados.length - 1].selecao = selecaoSorteada;
    } else {
      resultados.push({ jogador: null, selecao: selecaoSorteada });
    }

    atualizarTabela();
  });
}

function atualizarTabela() {
  const tabela = document.getElementById("resultadoTable");
  const corpo = document.getElementById("resultadoBody");

  corpo.innerHTML = "";

  resultados.forEach((resultado) => {
    const tr = document.createElement("tr");
    const tdJogador = document.createElement("td");
    const tdSelecao = document.createElement("td");

    tdJogador.textContent = resultado.jogador || "-";
    tdSelecao.textContent = resultado.selecao || "-";

    tr.appendChild(tdJogador);
    tr.appendChild(tdSelecao);
    corpo.appendChild(tr);
  });

  tabela.style.display = "table";
}

function reiniciarSorteio() {
  if (resultados.length > 0) {
    const confirmacao = confirm("Você realmente deseja reiniciar o sorteio?");
    if (confirmacao) {
      jogadoresSorteados = [];
      selecoesSorteadas = [];
      resultados = [];
      document.getElementById("resultadoBody").innerHTML = "";
      document.getElementById("resultadoTable").style.display = "none";
    }
  } else {
    return alert("O sorteio ainda não foi iniciado.");
  }
}
