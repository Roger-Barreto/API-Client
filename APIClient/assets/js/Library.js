/* Função blink()
   Habilita tag blink no IE */
function blink() {
    if (window.attachEvent) {
        window.attachEvent('onload',

        function () {
            var sAgent = navigator.userAgent.toLowerCase();

            if ((new RegExp("msie\ ")).test(sAgent)) {
                setInterval(

                function () {
                    var aBlink = document.getElementsByTagName('BLINK');

                    for (var i = 0; i < aBlink.length; i++) {
                        if (aBlink[i].style.visibility == 'hidden')
                            aBlink[i].style.visibility = 'visible';
                        else
                            aBlink[i].style.visibility = 'hidden';
                    }
                }, 500);
            }
        });
    }
}

/* Função blurCEP(Objeto)
   Valida um cep no formato 99999-999 */
function blurCEP(Objeto) {
    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtCEP(Objeto.value);

    return true;
}

/* Função blurCNPJ(Objeto)
   Valida um cnpj no formato 99.999.999/9999-99 */
function blurCNPJ(Objeto) {
    if (!vldCNPJ(Objeto.value)) {
        window.alert('CNPJ inválido!');
        clearFocus(Objeto);
        return false;
    }

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtCNPJ(Objeto.value);

    return true;
}

/* Função blurCPF(Objeto)
   Valida um cpf no formato 999.999.999-99 */
function blurCPF(Objeto) {
    if (!vldCPF(Objeto.value)) {
        window.alert('CPF inválido! ...');
        clearFocus(Objeto);
        return false;
    }

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtCPF(Objeto.value);

    return true;
}

/* Função blurCPFCNPJ(Objeto)
   Valida um cpf/cnpj nos formatos 999.999.999-99 e 99.999.999/9999-99 */
function blurCPFCNPJ(Objeto) {
    if ((!vldCPF(Objeto.value)) && (!vldCNPJ(Objeto.value))) {
        window.alert('CPF / CNPJ inválido!');
        clearFocus(Objeto);
        return false;
    }

    if (vldCPF(Objeto.value)) {
        Objeto.value = passaDominio(Objeto.value, "0123456789");
        Objeto.value = fmtCPF(Objeto.value);
    }
    else if (vldCNPJ(Objeto.value)) {
        Objeto.value = passaDominio(Objeto.value, "0123456789");
        Objeto.value = fmtCNPJ(Objeto.value);
    }

    return true;
}

/* Função blurCPFCNPJ(Objeto)
   Valida um cpf/cnpj nos formatos 999.999.999-99 e 99.999.999/9999-99 */
function validateCPFCNPJ(Value) {
    if ((!vldCPF(Value)) && (!vldCNPJ(Value))) {
        return false;
    }
    return true;
}

/* Função blurData(Objeto)
   Valida uma data no formato dd/mm/yyyy */
function blurData(Objeto) {
    if (Objeto.value == "")
        return true;

    data = passaDominio(Objeto.value, "0123456789");
    data = fmtData(data);

    var dia = parseInt(data.substr(0, 2), 10);
    var mes = parseInt(data.substr(3, 5), 10);
    var ano = parseInt(data.substr(6, 10), 10);

    if ((dia <= 31) && (mes <= 12) && (ano >= 1000)) {
        if ((data.substring(0, 1) == '0') && (data.substring(1, 2) != '0') || (data.substring(0, 1) != '0')) {
            if (data.substring(2, 3) == '/') {
                if ((data.substring(3, 4) == '0') && (data.substring(4, 5) != '0') || (data.substring(3, 4) != '0')) {
                    if (data.substring(5, 6) == '/') {
                        if ((data.substring(6, 7) == '0') || (data.substring(6, 7) == '') && (data.substring(7, 8) != '0')) {
                            window.alert('Ano inválido!');
                            clearFocus(Objeto);
                            return false;
                        }
                        else {
                            if (mes == 2) {
                                if ((dia > 0) && (dia <= 29)) {
                                    if (dia == 29) {
                                        if ((ano % 4) == 0) {
                                            Objeto.value = passaDominio(Objeto.value, "0123456789");
                                            Objeto.value = fmtData(Objeto.value);

                                            return true;
                                        }
                                        else {
                                            window.alert('Dia inválido!');
                                            clearFocus(Objeto);
                                            return false;
                                        }
                                    }
                                }
                                else {
                                    window.alert('Dia inválido!');
                                    clearFocus(Objeto);
                                    return false;
                                }
                            }

                            if ((mes == 4) || (mes == 6) || (mes == 9) || (mes == 11)) {
                                if ((dia > 0) && (dia <= 30)) {
                                    Objeto.value = passaDominio(Objeto.value, "0123456789");
                                    Objeto.value = fmtData(Objeto.value);

                                    return true;
                                }
                                else {
                                    window.alert('Dia inválido');
                                    clearFocus(Objeto);
                                    return false;
                                }
                            }

                            if ((mes == 1) || (mes == 3) || (mes == 5) || (mes == 7) || (mes == 8) || (mes == 10) || (mes == 12)) {
                                if ((dia > 0) && (dia <= 31)) {
                                    Objeto.value = passaDominio(Objeto.value, "0123456789");
                                    Objeto.value = fmtData(Objeto.value);

                                    return true;
                                }
                                else {
                                    window.alert('Dia inválido!');
                                    clearFocus(Objeto);
                                    return false;
                                }
                            }
                        }
                    }
                    else {
                        window.alert('Formato da data deve ser (dd/mm/aaaa)!');
                        clearFocus(Objeto);
                        return false;
                    }
                }
                else {
                    window.alert('Mês inválido!');
                    clearFocus(Objeto);
                    return false;
                }
            }
            else {
                window.alert('Formato da data deve ser (dd/mm/aaaa)!');
                clearFocus(Objeto);
                return false;
            }
        }
        else {
            window.alert('Dia inválido!');
            clearFocus(Objeto);
            return false;
        }
    }
    else {
        window.alert('Data inválida!');
        clearFocus(Objeto);
        return false;
    }

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtData(Objeto.value);

    return true;
}


/* Funçao blurDateTime(Objeto)
   Valida uma data no formato dd/mm/yyyy hh:mm:ss*/
