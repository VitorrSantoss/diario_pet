// ================= CONFIG =================
const API_URL = "https://diario-pet-1.onrender.com/api/diario/diarios";
const PRODUTO_API_URL = "https://diario-pet-1.onrender.com/api/produto/produtos";

// ================= ELEMENTOS =================
// Diário
const form = document.getElementById("diario-form");
const idInput = document.getElementById("diario-id");
const tituloInput = document.getElementById("titulo");
const descricaoInput = document.getElementById("descricao");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const list = document.getElementById("diarios-list");
const status = document.getElementById("status");

// Produto
const produtoForm = document.getElementById("produto-form");
const produtoIdInput = document.getElementById("produto-id");
const produtoNomeInput = document.getElementById("produto-nome");
const produtoPrecoInput = document.getElementById("produto-preco");
const produtoDescricaoInput = document.getElementById("produto-descricao");
const produtoSubmitBtn = document.getElementById("produto-submit-btn");
const produtoCancelBtn = document.getElementById("produto-cancel-btn");
const produtosList = document.getElementById("produtos-list");
const produtoStatus = document.getElementById("produto-status");

// ================= STATUS =================
function setStatus(el, msg, isError = false) {
  el.textContent = msg;
  el.classList.toggle("error", isError);
}

// ================= DIÁRIOS =================
async function loadDiarios() {
  setStatus(status, "Carregando...");
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error();
    const data = await res.json();

    renderDiarios(data);
    setStatus(status, data.length ? `${data.length} registro(s)` : "");
  } catch {
    setStatus(status, "Erro ao carregar registros.", true);
  }
}

function renderDiarios(diarios) {
  list.innerHTML = "";

  if (!diarios.length) {
    list.innerHTML = `<li class="empty">Nenhum registro ainda.</li>`;
    return;
  }

  diarios.forEach((d) => {
    const li = document.createElement("li");
    li.className = "item";

    li.innerHTML = `
      <h3>${d.titulo || "(sem título)"}</h3>
      <p>${d.descricao || ""}</p>
      <div class="item-actions">
        <button class="edit">Editar</button>
        <button class="delete">Excluir</button>
      </div>
    `;

    li.querySelector(".edit").onclick = () => startEdit(d);
    li.querySelector(".delete").onclick = () => removeDiario(d._id);

    list.appendChild(li);
  });
}

function startEdit(d) {
  idInput.value = d._id;
  tituloInput.value = d.titulo || "";
  descricaoInput.value = d.descricao || "";

  submitBtn.textContent = "Atualizar";
  cancelBtn.hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  form.reset();
  idInput.value = "";
  submitBtn.textContent = "Salvar";
  cancelBtn.hidden = true;
}

async function removeDiario(id) {
  if (!confirm("Excluir este registro?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadDiarios();
  } catch {
    setStatus(status, "Erro ao excluir.", true);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    titulo: tituloInput.value.trim(),
    descricao: descricaoInput.value.trim(),
  };

  const id = idInput.value;

  try {
    await fetch(id ? `${API_URL}/${id}` : API_URL, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    resetForm();
    loadDiarios();
  } catch {
    setStatus(status, "Erro ao salvar.", true);
  }
});

cancelBtn.addEventListener("click", resetForm);

// ================= PRODUTOS =================
async function loadProdutos() {
  setStatus(produtoStatus, "Carregando...");
  try {
    const res = await fetch(PRODUTO_API_URL);
    if (!res.ok) throw new Error();
    const data = await res.json();

    renderProdutos(data);
    setStatus(produtoStatus, data.length ? `${data.length} produto(s)` : "");
  } catch {
    setStatus(produtoStatus, "Erro ao carregar produtos.", true);
  }
}

function renderProdutos(produtos) {
  produtosList.innerHTML = "";

  if (!produtos.length) {
    produtosList.innerHTML = `<li class="empty">Nenhum produto cadastrado.</li>`;
    return;
  }

  produtos.forEach((p) => {
    const li = document.createElement("li");
    li.className = "item";

    li.innerHTML = `
      <h3>${p.nome || "(sem nome)"}</h3>
      <p>💰 ${p.preco ? `R$ ${p.preco.toFixed(2)}` : ""}</p>
      <p>${p.descricao || ""}</p>
      <div class="item-actions">
        <button class="edit">Editar</button>
        <button class="delete">Excluir</button>
      </div>
    `;

    li.querySelector(".edit").onclick = () => startEditProduto(p);
    li.querySelector(".delete").onclick = () => removeProduto(p._id);

    produtosList.appendChild(li);
  });
}

function startEditProduto(p) {
  produtoIdInput.value = p._id;
  produtoNomeInput.value = p.nome || "";
  produtoPrecoInput.value = p.preco ?? "";
  produtoDescricaoInput.value = p.descricao || "";

  produtoSubmitBtn.textContent = "Atualizar";
  produtoCancelBtn.hidden = false;

  produtoForm.scrollIntoView({ behavior: "smooth" });
}

function resetProdutoForm() {
  produtoForm.reset();
  produtoIdInput.value = "";
  produtoSubmitBtn.textContent = "Salvar";
  produtoCancelBtn.hidden = true;
}

async function removeProduto(id) {
  if (!confirm("Excluir este produto?")) return;

  try {
    await fetch(`${PRODUTO_API_URL}/${id}`, { method: "DELETE" });
    loadProdutos();
  } catch {
    setStatus(produtoStatus, "Erro ao excluir.", true);
  }
}

produtoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    nome: produtoNomeInput.value.trim(),
    preco: parseFloat(produtoPrecoInput.value),
    descricao: produtoDescricaoInput.value.trim(),
  };

  const id = produtoIdInput.value;

  try {
    await fetch(id ? `${PRODUTO_API_URL}/${id}` : PRODUTO_API_URL, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    resetProdutoForm();
    loadProdutos();
  } catch {
    setStatus(produtoStatus, "Erro ao salvar.", true);
  }
});

produtoCancelBtn.addEventListener("click", resetProdutoForm);

// ================= INIT =================
loadDiarios();
loadProdutos();
