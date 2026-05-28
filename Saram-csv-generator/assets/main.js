// Seleciona os elementos do DOM
let saram = document.getElementById("saram");
let designacao = document.getElementById("designacao")
let local = document.getElementById("local")
let data = document.getElementById("data")
let btn = document.querySelector(".btn")
let copiarBtn = document.querySelector(".copiar")
let resultado = document.getElementById("resultado")
let mensagem = document.getElementById("mensagem")



// Função para formatar o CSV a partir dos valores dos inputs
function gerarCSV(sarams, designacao, local, data) {
    if (!Array.isArray(sarams) || sarams.length === 0) {
        return ""
    }
    const colunas = ["saram", "designacao", "local", "data"];
    const linhas = [colunas.join(";")];

    for (const saram of sarams) {
        linhas.push([saram, designacao, local, data].join(";"));
    }

    return linhas.join("\n");
}


// Adiciona um evento de clique ao botão para gerar o CSV
btn.addEventListener("click", () => {

    // validação
    if (
        saram.value === "" ||
        designacao.value === "" ||
        local.value === "" ||
        data.value === ""
    ) {

        alert(
            "Todos os campos precisam ser preenchidos"
        );

        return;
    }

    const saramValor = saram.value.split(',').map(item => item.trim());
    const designacaoValor = designacao.value;
    const localValor = local.value;
    const dataValor = new Date(data.value)
        .toLocaleDateString("pt-BR");

    const csv = gerarCSV(saramValor, designacaoValor, localValor, dataValor);
    resultado.textContent = csv;

    //Limpa os inputs após gerar o CSV
    saram.value = "";
    designacao.value = "";
    local.value = "";
    data.value = "";
});

// Adiciona um evento de clique ao botão para copiar o CSV
copiarBtn.addEventListener("click", () => {
    const csv = resultado.textContent;
    navigator.clipboard.writeText(csv);
});


// Adiciona um evento de clique ao botão para copiar o CSV com validação
copiarBtn.addEventListener("click", () => {
    if (resultado.textContent === "") {
        mensagem.textContent = "Nenhum CSV gerado para copiar.";
        mensagem.style.color = "#ff4d4d";
    } else {
        navigator.clipboard.writeText(resultado.textContent);
        mensagem.textContent = "CSV copiado para a área de transferência!";
        mensagem.style.color = "#4CAF50";
    }
});