function blurDateTime(Objeto) {
    if (Objeto.value == "")
        return true;

    data = passaDominio(Objeto.value, "0123456789");
    data = fmtDateTime(data);

    var dia = parseInt(data.substr(0, 2), 10);
    var mes = parseInt(data.substr(3, 5), 10);
    var ano = parseInt(data.substr(6, 10), 10);

    var hora = parseInt(data.substr(11, 2), 10);
    var minuto = parseInt(data.substr(14, 2), 10);
    var segundo = parseInt(data.substr(17, 2), 10);

    if (data.substr(17, 2).length < 2) {
        window.alert('Data inválida!');
        clearFocus(Objeto);
        return false;
    }

    if ((dia <= 31) && (mes <= 12) && (ano >= 1000) && (hora <= 23) && (minuto <= 59) && (segundo <= 59)) {
        if ((data.substring(0, 1) == '0') && (data.substring(1, 2) != '0') || (data.substring(0, 1) != '0')) {
            if (data.substring(2, 3) == '/') {
                if ((data.substring(3, 4) == '0') && (data.substring(4, 5) != '0') || (data.substring(3, 4) != '0')) {
                    if (data.substring(5, 6) == '/') {
                        if ((data.substring(6, 7) == '0') || (data.substring(6, 7) == '') && (data.substring(7, 8) != '0')) {
                            window.alert('Ano inválido!');
                            clearFocus(Objeto);
                            return false;
                        }
                        else {
                            if (mes == 2) {
                                if ((dia > 0) && (dia <= 29)) {
                                    if (dia == 29) {
                                        if ((ano % 4) == 0) {
                                            Objeto.value = passaDominio(Objeto.value, "0123456789");
                                            Objeto.value = fmtDateTime(Objeto.value);

                                            if ((hora > 23) && (minuto > 59) && (segundo > 59)) {
                                                window.alert('Hora inválida!');
                                                clearFocus(Objeto);
                                                return false;
                                            }
                                            return true;
                                        }
                                        else {
                                            window.alert('Dia inválido!');
                                            clearFocus(Objeto);
                                            return false;
                                        }
                                    }
                                }
                                else {
                                    window.alert('Dia inválido!');
                                    clearFocus(Objeto);
                                    return false;
                                }
                            }

                            if ((mes == 4) || (mes == 6) || (mes == 9) || (mes == 11)) {
                                if ((dia > 0) && (dia <= 30)) {

                                    if ((hora > 23) || (minuto > 59) || (segundo > 59)) {
                                        window.alert('Hora inválida!');
                                        clearFocus(Objeto);
                                        return false;
                                    }

                                    Objeto.value = passaDominio(Objeto.value, "0123456789");
                                    Objeto.value = fmtDateTime(Objeto.value);

                                    return true;
                                }
                                else {
                                    window.alert('Dia inválido');
                                    clearFocus(Objeto);
                                    return false;
                                }
                            }

                            if ((mes == 1) || (mes == 3) || (mes == 5) || (mes == 7) || (mes == 8) || (mes == 10) || (mes == 12)) {
                                if ((dia > 0) && (dia <= 31)) {

                                    if ((hora > 23) || (minuto > 59) || (segundo > 59)) {
                                        window.alert('Hora inválida!');
                                        clearFocus(Objeto);
                                        return false;
                                    }

                                    Objeto.value = passaDominio(Objeto.value, "0123456789");
                                    Objeto.value = fmtDateTime(Objeto.value);

                                    return true;
                                }
                                else {
                                    window.alert('Dia inválido!');
                                    clearFocus(Objeto);
                                    return false;
                                }
                            }
                        }
                    }
                    else {
                        window.alert('Formato da data deve ser (dd/mm/aaaa hh:mm:ss)!');
                        clearFocus(Objeto);
                        return false;
                    }
                }
                else {
                    window.alert('Mês inválido!');
                    clearFocus(Objeto);
                    return false;
                }
            }
            else {
                window.alert('Formato da data deve ser (dd/mm/aaaa hh:mm:ss)!');
                clearFocus(Objeto);
                return false;
            }
        }
        else {
            window.alert('Dia inválido!');
            clearFocus(Objeto);
            return false;
        }
    }
    else {
        window.alert('Data inválida!');
        clearFocus(Objeto);
        return false;
    }

    if ((hora > 23) || (minuto > 59) || (segundo > 59)) {
        window.alert('Hora inválida!');
        clearFocus(Objeto);
        return false;
    }

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtDateTime(Objeto.value);

    return true;
}

/* Função blurDecimal(Objeto)
   Valida um decimal permitindo apenas caracteres numéricos */
function blurDecimal(Objeto, DecimalPlaces, NegativeNumber) {
    if (NegativeNumber)
        Objeto.value = passaDominio(Objeto.value, "-0123456789");
    else
        Objeto.value = passaDominio(Objeto.value, "0123456789");

    Objeto.value = fmtDecimal(Objeto.value, parseInt(DecimalPlaces), true);

    return true;
}

/* Função blurEmail(Objeto)
   Valida um e-mail num formato valido */
function blurEmail(Objeto) {
    if (Objeto.value == "")
        return true;

    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (filter.test(Objeto.value)) {
        Objeto.value = Objeto.value.toLowerCase();

        return true;
    }
    else {
        window.alert('E-mail inválido!');
        clearFocus(Objeto);
        return false;
    }
}

/* Função blurFone(Objeto)
   Valida um telefone no formato (99)9999-9999 */
function blurFone(Objeto) {
    if (!vldFone(Objeto)) {
        window.alert('Número de telefone inválido!');
        clearFocus(Objeto);
        return false;
    }

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtFone(Objeto.value, false);

    return true;
}

/* Função blurLower(Objeto)
   Valida uma expressÃ£o minÃºscula num formato vÃ¡lido */
function blurLower(Objeto) {
    Objeto.value = Objeto.value.toLowerCase();

    return true;
}

/* Função blurMedia(Objeto, Percentual, Media, DecimalPlaces, NegativeNumber, Items, SetColor)
   Calcula o percentual entre dois campos e faz a mÃ©dia */
function blurMedia(Objeto, Percentual, Media, Items, SetColor) {
    Objeto.value = passaDominio(Objeto.value, "0123456789");

    if ((Objeto.value == '') || (parseInt(Objeto.value) > 100)) {
        window.alert('O percentual deve variar entre 0 e 100%!');
        Objeto.value = "0";
        Objeto.focus();
    }

    var Sum = new Number();
    var Count = new Number();

    Sum = 0;
    Count = 0;
    for (i = 0; i < Items.length; i++) {
        Sum = Sum + getProgressValue(Items[i]);
        Count++;
    }

    Sum = Sum - getProgressValue(Percentual);

    if (Objeto.value == "")
        setProgressValue(Percentual, 0, SetColor);
    else {
        setProgressValue(Percentual, Objeto.value, SetColor);

        // Calculando mÃ©dia
        Sum = Sum + parseInt(Objeto.value);
    }

    setProgressValue(Media, (Sum / Count).toFixed(0), SetColor);

    return true;
}

/* Função blurMultiplicaSoma(Objeto, Multiplicador, Multiplicacao, Total, DecimalPlaces, DecimalPlaces2, NegativeNumber)
   Executa a multiplicaÃ§Ã£o entre dois campos e totaliza */
