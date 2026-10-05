function gerarCSV(listaSarams, valorDesignacao, valorLocal, valorData, valorLegislacao) {
    if (!Array.isArray(listaSarams) || listaSarams.length === 0) {
        return {};
    }
    const linhaInstrucao = ["saram;designacao;local;data"];
    const linhaEstagio = ["saram;designacao;data;legislacao"];
    const linhaFuncao = ["saram;designacao;data"];

    for (const saram of listaSarams) {
        linhaInstrucao.push([saram, valorDesignacao, valorLocal, valorData].join(";"));
        linhaEstagio.push([saram, valorDesignacao, valorData, valorLegislacao].join(";"));
        linhaFuncao.push([saram, valorDesignacao, valorData].join(";"));
    }

    return {
        instrucao: linhaInstrucao.join("\n"),
        estagio: linhaEstagio.join("\n"),
        funcao: linhaFuncao.join("\n")
    };
}

function formatarDataBR(dataISO) {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

/* ---------- Popup de erro (único para todas as telas) ---------- */
const popup = document.getElementById("showMsgError");
const popupTexto = popup.querySelector("p");
const btnFechar = popup.querySelector(".btn_fechar");
let campoParaFocar = null;

function mostrarMSG(txt, campo) {
    campoParaFocar = campo;
    popupTexto.textContent = txt;
    popup.style.display = "block";
    btnFechar.focus();
}

function fecharPopup() {
    popup.style.display = "none";
    if (campoParaFocar) campoParaFocar.focus();
}

btnFechar.addEventListener("click", fecharPopup);
popup.addEventListener("click", (e) => { if (e.target === popup) fecharPopup(); });
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.style.display === "block") fecharPopup();
});

/* ---------- Navegação entre as telas (por hash) ---------- */
const secoes = document.querySelectorAll(".content");
const links = document.querySelectorAll(".menu ul a");

function mostrarSecao() {
    const hash = location.hash.slice(1);
    const alvo = [...secoes].some(s => s.id === hash) ? hash : "instrucao";

    secoes.forEach(s => {
        s.hidden = s.id !== alvo;
        if (s.id === alvo) document.title = s.dataset.titulo;
    });
    links.forEach(a => a.classList.toggle("active", a.hash === "#" + alvo));
}

window.addEventListener("hashchange", mostrarSecao);
mostrarSecao();

/* ---------- Lógica de cada formulário ---------- */
secoes.forEach(section => {
    const $ = (sel) => section.querySelector(sel);
    const saram = $(".saram");
    const designacao = $(".designacao");
    const local = $(".local");
    const data = $(".data");
    const legislacao = $(".legislacao");
    const resultado = $(".resultado");
    const mensagem = $(".mensagem");

    function setMensagem(txt, tipo) {
        mensagem.classList.remove("msg-erro", "msg-sucesso");
        mensagem.textContent = txt;
        if (tipo) mensagem.classList.add(tipo);
    }

    $(".btn:not(.copiar):not(.limpar)").addEventListener("click", () => {
        // valida campos vazios (ignora os que não existem nesta tela)
        if ([saram, designacao, local, data, legislacao].some(c => c && c.value.trim() === "")) {
            setMensagem("");
            mostrarMSG("Preencha todos os campos !", saram);
            return;
        }

        // SARAM: somente números, separados por espaços e/ou vírgulas
        const saramValor = saram.value.trim().split(/[\s,]+/).filter(s => s !== "");
        if (!saramValor.every(s => /^\d+$/.test(s))) {
            setMensagem("");
            mostrarMSG("O campo SARAM deve conter apenas números.", saram);
            return;
        }

        const csv = gerarCSV(
            saramValor,
            designacao.value,
            local?.value,
            formatarDataBR(data.value),
            legislacao?.value
        );

        resultado.textContent = csv[section.dataset.tipo];
        setMensagem("");

        // limpa os inputs após gerar
        [saram, designacao, local, data, legislacao].forEach(c => { if (c) c.value = ""; });
    });

    $(".copiar").addEventListener("click", () => {
        if (resultado.textContent === "") {
            setMensagem("Nenhum CSV gerado para copiar.", "msg-erro");
        } else {
            navigator.clipboard.writeText(resultado.textContent);
            setMensagem("CSV copiado para a área de transferência!", "msg-sucesso");
        }
    });

    $(".limpar").addEventListener("click", () => {
        if (resultado.textContent !== "") {
            resultado.textContent = "";
            setMensagem("CSV limpo.", "msg-sucesso");
        } else {
            setMensagem("");
        }
    });
});
