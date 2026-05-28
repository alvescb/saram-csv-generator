// Seleciona os elementos do DOM
let saram = document.getElementById("saram");
let designacao = document.getElementById("designacao")
let local = document.getElementById("local")
let data = document.getElementById("data")
let btn = document.querySelector(".btn")
let copiarBtn = document.querySelector(".copiar")
const limparBtn = document.querySelector(".limpar");
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

    // validação dos campos para garantir que todos estão preenchidos
    if (
        saram.value === "" ||
        designacao.value === "" ||
        local.value === "" ||
        data.value === ""
    ) {

        mensagem.textContent = "Todos os campos precisam ser preenchidos.";

        mensagem.style.color = "#ff4d4d";


        return;
    }
    const saramValor = saram.value.split(/[\s,]+/).filter(item => item !== '');

    // validação para garantir que o campo SARAM contenha apenas números
    if (saramValor.length === 0 || isNaN(saramValor.join(''))) {
        msg_saram.textContent = "O campo SARAM deve conter apenas números.";
        msg_saram.style.color = "#ff4d4d";
        mensagem.textContent = "";
        
        return;
        
    }

    const designacaoValor = designacao.value;
    const localValor = local.value;
    const dataValor = new Date(data.value)
        .toLocaleDateString("pt-BR");

    const csv = gerarCSV(saramValor, designacaoValor, localValor, dataValor);
    resultado.textContent = csv;

    //Limpa os inputs/mensagens após gerar o CSV
    msg_saram.textContent = "";
    mensagem.textContent = "";
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

// Adiciona um evento de clique ao botão para limpar o CSV
limparBtn.addEventListener("click", () => {
    if (resultado.textContent !== "") {
        resultado.textContent = "";
        mensagem.textContent = "CSV limpo.";
        mensagem.style.color = "#fdf6f6";
    }
});