function blurMultiplicaSoma(Objeto, Multiplicador, Multiplicacao, Total, DecimalPlaces, DecimalPlaces2, NegativeNumber) {
    if (NegativeNumber)
        Objeto.value = passaDominio(Objeto.value, "-0123456789");
    else
        Objeto.value = passaDominio(Objeto.value, "0123456789");

    Objeto.value = fmtDecimal(Objeto.value, parseInt(DecimalPlaces), true);

    var total = new Number();

    total = parseFloat(replaceAll(replaceAll(Total.innerText, ".", ""), ",", "."));
    total = total.toFixed(DecimalPlaces2);

    if (Multiplicacao.innerText != "") {
        total = parseFloat(total) - parseFloat(replaceAll(replaceAll(Multiplicacao.innerText, ".", ""), ",", "."));
        total = total.toFixed(DecimalPlaces2);
    }

    if ((Objeto.value == "") ||
        ((Multiplicador.type == null) &&
         (Multiplicador.innerText == "")) ||
        ((Multiplicador.type != null) &&
         (Multiplicador.value == ""))) {
        Multiplicacao.innerText = "";
    }
    else {
        // Calculando multiplicaÃ§Ã£o
        var mult = new Number();

        if (Multiplicador.type == null)
            mult = parseFloat(replaceAll(replaceAll(Objeto.value, ".", ""), ",", ".")) * parseFloat(replaceAll(replaceAll(Multiplicador.innerText, ".", ""), ",", "."));
        else
            mult = parseFloat(replaceAll(replaceAll(Objeto.value, ".", ""), ",", ".")) * parseFloat(replaceAll(replaceAll(Multiplicador.value, ".", ""), ",", "."));

        mult = mult.toFixed(DecimalPlaces2);

        if (NegativeNumber)
            Multiplicacao.innerText = passaDominio(mult, "-0123456789");
        else
            Multiplicacao.innerText = passaDominio(mult, "0123456789");

        Multiplicacao.innerText = fmtDecimal(Multiplicacao.innerText, parseInt(DecimalPlaces2), true);

        // Totalizando multiplicaÃ§Ã£o
        total = parseFloat(total) + parseFloat(mult);
        total = total.toFixed(DecimalPlaces2);
    }

    if (NegativeNumber)
        Total.innerText = passaDominio(total, "-0123456789");
    else
        Total.innerText = passaDominio(total, "0123456789");

    Total.innerText = fmtDecimal(Total.innerText, parseInt(DecimalPlaces2), true);

    return true;
}

/* Função blurMultiplicaSomaA(Objeto, Mult1, Mult2, Multiplicacao, Total, DecimalPlaces, DecimalPlaces2, NegativeNumber)
   Executa a multiplicaÃ§Ã£o entre dois ou mais campos e totaliza */
function blurMultiplicaSomaA(Objeto, Mult1, Mult2, Multiplicacao, Total, DecimalPlaces, DecimalPlaces2, NegativeNumber) {
    if (NegativeNumber)
        Objeto.value = passaDominio(Objeto.value, "-0123456789");
    else
        Objeto.value = passaDominio(Objeto.value, "0123456789");

    Objeto.value = fmtDecimal(Objeto.value, parseInt(DecimalPlaces), true);

    var total = new Number();

    total = parseFloat(replaceAll(replaceAll(Total.innerText, ".", ""), ",", "."));
    total = total.toFixed(DecimalPlaces2);

    if (Multiplicacao.innerText != "") {
        total = parseFloat(total) - parseFloat(replaceAll(replaceAll(Multiplicacao.innerText, ".", ""), ",", "."));
        total = total.toFixed(DecimalPlaces2);
    }

    // Calculando multiplicadores
    var mult1 = new Number();
    var mult2 = new Number();

    mult1 = 0;
    for (i = 0; i < Mult1.length; i++) {
        if (Mult1[i].value != "")
            mult1 = mult1 + parseFloat(replaceAll(replaceAll(Mult1[i].value, ".", ""), ",", "."));
    }

    mult2 = 0;
    for (i = 0; i < Mult2.length; i++) {
        if (Mult2[i].value != "")
            mult2 = mult2 + parseFloat(replaceAll(replaceAll(Mult2[i].value, ".", ""), ",", "."));
    }

    if ((mult1 == 0) || (mult2 == 0))
        Multiplicacao.innerText = "";
    else {
        // Calculando multiplicaÃ§Ã£o
        var mult = new Number();

        mult = mult1 * mult2;
        mult = mult.toFixed(DecimalPlaces2);

        if (NegativeNumber)
            Multiplicacao.innerText = passaDominio(mult, "-0123456789");
        else
            Multiplicacao.innerText = passaDominio(mult, "0123456789");

        Multiplicacao.innerText = fmtDecimal(Multiplicacao.innerText, parseInt(DecimalPlaces2), true);

        // Totalizando multiplicaÃ§Ã£o
        total = parseFloat(total) + parseFloat(mult);
        total = total.toFixed(DecimalPlaces2);
    }

    if (NegativeNumber)
        Total.innerText = passaDominio(total, "-0123456789");
    else
        Total.innerText = passaDominio(total, "0123456789");

    Total.innerText = fmtDecimal(Total.innerText, parseInt(DecimalPlaces2), true);

    return true;
}

/* Função blurNumber(Objeto)
   Valida um nÃºmero permitindo apenas caracteres numÃ©ricos */
function blurNumber(Objeto) {
    Objeto.value = passaDominio(Objeto.value, "0123456789");

    return true;
}

/* Função blurSoma(Objeto, Items, Resultado, DecimalPlaces, NegativeNumber)
   Calcula a soma de uma coluna */
function blurSoma(Objeto, Items, Resultado, DecimalPlaces, NegativeNumber) {
    if (NegativeNumber)
        Objeto.value = passaDominio(Objeto.value, "-0123456789");
    else
        Objeto.value = passaDominio(Objeto.value, "0123456789");

    Objeto.value = fmtDecimal(Objeto.value, parseInt(DecimalPlaces), true);

    var Soma = new Number();
    Soma = 0;

    for (i = 0; i < Items.length; i++) {
        if (Items[i].value != "")
            Soma = parseFloat(Soma) + parseFloat(replaceAll(replaceAll(Items[i].value, ".", ""), ",", "."));
    }

    if (NegativeNumber)
        Resultado.innerText = passaDominio(Soma.toFixed(parseInt(DecimalPlaces)), "-0123456789");
    else
        Resultado.innerText = passaDominio(Soma.toFixed(parseInt(DecimalPlaces)), "0123456789");

    Resultado.innerText = fmtDecimal(Resultado.innerText, parseInt(DecimalPlaces), true);

    return true;
}

/* Função blurPercentualMedia(Objeto, Dividendo, Divisor, Percentual, Percentual2, Media, Media2, DecimalPlaces, NegativeNumber, Items, SetColor)
   Calcula o percentual entre dois campos e faz a mÃ©dia */
