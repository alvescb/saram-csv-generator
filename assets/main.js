function gerarCSV(listaSarams, valorDesignacao, valorLocal, valorData, valorLegislacao) {
    if (!Array.isArray(listaSarams) || listaSarams.length === 0) {
        return "";
    }
    const colInstrucao = ["saram", "designacao", "local", "data"];
    const colEstagio = ["saram", "designacao", "data", "legislacao"];
    const colFuncao = ["saram", "designacao", "data"];
    const linhaInstrucao = [colInstrucao.join(";")];
    const linhaEstagio = [colEstagio.join(';')];
    const linhaFuncao = [colFuncao.join(';')];

    for (const saram of listaSarams) {
        linhaInstrucao.push([saram, valorDesignacao, valorLocal, valorData].join(";"));
        linhaEstagio.push([saram, valorDesignacao, valorData, valorLegislacao].join(';'));
        linhaFuncao.push([saram, valorDesignacao, valorData].join(';'));

    }

    return {
        instrucao: linhaInstrucao.join('\n'),
        estagio: linhaEstagio.join("\n"),
        funcao: linhaFuncao.join("\n")
    }
}

document.querySelectorAll('.menu ul a').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});

document.querySelectorAll('.content').forEach(section => {
    const saram = section.querySelector('.saram');
    const designacao = section.querySelector('.designacao');
    const local = section.querySelector('.local');
    const data = section.querySelector('.data');
    const legislacao = section.querySelector('.legislacao')
    const btn = section.querySelector('.btn');
    const copiarBtn = section.querySelector('.copiar');
    const limparBtn = section.querySelector('.limpar');
    const resultado = section.querySelector('.resultado');
    const msg_saram = section.querySelector('.msg_saram');
    const mensagem = section.querySelector('.mensagem');
    const showMsgError = document.getElementById('showMsgError');
    const fecharPopUp = document.getElementsByTagName('button')[0];



    btn.addEventListener('click', () => {
        // valida campos vazios
        if ([saram, designacao, local, data].some(c => c && c.value.trim() === "")) {
            mostrarMSG("Preencha todos os campos !")
            return;
        }

        // valida campo SARAM — somente números, aceita múltiplos espaços e vírgulas
        const saramValor = saram.value.trim().split(/[\s,]+/).filter(s => s !== '');

        if (!saramValor.every(s => /^\d+$/.test(s))) {
            mostrarMSG("O campo SARAM deve conter apenas números.")
            return;
        }

        const csv = gerarCSV(
            saramValor,
            designacao.value,
            local?.value,
            new Date(data.value).toLocaleDateString("pt-BR"),
            legislacao?.value
        );

        resultado.textContent = csv[section.dataset.tipo]; // lê o data-tipo de cada section

        // limpa os inputs após gerar
        saram.value = designacao.value = data.value = "";
        if (local) local.value = "";
        if (legislacao) legislacao.value = "";
    });

    copiarBtn.addEventListener('click', () => {


        if (resultado.textContent === "") {
            mensagem.classList.remove('msg-sucesso')
            mensagem.textContent = "Nenhum CSV gerado para copiar.";
            mensagem.classList.add('msg-erro');
        } else {
            navigator.clipboard.writeText(resultado.textContent);
            mensagem.classList.remove('msg-erro')
            mensagem.textContent = "CSV copiado para a área de transferência!";
            mensagem.classList.add('msg-sucesso');
        }
    });

    limparBtn.addEventListener('click', () => {
        mensagem.classList.remove('msg-erro', 'msg-sucesso');

        if (resultado.textContent !== "") {
            resultado.textContent = "";
            mensagem.textContent = "CSV limpo.";
            mensagem.classList.add('msg-sucesso');
        } else {
            mensagem.textContent = ""; // ← limpa a mensagem se não tiver CSV
        }

    });



    //Abre o PopUp de erro

    function mostrarMSG(txt) {
        showMsgError.style.display = 'block';
        mensagem.textContent = ''
        showMsgError.getElementsByTagName('p')[0].textContent = txt;
        fecharPopUp.focus()
        //Fecha o PopUp de erro
        fecharPopUp.addEventListener('click', function (e) {
            showMsgError.style.display = 'none';
            saram.focus()
        })

        window.addEventListener('click', function (e) {
            // Verifica se o alvo do clique (e.target) é a própria div de erro
            // ou se o clique aconteceu em elementos dentro dela
            if (e.target === showMsgError) {
                showMsgError.style.display = 'none';
                saram.focus();
            }
        });
    }









});