function blurPercentualMedia(Objeto, Dividendo, Divisor, Percentual, Percentual2, Media, Media2, DecimalPlaces, NegativeNumber, Items, SetColor) {
    if (NegativeNumber)
        Objeto.value = passaDominio(Objeto.value, "-0123456789");
    else
        Objeto.value = passaDominio(Objeto.value, "0123456789");

    Objeto.value = fmtDecimal(Objeto.value, parseInt(DecimalPlaces), true);

    var Sum = new Number();
    var Count = new Number();

    Sum = 0;
    Count = 0;
    for (i = 0; i < Items.length; i++) {
        Sum = Sum + getProgressValue(Items[i]);
        Count++;
    }

    Sum = Sum - getProgressValue(Percentual);

    var dividendo = new Number();
    dividendo = parseFloat(replaceAll(replaceAll(Dividendo.value, ".", ""), ",", "."));

    var divisor = new Number();
    divisor = parseFloat(replaceAll(replaceAll(Divisor.value, ".", ""), ",", "."));

    if ((Dividendo.value == "") || (dividendo == 0) || (Divisor.value == "") || (divisor == 0)) {
        setProgressValue(Percentual, 0, SetColor);

        if (Percentual2 != null)
            Percentual2.value = 0;
    }
    else {
        // Calculando percentual
        var percentual = new Number();

        percentual = (dividendo / divisor) * 100;
        if (percentual > 100)
            percentual = 100;
        percentual = percentual.toFixed(0);

        setProgressValue(Percentual, percentual, SetColor);

        if (Percentual2 != null)
            Percentual2.value = percentual;

        // Calculando mÃ©dia
        Sum = Sum + parseInt(percentual);
    }

    setProgressValue(Media, (Sum / Count).toFixed(0), SetColor);

    if (Media2 != null)
        Media2.value = (Sum / Count).toFixed(0);

    return true;
}

/* Função blurPISPASEP(Objeto)
   Valida um pis/pasep no formato 999.99999.99-9 */
function blurPISPASEP(Objeto) {
    if (!vldPISPASEP(Objeto.value)) {
        window.alert('PIS/PASEP inválido!');
        clearFocus(Objeto);
        return false;
    }

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtPISPASEP(Objeto.value);

    return true;
}

/* Função blurTime(Objeto)
   Valida uma data no formato hh:mm:ss*/
function blurTime(Objeto) {
    if (Objeto.value == "")
        return true;

    data = passaDominio(Objeto.value, "0123456789");
    data = fmtTime(data);

    var hora = parseInt(data.substr(0, 2), 10);
    var minuto = parseInt(data.substr(3, 5), 10);
    var segundo = parseInt(data.substr(6, 8), 10);

    if (data.substr(6, 2).length < 2) {
        window.alert('Hora inválida!');
        clearFocus(Objeto);
        return false;
    }

    if ((hora > 23) || (minuto > 59) || (segundo > 59)) {
        window.alert('Hora inválida!');
        clearFocus(Objeto);
        return false;
    }

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtTime(Objeto.value);

    return true;
}

/* Função blurUF(Objeto)
   Valida um uf num formato vÃ¡lido */
function blurUF(Objeto) {
    Objeto.value = Objeto.value.toUpperCase();

    return true;
}

/* Função blurUpper(Objeto)
   Valida uma expressÃ£o maiÃºscula num formato vÃ¡lido */
function blurUpper(Objeto) {
    Objeto.value = Objeto.value.toUpperCase();

    return true;
}

function cancelKey(Evento) {
    if (Evento) {
        Evento.keyCode = 0;
        Evento.returnValue = false;
    }
    else if (window.event) {
        window.event.keyCode = 0;
        window.event.returnValue = false;
    }
}

function clearFocus(Objeto) {
    Objeto.value = "";
    Objeto.focus();
}

function fmtCEP(Dado) {
    var Result = Dado;
    var l = Dado.length;

    if (l >= 5)
        Result = Dado.substr(0, 5) + '-' + Dado.substr(5, 3);

    return Result;
}

function fmtCNPJ(Dado) {

    if (Dado != null) {
        var Result = Dado.toString();
        

        var Texto = Dado.toString();
        var l = Texto.length;

        if ((l > 1) && (l < 5))
            Result = Texto.substr(0, 2) + '.' + Texto.substr(2, 3);

        if ((l >= 5) && (l < 8))
            Result = Texto.substr(0, 2) + '.' + Texto.substr(2, 3) + '.' + Texto.substr(5, 3);

        if ((l >= 8) && (l < 12))
            Result = Texto.substr(0, 2) + '.' + Texto.substr(2, 3) + '.' + Texto.substr(5, 3) + '/' + Texto.substr(8, 4);

        if (l >= 12)
            Result = Texto.substr(0, 2) + '.' + Texto.substr(2, 3) + '.' + Texto.substr(5, 3) + '/' + Texto.substr(8, 4) + '-' + Texto.substr(12, 2);

        return Result;
    }
    else
        return "";
}

function fmtCPF(Dado) {

    if (Dado != null) {
        var Result = Dado.toString();

        var Texto = Dado.toString();

        var l = Texto.length;


        if ((l > 2) && (l < 6))
            Result = Texto.substr(0, 3) + '.' + Texto.substr(3, 3);

        if ((l >= 6) && (l < 9))
            Result = Texto.substr(0, 3) + '.' + Texto.substr(3, 3) + '.' + Texto.substr(6, 3);

        if (l >= 9)
            Result = Texto.substr(0, 3) + '.' + Texto.substr(3, 3) + '.' + Texto.substr(6, 3) + '-' + Texto.substr(9, 2);

        return Result;
    }
    else
        return "";
}

function fmtData(Dado) {
    var Result = Dado;
    var l = Dado.length;

    if ((l > 1) && (l < 4))
        Result = Dado.substr(0, 2) + '/' + Dado.substr(2, 2);

    if (l >= 4)
        Result = Dado.substr(0, 2) + '/' + Dado.substr(2, 2) + '/' + Dado.substr(4, 4);

    return Result;
}

function fmtDateTime(Dado) {
    var Result = Dado;
    var l = Dado.length;

    if ((l > 1) && (l < 4))
        Result = Dado.substr(0, 2) + '/' + Dado.substr(2, 2);

    if ((l >= 4) && (l < 8))
        Result = Dado.substr(0, 2) + '/' + Dado.substr(2, 2) + '/' + Dado.substr(4, 4)

    if ((l == 8) || (l == 9))
        Result = Dado.substr(0, 2) + '/' + Dado.substr(2, 2) + '/' + Dado.substr(4, 4) + " " + Dado.substr(8, 2);

    if ((l >= 10) && (l <= 11))
        Result = Dado.substr(0, 2) + '/' + Dado.substr(2, 2) + '/' + Dado.substr(4, 4) + " " + Dado.substr(8, 2) + ":" + Dado.substr(10, 2);

    if (l >= 12)
        Result = Dado.substr(0, 2) + '/' + Dado.substr(2, 2) + '/' + Dado.substr(4, 4) + " " + Dado.substr(8, 2) + ":" + Dado.substr(10, 2) + ":" + Dado.substr(12, 2);

    return Result;
}

function fmtDecimal(Dado, DecimalPlaces, ValidateNull) {
    var Negative = (Dado.substr(0, 1) == '-');

    Dado = replaceAll(Dado, '-', '');

    if ((ValidateNull) && (Dado == ""))
        return "";

    if (Dado.length > parseInt(DecimalPlaces)) {
        while ((Dado.substr(0, 1) == "0") && (Dado.length > (parseInt(DecimalPlaces) + 1)))
            Dado = Dado.substr(1);
    }
    else {
        while (Dado.length <= parseInt(DecimalPlaces))
            Dado = "0" + Dado;
    }

    var Result = "";
    var Count = 0;

    for (i = Dado.length - 1; i > -1; i--) {
        if ((Count == parseInt(DecimalPlaces)) && (((ValidateNull) && (parseInt(DecimalPlaces) > 0)) || ((!ValidateNull) && (parseInt(DecimalPlaces) > -1))))
            Result = "," + Result;

        if ((Count > parseInt(DecimalPlaces)) && (((Count - parseInt(DecimalPlaces)) % 3) == 0))
            Result = "." + Result;

        Result = Dado.substr(i, 1) + Result;

        Count++;
    }

    if (Negative)
        return "-" + Result;
    else
        return Result;
}

function fmtFone(Dado, ValidateNull) {
    var Result = Dado;
    var l = Dado.length;
    var a;

    if (ValidateNull)
        a = -1;
    else
        a = 0;

    if ((l > a) && (l < 2))
        Result = '(' + Dado.substr(0, 2);

    if ((l >= 2) && (l < 6))
        Result = '(' + Dado.substr(0, 2) + ')' + Dado.substr(2, 4);

    if (l >= 6)
        Result = '(' + Dado.substr(0, 2) + ')' + Dado.substr(2, 4) + '-' + Dado.substr(6, 4);

    return Result;
}

function fmtPISPASEP(Dado) {
    var Result = Dado;
    var l = Dado.length;

    if ((l > 2) && (l < 8))
        Result = Dado.substr(0, 3) + '.' + Dado.substr(3, 5);

    if ((l >= 8) && (l < 10))
        Result = Dado.substr(0, 3) + '.' + Dado.substr(3, 5) + '.' + Dado.substr(8, 2);

    if (l >= 10)
        Result = Dado.substr(0, 3) + '.' + Dado.substr(3, 5) + '.' + Dado.substr(8, 2) + '-' + Dado.substr(10, 1);

    return Result;
}

function fmtInscEstadual(Dado, UF) {
    if (Dado.value = '') {
        return;
    }

    var Result = Dado;
    var l = Dado.length;

    if (UF == "AC") {
        if (l >= 13) {
            Result = Dado.substr(0, 2) + '.' + Dado.substr(2, 3) + '.' + Dado.substr(5, 3) + '/' + Dado.substr(8, 3) + '-' + Dado.substr(11, 2); //01.000.941/001-24
        }
    }
    if (UF == "AL") {
        if (l >= 9) {
            Result = Dado.substr(0, 8) + '-' + Dado.substr(8, 1); //24000004-8
        }
    }
    if (UF == "AM") {
        if (l >= 9) {
            Result = Dado.substr(0, 2) + '.' + Dado.substr(2, 3) + '.' + Dado.substr(5, 3) + '-' + Dado.substr(8, 1); //04.210.308-8
        }
    }
    if (UF == "AP") {
        if (l >= 9) {
            Result = Dado;
        }
    }
    if (UF == "BA") {
        if ((l >= 8) && (l < 9)) {
            Result = Dado.substr(0, 6) + '-' + Dado.substr(6, 2); // c/ 8 dig 123456-63 e c/ 9 dig 1000003-06
        }
        else if (l >= 9) {
            Result = Dado.substr(0, 7) + '-' + Dado.substr(7, 2);
        }
    }
    if (UF == "CE") {
        if (l >= 9) {
            Result = Dado.substr(0, 8) + '-' + Dado.substr(8, 1); //06000001-5
        }
    }
    if (UF == "DF") {
        if (l >= 13) {
            Result = Dado.substr(0, 11) + '-' + Dado.substr(11, 2); //07300001001-09
        }
    }
    if (UF == "ES") {
        if (l >= 9) {
            Result = Dado.substr(0, 8) + '-' + Dado.substr(8, 1); //99999999-0
        }
    }
    if (UF == "GO") {
        if (l >= 9) {
            Result = Dado.substr(0, 2) + '.' + Dado.substr(2, 3) + '.' + Dado.substr(5, 3) + '-' + Dado.substr(8, 1); //10.987.654-7
        }
    }
    if (UF == "MA") {
        if (l >= 9) {
            Result = Dado; //120000385
        }
    }
    if (UF == "MT") {
        if (l >= 11) {
            Result = Dado.substr(0, 10) + '-' + Dado.substr(10, 1); //0013000001-9
        }
    }
    if (UF == "MS") {
        if (l >= 9) {
            Result = Dado; //283115947
        }
    }
    if (UF == "MG") {
        if (l >= 13) {
            Result = Dado.substr(0, 3) + '.' + Dado.substr(3, 3) + '.' + Dado.substr(6, 3) + '/' + Dado.substr(9, 4); //062.307.904/0081
        }
    }
    if (UF == "PA") {
        if (l >= 9) {
            Result = Dado.substr(0, 2) + '-' + Dado.substr(2, 6) + '-' + Dado.substr(8, 1); //15-999999-5
        }
    }
    if (UF == "PB") {
        if (l >= 9) {
            Result = Dado.substr(0, 8) + '-' + Dado.substr(8, 1); //06000001-5
        }
    }
    if (UF == "PE") {
        if (l >= 9) {
            Result = Dado.substr(0, 7) + '-' + Dado.substr(7, 2); //0321418-40
        }
    }
    if (UF == "PI") {
        if (l >= 9) {
            Result = Dado; //012345679
        }
    }
    if (UF == "PR") {
        if (l >= 10) {
            Result = Dado.substr(0, 3) + '.' + Dado.substr(3, 5) + '-' + Dado.substr(8, 2); //123.45678-50
        }
    }
    if (UF == "RJ") {
        if (l >= 8) {
            Result = Dado.substr(0, 2) + '.' + Dado.substr(2, 3) + '.' + Dado.substr(5, 2) + '-' + Dado.substr(7, 1); //99.999.99-3
        }
    }
    if (UF == "RN") {
        if ((l >= 9) && (l < 10)) {
            Result = Dado.substr(0, 2) + '.' + Dado.substr(2, 3) + '.' + Dado.substr(5, 3) + '-' + Dado.substr(8, 1); // c/ 9 dig 20.040.040-1 e c/ 10 dig 20.0.040.040-0
        }
        else if (l >= 10) {
            Result = Dado.substr(0, 2) + '.' + Dado.substr(2, 1) + '.' + Dado.substr(3, 3) + '.' + Dado.substr(6, 3) + '-' + Dado.substr(9, 1); // c/ 9 dig 20.040.040-1 e c/ 10 dig 20.0.040.040-0
        }
    }
    if (UF == "RO") {
        if (l >= 9) {
            Result = Dado.substr(0, 3) + '.' + Dado.substr(3, 5) + '-' + Dado.substr(8, 1); //000.62521-3
        }
    }
    if (UF == "RR") {
        if (l >= 9) {
            Result = Dado.substr(0, 8) + '-' + Dado.substr(8, 1); //24006153-6
        }
    }
    if (UF == "RS") {
        if (l >= 10) {
            Result = Dado.substr(0, 3) + '/' + Dado.substr(3, 7); //224/3658792
        }
    }
    if (UF == "SC") {
        if (l >= 9) {
            Result = Dado.substr(0, 3) + '.' + Dado.substr(3, 3) + '.' + Dado.substr(6, 3); //251.040.852
        }
    }
    if (UF == "SE") {
        if (l >= 9) {
            Result = Dado.substr(0, 8) + '-' + Dado.substr(8, 1); //27123456-3
        }
    }
    if (UF == "SP") {
        if ((l >= 12) && (l < 13)) {
            Result = Dado.substr(0, 3) + '.' + Dado.substr(3, 3) + '.' + Dado.substr(6, 3) + '.' + Dado.substr(9, 3); //110.042.490.114 ou P-01100424.3/002
        }
        else if (l >= 13) {
            Result = Dado.substr(0, 1) + '-' + Dado.substr(1, 8) + '.' + Dado.substr(9, 1) + '/' + Dado.substr(10, 3); //110.042.490.114 ou P-01100424.3/002
        }
    }
    if (UF == "TO") {
        if (l >= 11) {
            Result = Dado.substr(0, 9) + '-' + Dado.substr(9, 2); //290102278-36
        }
    }

    return Result;
}

function fmtTime(Dado) {
    var Result = Dado;
    var l = Dado.length;

    if (l > 1)
        Result = Dado.substr(0, 2) + ':' + Dado.substr(2, 2);

    if (l > 3)
        Result = Dado.substr(0, 2) + ':' + Dado.substr(2, 2) + ':' + Dado.substr(4, 4);

    return Result;
}

function getProgressValue(Objeto) {
    return parseInt(replaceAll(Objeto.childNodes[1].childNodes[0].childNodes[0].childNodes[0].innerText, "%", ""));
}

function keyChar(Evento, Objeto) {
    if (Evento) {
        if (((Evento.keyCode >= 65) && (Evento.keyCode <= 90)) ||
	        ((Evento.keyCode >= 97) && (Evento.keyCode <= 122))) {
            return true;
        }

        cancelKey(Evento);
        return false;
    }
    else if (window.event) {
        if (((window.event.keyCode >= 65) && (window.event.keyCode <= 90)) ||
	        ((window.event.keyCode >= 97) && (window.event.keyCode <= 122))) {
            return true;
        }

        cancelKey(Evento);
        return false;
    }

    return true;
}

function keyLower(Evento, Objeto) {
    if (Evento) {
        if (((Evento.keyCode >= 65) && (Evento.keyCode <= 90)) ||
	        ((Evento.keyCode >= 192) && (Evento.keyCode <= 223) && (Evento.keyCode != 208) && (Evento.keyCode != 215) && (Evento.keyCode != 223))) {
            Evento.keyCode = Evento.keyCode + 32;
            Evento.returnValue = true;

            return true;
        }
    }
    else if (window.event) {
        if (((window.event.keyCode >= 65) && (window.event.keyCode <= 90)) ||
	        ((window.event.keyCode >= 192) && (window.event.keyCode <= 223) && (window.event.keyCode != 208) && (window.event.keyCode != 215) && (window.event.keyCode != 223))) {
            window.event.keyCode = window.event.keyCode + 32;
            window.event.returnValue = true;

            return true;
        }
    }

    return true;
}

function keyNumber(Evento, Objeto) {
    if (Evento) {
        if ((Evento.keyCode < 48) || (Evento.keyCode > 57)) {
            cancelKey(Evento);
            return false;
        }
    }
    else if (window.event) {
        if ((window.event.keyCode < 48) || (window.event.keyCode > 57)) {
            cancelKey(Evento);
            return false;
        }
    }

    return true;
}

/* Função keyPressCEP(Objeto)
   Aplica uma mascara 99999-999 em um campo de cep */
function keyPressCEP(Evento, Objeto) {
    if (!keyNumber(Evento, Objeto))
        return true;

    if (selection(Objeto))
        return true;

    if (Objeto.value.length >= 9) {
        cancelKey(Evento);
        return true;
    }

    if (position(Objeto) != Objeto.value.length)
        return true;

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtCEP(Objeto.value);

    return true;
}

/* Função keyPressCNPJ(Objeto)
   Aplica uma mascara 99.999.999/9999-99 em um campo de cnpj */
function keyPressCNPJ(Evento, Objeto) {
    if (!keyNumber(Evento, Objeto))
        return true;

    if (selection(Objeto))
        return true;

    if (Objeto.value.length >= 18) {
        cancelKey(Evento);
        return true;
    }

    if (position(Objeto) != Objeto.value.length)
        return true;

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtCNPJ(Objeto.value);

    return true;
}

/* Função keyPressCPF(Objeto)
   Aplica uma mascara 999.999.999-99 em um campo de cpf */
function keyPressCPF(Evento, Objeto) {
    if (!keyNumber(Evento, Objeto))
        return true;

    if (selection(Objeto))
        return true;

    if (Objeto.value.length >= 14) {
        cancelKey(Evento);
        return true;
    }

    if (position(Objeto) != Objeto.value.length)
        return true;

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtCPF(Objeto.value);

    return true;
}

/* Função keyPressData(Objeto)
   Aplica uma mascara dd/mm/yyyy em um campo de data */
function keyPressData(Evento, Objeto) {
    if (!keyNumber(Evento, Objeto))
        return true;

    if (selection(Objeto))
        return true;

    if (Objeto.value.length >= 10) {
        cancelKey(Evento);
        return true;
    }

    if (position(Objeto) != Objeto.value.length)
        return true;

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtData(Objeto.value);

    return true;
}

/* Função keyPressDateTime(Objeto)
   Aplica uma mascara dd/mm/yyyy hh:mm:ss em um campo de data */
function keyPressDateTime(Evento, Objeto) {
    if (!keyNumber(Evento, Objeto))
        return true;

    if (selection(Objeto))
        return true;

    if (Objeto.value.length >= 19) {
        cancelKey(Evento);
        return true;
    }

    if (position(Objeto) != Objeto.value.length)
        return true;

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtDateTime(Objeto.value);

    return true;
}

/* Função keyPressDecimal(Objeto)
   Aplica uma mascara para permitir apenas caracteres numÃ©ricos com um limite para casas decimais */
function keyPressDecimal(Evento, Objeto, DecimalPlaces, NegativeNumber) {
    if (((!NegativeNumber) || (Evento.keyCode != 45)) && (!keyNumber(Evento, Objeto)))
        return true;

    if (selection(Objeto))
        return true;

    if ((NegativeNumber) && (Evento.keyCode == 45)) {
        if (position(Objeto) != 0)
            cancelKey(Evento);

        return true;
    }

    if (position(Objeto) != Objeto.value.length)
        return true;

    if (NegativeNumber)
        Objeto.value = passaDominio(Objeto.value, "-0123456789");
    else
        Objeto.value = passaDominio(Objeto.value, "0123456789");

    Objeto.value = fmtDecimal(Objeto.value, parseInt(DecimalPlaces) - 1, false);

    return true;
}

/* Função keyPressEmail(Objeto)
   Aplica uma mascara para caracteres minÃºsculos em um campo de e-mail */
function keyPressEmail(Evento, Objeto) {
    if (!keyLower(Evento, Objeto))
        return true;

    return true;
}

/* Função keyPressFone(Objeto)
   Aplica uma mascara (99)9999-9999 em um campo de telefone */
function keyPressFone(Evento, Objeto) {
    if (!keyNumber(Evento, Objeto))
        return true;

    if (selection(Objeto))
        return true;

    if (Objeto.value.length >= 13) {
        cancelKey(Evento);
        return true;
    }

    if (position(Objeto) != Objeto.value.length)
        return true;

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtFone(Objeto.value, true);

    return true;
}

/* Função keyPressLower(Objeto)
   Aplica uma mascara para caracteres minÃºsculos */
function keyPressLower(Evento, Objeto) {
    if (!keyLower(Evento, Objeto))
        return true;

    return true;
}

/* Função keyPressNumber(Objeto)
   Aplica uma mascara para permitir apenas caracteres numÃ©ricos */
function keyPressNumber(Evento, Objeto) {
    if (!keyNumber(Evento, Objeto))
        return true;

    return true;
}

/* Função keyPressPISPASEP(Objeto)
   Aplica uma mascara 999.99999.99-9 em um campo de pis/pasep */
function keyPressPISPASEP(Evento, Objeto) {
    if (!keyNumber(Evento, Objeto))
        return true;

    if (selection(Objeto))
        return true;

    if (Objeto.value.length >= 14) {
        cancelKey(Evento);
        return true;
    }

    if (position(Objeto) != Objeto.value.length)
        return true;

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtPISPASEP(Objeto.value);

    return true;
}

/* Função keyPressTime(Objeto)
   Aplica uma mascara hh:mm:ss em um campo de data */
function keyPressTime(Evento, Objeto) {
    if (!keyNumber(Evento, Objeto))
        return true;

    if (selection(Objeto))
        return true;

    if (Objeto.value.length >= 8) {
        cancelKey(Evento);
        return true;
    }

    if (position(Objeto) != Objeto.value.length)
        return true;

    Objeto.value = passaDominio(Objeto.value, "0123456789");
    Objeto.value = fmtTime(Objeto.value);

    return true;
}

/* Função keyPressUF(Objeto)
   Aplica uma mascara para caracteres maiÃºsculos em um campo de uf */
function keyPressUF(Evento, Objeto) {
    if (Objeto.value.length >= 2) {
        cancelKey(Evento);
        return true;
    }

    if (!keyChar(Evento, Objeto))
        return true;

    if (!keyUpper(Evento, Objeto))
        return true;

    return true;
}

/* Função keyPressUpper(Objeto)
   Aplica uma mascara para caracteres maiÃºsculos */
function keyPressUpper(Evento, Objeto) {
    if (!keyUpper(Evento, Objeto))
        return true;

    return true;
}

function keyUpper(Evento, Objeto) {
    if (Evento) {
        if (((Evento.keyCode >= 97) && (Evento.keyCode <= 122)) ||
	        ((Evento.keyCode >= 224) && (Evento.keyCode <= 255) && (Evento.keyCode != 240) && (Evento.keyCode != 247) && (Evento.keyCode != 255))) {
            Evento.keyCode = Evento.keyCode - 32;
            Evento.returnValue = true;

            return true;
        }
    }
    else if (window.event) {
        if (((window.event.keyCode >= 97) && (window.event.keyCode <= 122)) ||
	        ((window.event.keyCode >= 224) && (window.event.keyCode <= 255) && (window.event.keyCode != 240) && (window.event.keyCode != 247) && (window.event.keyCode != 255))) {
            window.event.keyCode = window.event.keyCode - 32;
            window.event.returnValue = true;

            return true;
        }
    }

    return true;
}

function loadFlashDocument(FilePath, Height, Width) {
    document.write('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" height="' + Height + '" width="' + Width + '">');
    document.write('    <param name="movie" value="' + FilePath + '">');
    document.write('    <param name="quality" value="high">');
    document.write('    <param name="wmode" value="transparent" />');
    document.write('    <embed wmode="transparent" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" src="' + FilePath + '" height="' + Height + '" width="' + Width + '"></embed>');
    document.write('</object>');
}

function navegaAnterior(Objeto, Registro, Format) {
    if (Objeto == null)
        return false;

    var Linhas = Objeto.childNodes[0];

    for (i = 0; i < Linhas.childNodes.length; i++) {
        if (Linhas.childNodes[i].style.display == '') {
            if (i > 0) {
                Linhas.childNodes[i].style.display = 'none';
                Linhas.childNodes[i - 1].style.display = '';

                Registro.innerText = Format.replace("{0}", i).replace("{1}", Linhas.childNodes.length);

                return false;
            }
        }
    }

    return false;
}

function navegaProximo(Objeto, Registro, Format) {
    if (Objeto == null)
        return false;

    var Linhas = Objeto.childNodes[0];

    for (i = 0; i < Linhas.childNodes.length; i++) {
        if (Linhas.childNodes[i].style.display == '') {
            if (i < (Linhas.childNodes.length - 1)) {
                Linhas.childNodes[i].style.display = 'none';
                Linhas.childNodes[i + 1].style.display = '';

                Registro.innerText = Format.replace("{0}", (i + 2)).replace("{1}", Linhas.childNodes.length);

                return false;
            }
        }
    }

    return false;
}

function passaDominio(StrDado, Dominio) {
    var i, j, c;
    var Result;

    Result = "";

    for (i = 0; i < StrDado.length; i++) {
        c = StrDado.substr(i, 1);

        for (j = 0; j < Dominio.length; j++) {
            if (c == Dominio.substr(j, 1))
                break;
        }

        if (j < Dominio.length)
            Result = Result + c;
    }

    return Result;
}

function position(Objeto) {
    if (document.selection) {
        Objeto.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart('character', -Objeto.value.length);
        return Sel.text.length;
    }
    else if ((Objeto.selectionStart) || (Objeto.selectionStart == "0")) {
        return Objeto.selectionStart;
    }

    return 0;
}

function renameObject(Objeto, Contador) {
    var Count = 0;

    var Pos3 = -1;
    var Pos4 = -1;

    for (Pos = 0; Pos < Objeto.name.length; Pos++) {
        if (Objeto.name.substr(Pos, 1) == '$') {
            Count++;

            if (Count == 3)
                Pos3 = Pos;
            if (Count == 4)
                Pos4 = Pos;
        }
    }

    var contador;

    if (Contador < 10) {
        contador = '00' + Contador;
        contador = contador.substr(contador.length - 2);
    }
    else
        contador = Contador;

    Objeto.name = Objeto.name.substr(0, Pos3 + 4) + contador + Objeto.name.substr(Pos4);

    return true;
}

function replaceAll(String, Old, New) {
    var indexOf = String.indexOf(Old);

    while (indexOf != -1) {
        String = String.replace(Old, New);
        indexOf = String.indexOf(Old);
    }

    return String;
}

function selection(Objeto) {
    var selectedString = "";

    if (window.getSelection)
        selectedString = window.getSelection();
    else if (document.all)
        selectedString = document.selection.createRange().text;
    else if (document.getSelection)
        selectedString = document.getSelection();

    return (selectedString != "");
}

function setProgressValue(Objeto, Value, SetColor) {
    var Coluna1 = Objeto.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
    var Coluna2 = Objeto.childNodes[0].childNodes[0].childNodes[0].childNodes[1];

    if (SetColor) {
        if (Value <= 30)
            Coluna1.style.background = "RGB(255, 106, 106)";
        else if ((Value > 30) && (Value <= 60))
            Coluna1.style.background = "RGB(255, 225, 108)";
        else if ((Value > 60) && (Value <= 99))
            Coluna1.style.background = "RGB(102, 204, 102)";
        else if (Value == 100)
            Coluna1.style.background = "RGB(70, 181, 255)";
    }

    Coluna1.style.width = Value + "%";
    Coluna2.style.width = (100 - Value) + "%";

    if (Value == 0)
        Coluna1.style.display = "none";
    else
        Coluna1.style.display = "";

    if (Value == 100)
        Coluna2.style.display = "none";
    else
        Coluna2.style.display = "";

    Objeto.childNodes[1].childNodes[0].childNodes[0].childNodes[0].innerText = Value + "%";

    return true;
}

function vldCNPJ(Dado) {
    if (Dado == "")
        return true;

    var CNPJ = passaDominio(Dado, "0123456789");

    if (CNPJ.length != 14)
        return false;

    var numstring = "";

    var soma = 0;
    var mult = 5;
    var resultado = 0;

    for (i = 0; i < 12; i++) {
        numstring = (CNPJ.substr(i, 1));
        soma += (parseInt(numstring) * mult--);

        if (mult == 1)
            mult = 9;
    }

    resultado = (11 - (soma % 11));

    if (resultado >= 10)
        resultado = 0;

    var rest1 = resultado;

    soma = 0;
    mult = 6;

    for (i = 0; i < 13; i++) {
        numstring = (CNPJ.substr(i, 1));
        soma += (parseInt(numstring) * mult--);

        if (mult == 1)
            mult = 9;
    }

    resultado = (11 - (soma % 11));

    if (resultado >= 10)
        resultado = 0;

    var rest2 = resultado;

    var digito1 = parseInt(CNPJ.substr(12, 1));
    var digito2 = parseInt(CNPJ.substr(13, 1));

    return ((rest1 == digito1) && (rest2 == digito2));
}

function vldCPF(Dado) {
    if (Dado == "")
        return true;

    var CPF = passaDominio(Dado, "0123456789");

    if ((CPF.length != 11) ||
        (CPF == "00000000000") || (CPF == "11111111111") || (CPF == "22222222222") ||
		(CPF == "33333333333") || (CPF == "44444444444") || (CPF == "55555555555") ||
		(CPF == "66666666666") || (CPF == "77777777777") || (CPF == "88888888888") ||
		(CPF == "99999999999")) {
        return false;
    }

    var soma = 0;
    for (i = 0; i < 9; i++)
        soma += parseInt(CPF.charAt(i)) * (10 - i);

    var resto = 11 - (soma % 11);
    if (resto == 10 || resto == 11)
        resto = 0;

    if (resto != parseInt(CPF.charAt(9)))
        return false;

    soma = 0;
    for (i = 0; i < 10; i++)
        soma += parseInt(CPF.charAt(i)) * (11 - i);

    resto = 11 - (soma % 11);
    if (resto == 10 || resto == 11)
        resto = 0;

    if (resto != parseInt(CPF.charAt(10)))
        return false;

    return true;
}

function vldPISPASEP(Dado) {
    if (Dado == "")
        return true;

    var PISPASEP = passaDominio(Dado, "0123456789");

    if ((PISPASEP.length != 11) ||
        (PISPASEP == "00000000000") || (PISPASEP == "11111111111") || (PISPASEP == "22222222222") ||
		(PISPASEP == "33333333333") || (PISPASEP == "44444444444") || (PISPASEP == "55555555555") ||
		(PISPASEP == "66666666666") || (PISPASEP == "77777777777") || (PISPASEP == "88888888888") ||
		(PISPASEP == "99999999999")) {
        return false;
    }

    var soma = 0;
    for (i = 0; i < 10; i++)
        soma = soma + (PISPASEP.substr(i, 1) * "3298765432".substr(i, 1));

    var resto = (soma % 11);
    if (resto != 0)
        resto = 11 - resto;

    if ((resto == 10) || (resto == 11))
        resto = resto.substr(1, 1);

    return (resto == (PISPASEP.substr(10, 1)));
}

function vldFone(Objeto) {
    var strFormat = /^[(]{1}\d{2}[)]{1}\d{4}[-]{1}\d{4}$/;
    var numFone = Objeto.value;

    numFone = replaceAll(replaceAll(replaceAll(replaceAll(numFone, " ", ""), "(", ""), ")", ""), "-", "");

    if (numFone.length == 0)
        return true;

    if (numFone.length == 10) {
        numFone = fmtFone(numFone, false);

        if (!strFormat.test(numFone)) {
            return false;
        }
        else {
            return true;
        }
    }
}

function treeview_click(sender, e) {
    var obj = (event.srcElement) || (event.target);

    if (obj.tagName == 'IMG') {
        //  expand/collapse
    }

    if (obj.tagName == 'A') {
        //  click
    }

    if (obj.tagName == 'INPUT') {
        var tr = WebForm_GetParentByTagName(obj, 'TR');
        var table = WebForm_GetParentByTagName(tr, 'TABLE');
        var div = null;

        for (var i = 0; i < table.parentElement.children.length; i++) {
            if (table.parentElement.children[i] == table) {
                div = table.parentElement.children[i + 1];
                break;
            }
        }

        if (div == null)
            return;

        for (var i = 0; i < div.children.length; i++) {
            if (div.children[i].tagName == 'TABLE')
                CheckEnableDisable(obj, div.children[i]);
        }
    }
}

function CheckEnableDisable(obj, table) {
    var input = WebForm_GetElementByTagName(table, 'INPUT');
    input.checked = obj.checked;

    var div = null;

    for (var i = 0; i < table.parentElement.children.length; i++) {
        if (table.parentElement.children[i] == table) {
            div = table.parentElement.children[i + 1];
            break;
        }
    }

    if (div == null)
        return;

    for (var i = 0; i < div.children.length; i++) {
        if (div.children[i].tagName == 'TABLE')
            CheckEnableDisable(obj, div.children[i]);
    }
}