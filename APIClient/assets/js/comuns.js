function removerDropDownTreeVazio() {

	var checkInvisible = document.getElementsByClassName("k-top k-top");

	if (checkInvisible != undefined) {
		if (checkInvisible[0].innerText == "")
			checkInvisible[0].style.display = "none";
	}

	var contemVarios = false;

	var span = document.getElementsByTagName("li");

	for (var i = 0; i < span.length; i++) {

		if (span[i].innerText == "Vários")
			contemVarios = true;
	}

	span = document.getElementsByClassName("k-button");

	if (contemVarios) {
		for (var j = 0; j < span.length; j++) {

			if (span[j].localName == "li" && span[j].innerText != "Vários")
				span[j].style.display = "none";
		}
	}
	else {
		for (var x = 0; x < span.length; x++) 
			span[x].style.display = "inline";
		
	}
}

function adicionarClasseExtensao(extension) {

	switch (extension) {
		case '.jpg':
		case '.img':
		case '.png':
		case '.gif':
			return "img-file";
		case '.doc':
		case '.docx':
			return "doc-file";
		case '.xls':
		case '.xlsx':
			return "xls-file";
		case '.pdf':
			return "pdf-file";
		case '.zip':
		case '.rar':
			return "zip-file";
		default:
			return "default-file";
	}
}

function arredondarTamanhoArquivo(tamanho) {

	return Math.round(tamanho / 1024);
}

var messagesColorPicker = {
	apply: "Aplicar",
	cancel: "Cancelar"
}

var pageableMessagesGrid = {
	itemsPerPage: "Clients per page",
	allPages: "All pages",
	empty: "Empty",
	display: "Showing {0}-{1} of {2} registered clients",
	first: "First page",
	previous: "Previous page",
	next: "Next page",
	last: "Last page",
	refresh: "Refresh"
}

var pageableEnum = {
	numeroItensPadrao: 50,
	numeroItensTodos: 1000000,
	buttonCount: 10,
	pageSizes: [10, 20, 30, 40, 50, 100, 1000000]
};

var tipoComponenteEnum = {
	KendoGrid: 1,
	kendoTreeList: 2
}

var pageableSizesGrid = [10, 20, 30, 40, 50, 100, pageableEnum.numeroItensTodos];

function atualizarPaginacaoGrid(dropdown) {

	if (dropdown != null) {

		var items = dropdown.dataSource.data();

		for (var i = 0; i < items.length; i++) {
			if (items[i].value == pageableEnum.numeroItensTodos) {
				items[i].set("text", "Todos");

				if (dropdown.text() == pageableEnum.numeroItensTodos || dropdown.value() == pageableEnum.numeroItensTodos) {
					dropdown.text("Todos");
					dropdown.value(pageableEnum.numeroItensTodos);
				}

				dropdown.refresh();
				break;
			}
		}
	}
}

function salvarPaginacaoGrid(grdGeral, usuarioLogado) {
	if (grdGeral != null) {
		var currentPage = grdGeral.dataSource.page();
		gerenciarDadosNavegacao(storageEnum.SetSessionStorage, usuarioLogado + "pageGrid", currentPage);
		var current = grdGeral.wrapper.children(".k-grid-pager").find("select").data("kendoDropDownList").value();
		gerenciarDadosNavegacao(storageEnum.SetLocalStorage, usuarioLogado + "atualPaginasMax", somenteNumero(current) ? current : pageableEnum.numeroItensPadrao);
	}
}

function salvarPropriedadesDataSource(grdGeral, usuarioLogado) {
	var ds = grdGeral.dataSource;
	var sort = ds.sort();
	if (sort) {
		if (sort.length == 0) {
			gerenciarDadosNavegacao(storageEnum.SetLocalStorage, usuarioLogado + "colSortable", "");
			gerenciarDadosNavegacao(storageEnum.SetLocalStorage, usuarioLogado + "colTypeSortable", "");
		} else {
			for (var i = 0; i < sort.length; i++) {
				gerenciarDadosNavegacao(storageEnum.SetLocalStorage, usuarioLogado + "colSortable", sort[i].field);
				gerenciarDadosNavegacao(storageEnum.SetLocalStorage, usuarioLogado + "colTypeSortable", sort[i].dir);
			}
		}
	}
}

function carregarConfiguracoesListaPadrao(grdGeral, usuarioLogado, tipoComponente) {
	//Oculta header das colunas que possuem botões.
	controlaMenuGrid(grdGeral);

	var kendoDropDownListPaginacao = null;

	if (tipoComponente == tipoComponenteEnum.KendoGrid.valueOf()) {

		//Evento disparado quando trocar o item de quantidade de itens por pagina.
		kendoDropDownListPaginacao = grdGeral.wrapper.children(".k-grid-pager").find("select").data("kendoDropDownList");
		if (kendoDropDownListPaginacao != null) {
			kendoDropDownListPaginacao.bind("change", function (e) {
				salvarPaginacaoGrid(grdGeral, usuarioLogado);
			});
		}
	}

	//Evento disparado com qualquer mudança do data Source.
	grdGeral.dataSource.bind('change', function () {
		if (tipoComponente == tipoComponenteEnum.KendoGrid.valueOf() && kendoDropDownListPaginacao != null)
			atualizarPaginacaoGrid(kendoDropDownListPaginacao);

		salvarPropriedadesDataSource(grdGeral, usuarioLogado);

		if (tipoComponente == tipoComponenteEnum.kendoTreeList.valueOf()) {
			if (pagChild != null && pagChild == true)
				setItem(usuarioLogado, grdGeral, grdGeral.dataSource);
			else
				clearItem(usuarioLogado);
		}
	});

	//Propriedade responsável por configurar o grid como estava no ultimo estado.
	var treeListPropriedades = pegaValorStringJson(gerenciarDadosNavegacao(storageEnum.GetLocalStorage, usuarioLogado + "treeListPropriedades", ""));
	if (treeListPropriedades.length != grdGeral.columns.length) treeListPropriedades = "";
	setarTreeview(grdGeral, treeListPropriedades);

	//Evento disparado quando sair da pagina.
	window.onbeforeunload = function () {
		salvarPropriedadesGrid(grdGeral, usuarioLogado);
		gerenciarDadosNavegacao(storageEnum.SetSessionStorage, usuarioLogado + "filtroDefault", txtFindGrid != null ? txtFindGrid.value : "");
	};
}

function carregarValoresStorage(usuarioLogado) {

	var valores = {};

	if (usuarioLogado != null) {

		if (pagChild != null && pagChild == false) {
			gerenciarDadosNavegacao(storageEnum.RemoveSessionStorage, usuarioLogado + "treeListFilter", "");
			gerenciarDadosNavegacao(storageEnum.RemoveSessionStorage, usuarioLogado + "filtroDefault", "");
		}

		valores = {
			colSortable: gerenciarDadosNavegacao(storageEnum.GetLocalStorage, usuarioLogado + "colSortable", ""),
			colTypeSortable: gerenciarDadosNavegacao(storageEnum.GetLocalStorage, usuarioLogado + "colTypeSortable", ""),
			treeListPropriedades: pegaValorStringJson(gerenciarDadosNavegacao(storageEnum.GetLocalStorage, usuarioLogado + "treeListPropriedades", "")),
			treeListFilter: pagChild != null && pagChild == true ? pegaValorStringJson(gerenciarDadosNavegacao(storageEnum.GetSessionStorage, usuarioLogado + "treeListFilter", "")) : "",
			filtroDefault: pagChild != null && pagChild == true ? pegaValorString(gerenciarDadosNavegacao(storageEnum.GetSessionStorage, usuarioLogado + "filtroDefault", "")) : "",
			pageGrid: pegaValorInteiro(gerenciarDadosNavegacao(storageEnum.GetSessionStorage, usuarioLogado + "pageGrid", ""), 1),
			atualPaginasMax: pegaValorStringDefault(gerenciarDadosNavegacao(storageEnum.GetLocalStorage, usuarioLogado + "atualPaginasMax", ""), pageableEnum.numeroItensPadrao),
			treeListFilhos: JSON.parse(gerenciarDadosNavegacao(storageEnum.GetSessionStorage, usuarioLogado + "treeListFilhos", ""))
		};
	}
	else {
		valores = {
			colSortable: "",
			colTypeSortable: "",
			treeListPropriedades: "",
			treeListFilter: "",
			filtroDefault: "",
			pageGrid: "",
			atualPaginasMax: "",
			treeListFilhos: ""
		};
	}

	return valores;
}

var messagesGrid = {
	loading: "Carregando registros...",
	noRows: "Não existem registros",
	requestFailed: "Falha na requisição dos dados.",
	retry: "Recarregando..."
}

var messagesGridDefault = {
	loading: "Carregando registros...",
	noRows: "Utilize o campo de pesquisa para buscar registros.",
	requestFailed: "Falha na requisição dos dados.",
	retry: "Recarregando..."
}

var filterableMessagesGrid = {
	info: "Título:",
	filter: "Filtrar",
	clear: "Limpar",
	isTrue: "é verdadeiro",
	isFalse: "é falso",
	and: "E",
	or: "Ou"
}

var filterableOperatorsStringGrid = {
	contains: "Contém",
	eq: "Igual a",
	neq: "Diferente de",
	startswith: "Começa com",
	endswith: "Termina em"
}

var filterableOperatorsStringGridDefault = {
	contains: "Contém"
}

var filterableOperatorsNumberGrid = {
	eq: "Igual a",
	neq: "Diferente de",
	gte: "Maior que ou igual a",
	gt: "Maior que",
	lte: "Menor que ou igual a",
	lt: "Menor que"
}

var filterableOperatorsNumberGridDefault = {
	eq: "Igual a"
}

var filterableOperatorsDateGrid = {
	eq: "Igual a",
	neq: "Diferente de",
	gte: "Maior que ou igual a",
	gt: "Maior que",
	lte: "Menor que ou igual a",
	lt: "Menor que"
}

var columnMenuMessagesGrid = {
	filter: "Filter",
	columns: "Columns",
	lock: "Lock",
	unlock: "Unlock"
}

var storageEnum = {
	GetLocalStorage: "GetLocalStorage",
	GetSessionStorage: "GetSessionStorage",
	SetLocalStorage: "SetLocalStorage",
	SetSessionStorage: "SetSessionStorage",
	RemoveLocalStorage: "RemoveLocalStorage",
	RemoveSessionStorage: "RemoveSessionStorage"
};

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/* método para criar os cookie referente a pagina e usuário logado.
 * @param usuario: string com o nome do usuário logado.
 * @param name: string com o nome da cookie a ser salvo.
 * @param value: string com o valor a ser salvo.
 * @param days: com a quantidade de dias a guardar na memória. */
function criarCookie(usuario, name, value, days) {
	var expires = null;
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	}
	else expires = "";
	document.cookie = usuario + "_" + name + "=" + value + expires + "; path=/";
}

/* método para ler os cookie referente a pagina e usuário logado.
 * @param usuario: string com o nome do usuário logado mais a pagina.
 * @param name: string com o nome da cookie a ser lido. */
function lerCookie(usuario, name) {
	var nameEq = usuario + "_" + name + "=";
	var ca = document.cookie.split(";");
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEq) === 0) return c.substring(nameEq.length, c.length);
	}
	return "";
}

/* método para deletar os cookie referente a pagina e usuário logado.
 * @param name: string com o nome da cookie a ser deletado. */
function excluirCookie(usuario, name) {
	criarCookie(usuario, name, "", -1);
}

/* formata data para o formato dd/mm/yyyy HH:mm 
 * @param date -> coma data a ser formatada. */
function formataData(date) {
	return pad_2(date.getDate()) + "/" +
		pad_2(date.getMonth() + 1) + "/" +
		date.getFullYear() + " " +
		pad_2(hours(date)) + ":" +
		pad_2(date.getMinutes());
}

/* formata number
 * @param number -> com o número a ser formatado. */
function pad_2(number) {
	return (number < 10 ? "0" : "") + number;
}

/* formata a hora
 * @param date -> com a data a ser formatada */
function hours(date) {
	var myHours = date.getHours();
	if (myHours > 12)
		return myHours - 12;
	return myHours;
}

/* função para limpa todos item do treelist node */
function clearItem(usuarioLogado) {
	treeListFilhos = [];
	gerenciarDadosNavegacao(storageEnum.SetSessionStorage, usuarioLogado + "treeListFilhos", JSON.stringify(treeListFilhos));
}

/* função para remover item do treelist node */
function removeItem(usuarioLogado, idRow) {
	var result = $.grep(treeListFilhos, function (e) {
		return e.id === idRow;
	});
	if (result.length === 1) {
		for (var x = 0; x < treeListFilhos.length; x++) {
			if (treeListFilhos[x].id === idRow) {
				treeListFilhos.splice(x, 1);
			}
		}
	}
	gerenciarDadosNavegacao(storageEnum.SetSessionStorage, usuarioLogado + "treeListFilhos", JSON.stringify(treeListFilhos));
}

/* função para adicionar item do treelist node */
function addItem(usuarioLogado, idRow) {
	var result = $.grep(treeListFilhos, function (e) {
		return e.id === idRow;
	});
	if (result.length === 0) {
		treeListFilhos.push({
			id: idRow
		});
	}
	gerenciarDadosNavegacao(storageEnum.SetSessionStorage, usuarioLogado + "treeListFilhos", JSON.stringify(treeListFilhos));
}

/* função para set item do treelist node */
function setItem(usuarioLogado, grid, ds) {
	try {
		if (gerenciarDadosNavegacao(storageEnum.GetSessionStorage, usuarioLogado + "treeListFilhos", "") !== null) {
			treeListFilhos = [];
			treeListFilhos = JSON.parse(gerenciarDadosNavegacao(storageEnum.GetSessionStorage, usuarioLogado + "treeListFilhos", ""));
			for (var y = 0; y < treeListFilhos.length; y++) {
				var dsGrid = ds.get(treeListFilhos[y].id);
				if (dsGrid !== undefined) {
					var row = grid.content.find("tr[data-uid=" + dsGrid.uid + "]");
					grid.expand(row);
				}
			}
		}
	} catch (err) { }
}

/* método para pegar os valores das propriedades das colunas 
 * @param name[string] com o nome do controle a ser pesquisado.
 * @param field[string] com o campo a ser pesquisado.
 * @return valor da propriedade. */
function pegaLargura(name, field, valueDefault, treeListPropriedades) {
	if (treeListPropriedades !== "") {
		for (var i = 0; i < treeListPropriedades.length; i++) {
			if (treeListPropriedades[i][0].toString() === name) {
				return parseInt(treeListPropriedades[i][3].toString());
			}
		}
		return valueDefault;
	} else {
		return valueDefault;
	}
}

/* método para pegar os valores dos filtros das colunas 
 * @param name[string] com o nome do controle a ser pesquisado.
 * @param field[string] com o campo a ser pesquisado.
 * @return valor da propriedade. */
function pegaValorFiltros(name, field, treeListFilter) {
	var achou = false;
	if (treeListFilter !== "") {
		for (var i = 0; i < treeListFilter.length; i++) {

			if (treeListFilter[i][0].toString() === name) {
				achou = true;
				if (field === "operator") {
					return treeListFilter[i][1].toString();
				} else if (field === "value") {
					return treeListFilter[i][2].toString();
				} else {
					return "";
				}
			}
		}
		if (!achou) {
			if (field === "operator") {
				return "contains";
			} else {
				return "";
			}
		}

	} else {
		if (field === "operator") {
			return "contains";
		} else {
			return "";
		}
	}
}

/* método para salvar os filtra feito no treelist 
 */
function salvarFiltros(dataSource, usuarioLogado) {
	var retornaListaFiltros = "";
	var filtros = dataSource.filter();
	if (filtros != null) {
		retornaListaFiltros = "[";
		for (var i = 0; i < filtros.filters.length; i++) {
			retornaListaFiltros += "[" + "\"" + filtros.filters[i].field + "\",\"" + filtros.filters[i].operator;
			retornaListaFiltros += "\",\"" + filtros.filters[i].value + "\"],";
		}
		retornaListaFiltros = retornaListaFiltros.substring(0, (retornaListaFiltros.length - 1));
		retornaListaFiltros += "]";
	}
	excluirCookie(usuarioLogado, "treeListFilter");
	criarCookie(usuarioLogado, "treeListFilter", retornaListaFiltros, 90);
}

/* método para salvar os filtra feito no treelist 
 */
function salvarFiltrosGrid(dataSource, usuarioLogado) {
	var retornaListaFiltros = "";
	var filtros = dataSource.filter();
	if (filtros != null) {
		retornaListaFiltros = "[";
		for (var i = 0; i < filtros.filters.length; i++) {
			retornaListaFiltros += "[" + "\"" + filtros.filters[i].field + "\",\"" + filtros.filters[i].operator;
			retornaListaFiltros += "\",\"" + filtros.filters[i].value + "\"],";
		}
		retornaListaFiltros = retornaListaFiltros.substring(0, (retornaListaFiltros.length - 1));
		retornaListaFiltros += "]";
	}
	gerenciarDadosNavegacao(storageEnum.RemoveSessionStorage, usuarioLogado + "treeListFilter", "");
	gerenciarDadosNavegacao(storageEnum.SetSessionStorage, usuarioLogado + "treeListFilter", retornaListaFiltros);
}

/* método para salvar as proproedade do grid
 */
function salvaPropriedades(tlstGeral, usuarioLogado) {
	var retornoList = "[";
	for (var i = 0; i < tlstGeral.columns.length; i++) {
		retornoList += "[" + "\"" + tlstGeral.columns[i].name + "\",\"" + tlstGeral.columns[i].hidden;
		retornoList += "\",\"" + tlstGeral.columns[i].locked + "\",\"" + tlstGeral.columns[i].width + "\"],";
	}
	retornoList = retornoList.substring(0, (retornoList.length - 1));
	retornoList += "]";
	excluirCookie(usuarioLogado, "treeListPropriedades");
	criarCookie(usuarioLogado, "treeListPropriedades", retornoList, 90);
	var currentPagina = tlstGeral.dataSource.page();
	criarCookie(usuarioLogado, "atualPagina", currentPagina, 90);
}

/* método para salvar as proproedade do grid
 */
function salvarPropriedadesGrid(tlstGeral, usuarioLogado) {
	var retornoList = "[";
	for (var i = 0; i < tlstGeral.columns.length; i++) {
		retornoList += "[" + "\"" + tlstGeral.columns[i].name + "\",\"" + tlstGeral.columns[i].hidden;
		retornoList += "\",\"" + tlstGeral.columns[i].locked + "\",\"" + tlstGeral.columns[i].width + "\"],";
	}
	retornoList = retornoList.substring(0, (retornoList.length - 1));
	retornoList += "]";
	gerenciarDadosNavegacao(storageEnum.RemoveLocalStorage, usuarioLogado + "treeListPropriedades", "");
	gerenciarDadosNavegacao(storageEnum.SetLocalStorage, usuarioLogado + "treeListPropriedades", retornoList);
	gerenciarDadosNavegacao(storageEnum.SetSessionStorage, usuarioLogado + "atualPagina", tlstGeral.dataSource.page());
}

/* configurar as colunas com botões */
function controlaMenuGrid(gridGeral) {
	for (var i = 0; i < gridGeral.columns.length; i++) {
		if (gridGeral.columns[i].name != undefined) {
			if (gridGeral.columns[i].name.substring(0, 3).toUpperCase() === "BTN")
				$("#" + gridGeral.element[0].id + " .k-header-column-menu").eq(i).hide();
		}
	}
}

/* método para pegar os valores das propriedades das colunas 
 * @param name[string] com o nome do controle a ser pesquisado.
 * @param field[string] com o campo a ser pesquisado.
 * @return valor da propriedade. */
function pegaValorPropriedades(name, field, treeListPropriedades) {
	if (treeListPropriedades !== "") {
		for (var i = 0; i < treeListPropriedades.length; i++) {
			if (treeListPropriedades[i][0].toString() === name) {
				if (field === "hidden") {
					return treeListPropriedades[i][1].toString();
				} else if (field === "locked") {
					return treeListPropriedades[i][2].toString();
				} else if (field === "width") {
					return parseInt(treeListPropriedades[i][3].toString());
				} else {
					return "";
				}
			}
		}
		return "";
	} else {
		return "";
	}
}

/** Exibe o ícone de refresh com animação no lugar do ícone padrão de um botão enquanto sua ação é executada. 
    A ação deve ter começo e fim. Por exemplo, uma pesquisa, um carregamento de treeview ou janela pop-up.    
    Ao finalizar a ação, utilizar a função "ocultaAnimacaoBotao". 
    Parâmetro controle: id do botão que foi clicado. **/
function exibirAnimacaoBotao(controle) {
	var ctl = $(controle);
	$(controle + " i").removeClass(ctl[0].name);
	$(controle + " i").addClass("glyphicon glyphicon-refresh");
	$(controle + " i").addClass("CarregandoExibir");
	$(controle + " i").removeClass("CarregandoOcultar");
}

/** Oculta o ícone de refresh com animação e reexibe o ícone padrão de um botão após sua ação ser executada.     
    Parâmetro controle: id do botão que foi clicado. **/
function ocultarAnimacaoBotao(controle) {
	var ctl = $(controle);
	$(controle + " i").removeClass("CarregandoExibir");
	$(controle + " i").removeClass("glyphicon glyphicon-refresh");
	$(controle + " i").addClass(ctl[0].name);
	$(controle + " i").addClass("carregamentoParar");
}

/* método para pegar valores boolean.
 * @param value: com o valor a ser pego.
 * @return Boolean com true ou false. */
function pegaValorBoolean(value) {
	if (value === "true") {
		return true;
	} else {
		return false;
	}
}

/* método para manipular o storage da pagina.
 * @param storageEnum com o tipo de storage 
 * @param key com a chave da pesquisa.
 * @param value com o valor para função opcional pode ser passado vazio */
function gerenciarDadosNavegacao(storageEnum, key, value) {
	var retornoStorage = "";
	if (localStorage !== undefined && sessionStorage !== undefined) {
		if (storageEnum === "GetLocalStorage")
			retornoStorage = localStorage.getItem(key);
		else if (storageEnum === "GetSessionStorage")
			retornoStorage = sessionStorage.getItem(key);
		else if (storageEnum === "SetLocalStorage")
			localStorage.setItem(key, value);
		else if (storageEnum === "SetSessionStorage")
			sessionStorage.setItem(key, value);
		else if (storageEnum === "RemoveLocalStorage")
			localStorage.removeItem(key);
		else if (storageEnum === "RemoveSessionStorage")
			sessionStorage.removeItem(key);
	}
	return retornoStorage;
}

/* método validar valor é null retorna vazio ou o valor correto. 
 * @param value valor informado. */
function pegaValorString(value) {
	if (value === null) {
		return "";
	} else {
		return value;
	}
}

/* método validar valor é null retorna vazio ou o valor correto. 
 * @param value valor informado. */
function pegaValorStringDefault(value, valueDefault) {
	if (value === null) {
		return valueDefault;
	} else {
		return value;
	}
}

/* método validar valor é null retorna vazio ou o valor com tipo json correto. 
 * @param value valor informado. */
function pegaValorStringJson(value) {
	if (value === null || value === "") {
		return "";
	} else {
		return JSON.parse(value);
	}
}

/* método validar valor é null retorna vazio ou o valor inteiro correto. 
 * @param value valor informado. */
function pegaValorInt(value) {
	if (value === null) {
		return "";
	} else {
		return value;
	}
}

function centralizarNotificacao(e) {
	$(e.element)[0].parentElement.style.left = Math.floor($(window).width() / 2 - ($(e.element)[0].children[0].clientWidth) / 2) + "px";
	$(e.element)[0].parentElement.style.minWidth = "300px";
}

/* método para validar o tamanho da tela 
 * @param [Height] - com o tamanho a ser validado */
function validaAlturaTela(myHeight) {
	var altura = $(window).height();
	if (altura < myHeight) {
		document.body.style.overflowY = "scroll";
	} else {
		document.body.style.overflowY = "hidden";
	}
}

/* método para setar o grid com todas sua propriedade 
*/
function setarGrid(grids, treeListPropriedades) {
	if (treeListPropriedades !== "") {
		for (var i = 0; i < treeListPropriedades.length; i++) {
			for (var y = 0; y < grids.columns.length; y++) {
				if (treeListPropriedades[i][0].toString() === grids.columns[y].name) {
					grids.reorderColumn(i, grids.columns[y]);
					break;
				}
			}
		}
		for (var z = 0; z < grids.columns.length; z++) {
			if (pegaValorPropriedades(grids.columns[z].name, "hidden", treeListPropriedades) === "true") {
				grids.hideColumn(z);
			} else {
				grids.showColumn(z);
			}
			if (pegaValorPropriedades(grids.columns[z].name, "locked", treeListPropriedades) === "true") {
				grids.lockColumn(z);
			} else {
				grids.unlockColumn(z);
			}
		}
	}
}

/* método para setar o treeview com todas sua propriedade 
*/
function setarTreeview(tlstGeral, treeListPropriedades) {
	try {
		if (treeListPropriedades !== "") {
			for (var y = 0; y < tlstGeral.columns.length; y++) {
				//      tlstGeral.columns[y].width = pegaValorPropriedades(tlstGeral.columns[y].name, "width", treeListPropriedades);
				if (pegaValorPropriedades(tlstGeral.columns[y].name, "hidden", treeListPropriedades) === "true") {
					tlstGeral.hideColumn(y);
				} else {
					tlstGeral.showColumn(y);
				}
				if (pegaValorPropriedades(tlstGeral.columns[y].name, "locked", treeListPropriedades) === "true") {
					tlstGeral.lockColumn(y);
				} else {
					tlstGeral.unlockColumn(y);
				}
			}
			for (var ii = 0; ii < treeListPropriedades.length; ii++) {
				for (var zz = 0; zz < tlstGeral.columns.length; zz++) {
					if (treeListPropriedades[ii][0].toString() === tlstGeral.columns[zz].name) {
						tlstGeral.reorderColumn(ii, tlstGeral.columns[zz]);
						break;
					}
				}
			}
		}
	}
	catch (err) {
	}
}

/* método para procurar valor dentro de uma array
 */
function procuraValorArray(myArray, valor) {
	var retorno = "";
	for (var r = 0; r < myArray.length; r++) {
		if (myArray[r][0].toString() === valor) {
			retorno = r;
		}
	}
	return retorno;
}

/* método para setar o grid com seus filtros 
*/
function setarFiltros(dataSourceGrid, treeListFilter) {
	for (var y = 0; y < dataSourceGrid.options.filter.length; y++) {
		dataSourceGrid.options.filter[y].operator = pegaValorFiltros(dataSourceGrid.options.filter[y].field, "operator", treeListFilter);
		dataSourceGrid.options.filter[y].value = pegaValorFiltros(dataSourceGrid.options.filter[y].field, "value", treeListFilter);
	}
}

/* método para pegar todos os elemento com os atributos
 * @param atribute -> com o atributo a ser pesquisado. */
function pegaTodosElementosAtributos(attribute, treeListFilter) {
	var matchingElements = [];
	var allElements = document.getElementsByTagName("*");
	for (var i = 0, n = allElements.length; i < n; i++) {
		// verifica se os elementos não estão nulos
		if (allElements[i].getAttribute(attribute) !== null) {
			matchingElements.push(allElements[i]);
			allElements[i].style.backgroundImage = "none";
			if (pegaValorFiltros(allElements[i].dataset.field, "value", treeListFilter) !== "") {
				allElements[i].style.backgroundImage = "url('../../../imagens/filter.png')";
				allElements[i].style.backgroundRepeat = "no-repeat";
				allElements[i].style.backgroundPosition = "right 20px bottom";
			}
		}
	}
	return matchingElements;
}


/* método para pegar todos os elemento com os atributos
 * @param atribute -> com o atributo a ser pesquisado. */
function pegaTodosElementosAtributosGrid(attribute) {
	var matchingElements = [];
	var allElements = document.getElementsByTagName("*");
	for (var i = 0, n = allElements.length; i < n; i++) {
		// verifica se os elementos não estão nulos
		if (allElements[i].getAttribute(attribute) !== null) {
			matchingElements.push(allElements[i]);
			allElements[i].style.backgroundImage = "none";
		}
	}
	return matchingElements;
}

/** Exibição de feedbacks para o usuário nos formulários após clicar em Salvar:   
    Tipo Alerta:  campos inválidos ou obrigatórios não preenchidos.                  
    Tipo Erro:    erro ao tentar executar a operação.                                   
    Tipo Sucesso: informativo de que a operação foi executada com sucesso. 
    Parametro tipo: tipo de mensagem que será exibida (tipos acima).
    Parametro contexto: id do objeto que vai conter a mensagem.
    Parametro texto: texto da mensagem. Se não for passado, vai mostrar os textos padrão. */
function exibirAlerta(tipo, contexto, texto) {

	var str = "";
	if (tipo === "alerta")
		str = "<span class='k-icon k-warning' style='vertical-align:text-bottom'> </span> " + (texto || "Por favor, preencha corretamente os dados solicitados.");
	else if (tipo === "sucesso")
		str = "<span class='glyphicon glyphicon-ok'></span> " + (texto || "Dados salvos com sucesso.");
	else if (tipo === "erro")
		str = "<span class='glyphicon glyphicon-alert'></span> " + (texto || "Não foi possível completar a operação devido a erros. <br>Por favor, tente novamente.");

	$(contexto).html(str);
	$(contexto).show("fast");
}

/** Exibição de mensagens de confirmação
    Parametro titulo: título da mensagem.
    Parametro mensagem: texto da mensagem. */
function mensagemConfirmacao(titulo, mensagem) {
	var dfd = new jQuery.Deferred();
	var result = false;

	$("<div id=\"confirmBoxWindow\" class=\"k-widget\"></div>").appendTo("body").kendoWindow({
		title: titulo,
		modal: true,
		visible: false,
		close: function (e) {
			this.destroy();
			dfd.resolve(result);
		}
	}).data("kendoWindow").content($(confirmBoxTemplate).html()).center().open();

	$("#confirmBoxMessage").html(mensagem);

	$("#confirmBoxYesButton").click(function () {
		result = true;
		$("#confirmBoxWindow").data("kendoWindow").close();
	});

	$("#confirmBoxNoButton").click(function () {
		$("#confirmBoxWindow").data("kendoWindow").close();
	});

	return dfd.promise();
};

/** Exibição de vídeos de ajuda ao usuário
    Parametro titulo: título do vídeo.
    Parametro id: identificador do vídeo no youtube. */
function exibirVideoModulo(titulo, id) {
	$("<div class=\"k-widget\" style=\"display: none;\"></div>").appendTo("body").kendoWindow({
		title: titulo,
		modal: true,
		visible: false,
		height: "80%",
		width: "80%",
		content: "https://www.youtube.com/embed/" + id + "?autoplay=1",
		iframe: true,
		actions: ["Maximize", "Close"],
		close: function (e) {
			this.destroy();
		}
	}).data("kendoWindow").center().open();
};

/** Limpa as mensagens de alerta, erro ou sucesso que podem estar sendo exibidas. 
    Chamar esta função antes de exibir qualquer mensagem de feedback nos formulários. */
function limparMensagens() {
	$("#msgAlerta").html(""); $("#msgSucesso").html(""); $("#msgErro").html("");
	$("#msgAlerta").hide(); $("#msgSucesso").hide(); $("#msgErro").hide();
}

/** Exibe/oculta ícones que indicam o carregamento de informações. 
    Parâmetro idObjAcao: id do elemento que vai ser exibido ou ocultado.     
    Parêmetro acao: "exibir" ou "ocultar". */
function exibirOcultarAnimacaoCarregando(idObjAcao, acao) {
	if (acao == "exibir") {
		$("#" + idObjAcao + " span").addClass("CarregandoExibir");
		$("#" + idObjAcao + " span").removeClass("CarregandoOcultar");
		document.getElementById(idObjAcao).style.display = 'inherit';
	} else {
		$("#" + idObjAcao + " span").addClass("CarregandoOcultar");
		$("#" + idObjAcao + " span").removeClass("CarregandoExibir");
		document.getElementById(idObjAcao).style.display = 'none';
	}
}

/** Exibe o ícone de refresh com animação no lugar do ícone padrão de um botão enquanto sua ação é executada. 
    A ação deve ter começo e fim. Por exemplo, uma pesquisa, um carregamento de treeview ou janela pop-up.    
    Ao finalizar a ação, utilizar a função "ocultaAnimacaoBotao". 
    Parâmetro controle: id do botão que foi clicado. **/
function exibirAnimacaoCarregandoBotao(controle) {
	// declara e define variáveis
	var ctl = $(controle);
	// pega o split do controle
	var retorno = ctl[0].name.split("/");
	// define valores para class
	$(controle + " i").addClass("CarregandoExibir");
	$(controle + " i").removeClass("CarregandoOcultar");
	$(controle + " i").removeClass(retorno[1].toString());
	// define class de espera ou processamento
	if (retorno[0].toString().toLowerCase() == 'load') {
		$(controle + " i").addClass("glyphicon glyphicon-refresh");
		//$(controle + " i").style("FontSize","18px");//("glyphicon glyphicon-refresh");

	} else {
		$(controle + " i").addClass("glyphicon glyphicon-hourglass");
	}
}

/** Oculta o ícone de refresh com animação e reexibe o ícone padrão de um botão após sua ação ser executada.     
    Parâmetro controle: id do botão que foi clicado. **/
function ocultarAnimacaoCarregandoBotao(controle) {
	// declara e define valor para variável
	var ctl = $(controle);
	// split no controle para pegar valores
	var retorno = ctl[0].name.split("/");
	// define valores para controle de class
	$(controle + " i").removeClass("CarregandoExibir");
	// verifica se é carregamento ou processamento
	if (retorno[0].toString().toLowerCase() == 'load') {
		$(controle + " i").removeClass("glyphicon glyphicon-refresh");

	} else {
		$(controle + " i").removeClass("glyphicon glyphicon-hourglass");
	}
	// define valor par controle
	if (retorno[1] != null)
		$(controle + " i").addClass(retorno[1].toString());

	$(controle + " i").addClass("carregamentoParar");
}

/** Exibe o ícone de refresh com animação no lugar do ícone padrão de um botão enquanto sua ação é executada. 
    A ação deve ter começo e fim. Por exemplo, uma pesquisa, um carregamento de treeview ou janela pop-up.    
    Ao finalizar a ação, utilizar a função "ocultaAnimacaoBotao". 
    Parâmetro controle: id do botão que foi clicado. **/
function exibirAnimacaoCarregandoDiv(controle) {
	// declara e define variáveis
	var ctl = $(controle);
	// define valores para class
	$(controle + " i").addClass("CarregandoExibir");
	$(controle + " i").removeClass("CarregandoOcultar");
	$(controle + " i").removeClass("glyphicon glyphicon-filter");
	$(controle + " i").addClass("glyphicon glyphicon-refresh");
}


function ConverterDatetimeJS(ds) {
	var d = ds.match(/(\d+)/)[1];
	return new Date(+d).toLocaleDateString();
}

/*
 * Função que lê os parametros da URL, quando o tipo da requisição é GET
 */
function RequisicaoLerParametro(nomeParametro) {

	var url = window.location.search.replace("?", "");

	var itens = url.split("&");

	for (n in itens) {

		if (itens[n].match(nomeParametro)) {
			return decodeURIComponent(itens[n].replace(nomeParametro + "=", ""));
		}
	}

	return null;
}

/*
 * Formata o número com pontos e 2 casas decimais.
 * Ex: 1.560.250,77
 */
function FormatarMoeda(num) {
	x = 0;

	if (num < 0) {
		num = Math.abs(num);
		x = 1;
	}

	if (isNaN(num))
		num = "0";

	cents = Math.floor((num * 100 + 0.5) % 100);
	num = Math.floor((num * 100 + 0.5) / 100).toString();

	if (cents < 10)
		cents = "0" + cents;

	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3));

	ret = num + ',' + cents;

	if (x == 1)
		ret = ' - ' + ret;

	return ret;
}

/*
 * Formata o número com pontos e 0 casas decimais.
 * Ex: 2.560.250
 */
function FormatarNumero(num) {
	x = 0;
	if (num < 0) {
		num = Math.abs(num);
		x = 1;
	}
	if (isNaN(num)) num = "0";

	num = Math.floor((num * 100 + 0.5) / 100).toString();

	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3)); if (x == 1) num = ' - ' + num;
	return num;
}

/*
 * Redefine a altura de elementos para telas que utilizam o conteúdo e grid elásticos
 */
function definirAlturaBipConteudoElastico() {
	alturaJanela = $(window).innerHeight();

	var novaAlturaConteudo = (alturaJanela - 125); // Altura da janela - altura cabeçalho

	$('.bip-conteudo-elastico .col-xs-12').css('height', novaAlturaConteudo);
	$('.bip-conteudo-elastico .col-xs-12 .card').css('height', novaAlturaConteudo);

	var alturaCabecalhoCard = $('.bip-conteudo-elastico .card-head').css('height');
	alturaCabecalhoCard = alturaCabecalhoCard.replace("px", "");

	var novaAlturaGrid = (novaAlturaConteudo * 0.99) - (parseInt(alturaCabecalhoCard) + 20); // 99% da Altura do conteúdo - altura cabeçalho card + 20

	var gridElement = $('.bip-conteudo-elastico .col-xs-12 .bip-grid-elastico');

	gridElement.css('height', novaAlturaGrid);
	gridElement.css('width', gridElement.css('width') + 1);
	$('.bip-conteudo-elastico .col-xs-12 .bip-grid-elastico .k-tree-list').css('height', novaAlturaGrid);
	$('.bip-conteudo-elastico .col-xs-12 .bip-grid-elastico .k-grid-content-locked').css('height', novaAlturaGrid - 30);
	$('.bip-conteudo-elastico .col-xs-12 .bip-grid-elastico .k-grid-content').css('height', novaAlturaGrid - 30);

	//ajusta o comprimento do grid para aqueles que possuem colunas congeladas
	if (gridElement.innerWidth() > 0) {
		gridElement.children(".k-grid-content").width(gridElement.innerWidth() - gridElement.children(".k-grid-content-locked").innerWidth() - 1);
	}
}

function definirAlturaBipConteudoElasticoRelatorio() {
	alturaJanela = $(window).innerHeight();

	var novaAlturaConteudo = (alturaJanela - 125); // Altura da janela - altura cabeçalho

	$('.bip-conteudo-elastico .col-xs-12').css('height', novaAlturaConteudo);
	$('.bip-conteudo-elastico .col-xs-12 .card').css('height', novaAlturaConteudo);

	var alturaCabecalhoCard = $('.bip-conteudo-elastico .card-head').css('height');
	alturaCabecalhoCard = alturaCabecalhoCard.replace("px", "");

	var novaAlturaGrid = (novaAlturaConteudo * 0.99) - (parseInt(alturaCabecalhoCard) + 35); // 99% da Altura do conteúdo - altura cabeçalho card + 35

	var gridElement = $('.bip-conteudo-elastico .col-xs-12 .bip-grid-elastico');

	gridElement.css('height', novaAlturaGrid);
	gridElement.css('width', gridElement.css('width') + 1);
	$('.bip-conteudo-elastico .col-xs-12 .bip-grid-elastico .k-tree-list').css('height', novaAlturaGrid);
	$('.bip-conteudo-elastico .col-xs-12 .bip-grid-elastico .k-grid-content-locked').css('height', novaAlturaGrid - 70);
	$('.bip-conteudo-elastico .col-xs-12 .bip-grid-elastico .k-grid-content').css('height', novaAlturaGrid - 70);

	//ajusta o comprimento do grid para aqueles que possuem colunas congeladas
	if (gridElement.innerWidth() > 0) {
		gridElement.children(".k-grid-content").width(gridElement.innerWidth() - gridElement.children(".k-grid-content-locked").innerWidth() - 1);
	}
}

function somenteNumero(obj) {

	return !jQuery.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
}

function removerAcento(strToReplace) {

	str_acento = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
	str_sem_acento = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";

	var nova = "";
	if (strToReplace !== null) {
		for (var i = 0; i < strToReplace.length; i++) {

			if (str_acento.indexOf(strToReplace.charAt(i)) != -1)
				nova += str_sem_acento.substr(str_acento.search(strToReplace.substr(i, 1)), 1);
			else
				nova += strToReplace.substr(i, 1);
		}
	}

	return nova;
}

function pegaValorInteiro(value, valueDefault) {
	if (value === null) {
		return valueDefault;
	} else {
		return value;
	}
}

function somenteMaiusculo(componente) {
	componente.value = componente.value.toUpperCase();
	return true;
}

/* Funções para exibir ícone e tooltip de ajuda em campos de texto e combos dos formulários */
$(".ajuda-form-campo").focus(function (e) {
	exibirAjudaForm(this.id);
});

$(".ajuda-form-campo").blur(function (e) {
	ocultarAjudaForm(this.id);
});

function exibirAjudaFormCombo(e) {
	var nomeCombo = e.sender.ul[0].id;
	nomeCombo = nomeCombo.substring(0, nomeCombo.indexOf("_"));
	exibirAjudaForm(nomeCombo);
}

function ocultarAjudaFormCombo(e) {
	var nomeCombo = e.sender.ul[0].id;
	nomeCombo = nomeCombo.substring(0, nomeCombo.indexOf("_"));
	ocultarAjudaForm(nomeCombo);
}

function exibirAjudaForm(campo) {
	$("#ajuda-form-" + campo).fadeIn("fast");
	$("#ajuda-form-" + campo).show();

	//Para utilizar a tooltip do jQuery
	//$("#ajuda-form-" + campo).tooltip();

	$("#ajuda-form-" + campo).kendoTooltip({
		autoHide: true,
		position: "top",
		width: 250,
		showAfter: 500,
		animation: {
			open: {
				effects: "fade:in",
				duration: 200
			}, close: {
				effects: "fade:out",
				duration: 500
			}
		}
	});
}

function ocultarAjudaForm(campo) {
	$("#ajuda-form-" + campo).fadeOut('fast');
}

// #endregion

var resultadoExecucaoEnum = {
	Sucesso: 1,
    Erro: 2,
    Invalido: 3
}

var tipoFiltroDownloadEnum =
{
	CheckBoxList: 1,
	DropDownList: 2,
	DatePicker: 3
};

function formatarDataJson(dataAtualizacao) {
	try {
		if (dataAtualizacao == null)
			return "";

		var data = new Date(parseInt(dataAtualizacao.replace('/Date(', '')));

		if (data == "Invalid Date")
			return "";

		return kendo.toString(data, "g");

	} catch (e) {
		return "";
	}
}

function verificarAcao(next) {

	$.ajax({
		type: "POST",
		dataType: "jsonp",
		url: "../../../sistemas/portal/servicos/systemServico.svc/VerificarIntegracao",
		contentType: "application/json; charset=utf-8",
		cache: false,
		success: function (msg) {
			next(msg);
		},
		error: function (data) {
			alert(data.status + ' ' + data.statusText);
		}
	});
}

function validarAcao(grid) {

	/* Upload - Verifica se existe processo */
	verificarAcao(function (integracao) {

		if (integracao == null) {
			$('[verificarUpload]').css('opacity', '0.6');
			$('[verificarDownload]').css('opacity', '0.6');
		}

		else {

			if (!integracao.ExibirUpload)
				$('[verificarUpload]').css('opacity', '0.6');
			else {
				$('[verificarUpload]').click(function (e) {
					$.ajax({
						type: "POST",
						dataType: "jsonp",
						url: "../../../sistemas/adm/servicos/segurancaServico.svc/RecuperarGrupoInterfaceModuloAtivo",
						contentType: "application/json; charset=utf-8",
						cache: false,
						success: function (response) {
							if (response.ResultadoExecucaoEnum == resultadoExecucaoEnum.Erro.valueOf())
								alert(response.Message);
							else
								carregarUpload(response.Data, integracao.DescricaoGrupoInterface, grid);
						},
						error: function (data) {
							alert(data.status + ' ' + data.statusText);
						}
					});
				});
			}

			if (!integracao.ExibirDownload)
				$('[verificarDownload]').css('opacity', '0.6');
			else {
				$('[verificarDownload]').click(function (e) {
					if (this.disabled)
						return e.preventDefault();

					$.ajax({
						type: "POST",
						dataType: "jsonp",
						url: "../../../sistemas/adm/servicos/segurancaServico.svc/RecuperarGrupoInterfaceModuloAtivo",
						contentType: "application/json; charset=utf-8",
						cache: false,
						success: function (response) {
							if (response.ResultadoExecucaoEnum == resultadoExecucaoEnum.Erro.valueOf())
								alert(response.Message);
							else
								carregarDownload(response.Data, integracao.DescricaoGrupoInterface);
						},
						error: function (data) {
							alert(data.status + ' ' + data.statusText);
						}
					});
				});
			}
		}
	});
}

// #region Download/Upload
function carregarDownload(codigoGrupoInterface, descricaoGrupoInterface) {

	var dfd = new jQuery.Deferred();

	$.ajax({
		type: "POST",
		dataType: "jsonp",
		url: "../../../sistemas/portal/servicos/systemServico.svc/RecuperarListaFiltroDownload",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({
			'codigoGrupoInterface': codigoGrupoInterface
		}),
		cache: false,
		success: function (response) {

			if (response.ResultadoExecucaoEnum == resultadoExecucaoEnum.Sucesso.valueOf() && response.Data.length > 0) {

				var html = '<div id="modalFiltroDownload" class="modal fade" role="dialog">';
				html += '<div class="modal-dialog modal-lg">';
				html += '<div class="modal-content">';
				html += '<div class="modal-header">';
				html += '  <header style="padding-left: 12px; font-size: 16px;">';
				html += '      <button type="button" class="close" data-dismiss="modal">&times;</button>';
				html += '      <i class="fa fa-download">&nbsp; <span>Download - ' + descricaoGrupoInterface + '</span> ';
				html += '      </i>';
				html += '  </header>';
				html += '</div>';
				html += '<form class="col-md-12" role="form" style="top: 10px; padding-left:0px"><ul id="fieldlist"><li id="dfilters"></li></ul></form>';
				html += '<div class="col-md-12" id="divMensagem" style="height: 20px;">';
				html += '   <div id="msgAlerta" class="alert alert-warning alerta-geral"></div> ';
				html += '</div> ';
				html += '<div class="col-md-12" style="height: 20px;"/>';
				html += '<div style="text-align: right; margin:10px">';
				html += '  <button type="button" style="margin: 10px;" class="k-button k-primary" onclick="executarDownload(true)" id="btnFiltroDownload"><i class="fa fa-check"></i>&nbsp;Download&nbsp;</button>';
				html += '  <button type="button" style="margin: 10px;" class="k-button k-button-cancel" id="btnCancelarDownload" data-dismiss="modal"><i class="fa fa-check"></i>&nbsp;Cancelar&nbsp;</button>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				html += '<style> #dfilters > li label {text-align: left; width:100%}  </style>'

				$(html).appendTo("body");

				$('#modalFiltroDownload').modal({ backdrop: 'static', keyboard: false, show: false });

				$('#modalFiltroDownload').on('shown.bs.modal', function (e) {
					validator = $("#dfilters").kendoValidator().data("kendoValidator");

					$('#modalFiltroDownload').on('hidden.bs.modal', function (e) {
						$("#modalFiltroDownload").remove();
					})
				})

				var dictFilter = '';
				var dicFiltroDownload = [];

				var rExecucao = response.Data;

				//Carrega o dicionario na memoria para conseguir resgatar os valores em tempo de execução
				for (var i = 0; i < rExecucao.length; i++) {

					dictFilter += dictFilter == '' ? 'filter' + rExecucao[i].CodigoFiltroDownload + ',' + rExecucao[i].CodigoTipoFiltroDownload + ',' + rExecucao[i].NomeParametro : '|' + 'filter' + rExecucao[i].CodigoFiltroDownload + ',' + rExecucao[i].CodigoTipoFiltroDownload + ',' + rExecucao[i].NomeParametro;

					dicFiltroDownload.push(
						{
							key: rExecucao[i].CodigoFiltroDownload,
							value: {
								CodigoTipoFiltroDownload: rExecucao[i].CodigoTipoFiltroDownload,
								DescricaoFiltroDownload: rExecucao[i].DescricaoFiltroDownload,
								NomeParametro: rExecucao[i].NomeParametro,
								PossuiDependencia: rExecucao[i].PossuiDependencia,
								PossuiDependente: rExecucao[i].PossuiDependente,
								Consulta: rExecucao[i].Consulta,
								NumeroColunas: rExecucao[i].NumeroColunas,
								Obrigatorio: rExecucao[i].Obrigatorio
							}
						});
				}

				// Cria os componentes dentro do Popup de Download
				$.each(dicFiltroDownload, function (key, filtro) {

					var idComponente = 'filter' + filtro.key;

					filters = $("#dfilters");

					if (filtro.value.CodigoTipoFiltroDownload == tipoFiltroDownloadEnum.DatePicker.valueOf()) {
						filters.append($('<li class="col-md-' + filtro.value.NumeroColunas + '"  style="height:80px;"> <label ' + (!filtro.value.Obrigatorio ? 'class="campoOpcional"' : '') + '><b>' + filtro.value.DescricaoFiltroDownload + '</b></label>  <input style="width:100%;" name="_' + idComponente + '" id="' + idComponente + '" type="text" ' + (filtro.value.Obrigatorio ? 'required validationmessage=" "' : '') + '  /><span class="k-invalid-msg" id="span_' + idComponente + '" data-for="_' + idComponente + '"></span></li>'));

						$("#" + idComponente).kendoDatePicker({
							animation: false,
						}).data("kendoDatePicker");
					}

					else {

						var dataSource = new kendo.data.DataSource({
							schema: {
								data: "Data"
							},
							transport: {
								read: {
									url: "../../../sistemas/portal/servicos/systemServico.svc/RecuperarListaDinamica",
									contentType: "application/json; charset=utf-8",
									dataType: "jsonp",
									type: "POST"
								},
								parameterMap: function (data, operation) {

									if (operation == "read") {

										if (filtro.value.PossuiDependencia) {

											$.ajax({
												type: "POST",
												dataType: "jsonp",
												url: "../../../sistemas/portal/servicos/systemServico.svc/RecuperarListaDependencia",
												contentType: "application/json; charset=utf-8",
												data: JSON.stringify({
													'codigoFiltroDownload': filtro.key
												}),
												cache: false,
												async: false,
												success: function (resultado) {
													if (resultado.ResultadoExecucaoEnum == resultadoExecucaoEnum.Sucesso.valueOf()) {
														if (filtro != null) {

															var consulta = filtro.value.Consulta;

															for (var y = 0; y < resultado.Data.length; y++) {
																var componente = null;
																var dado = resultado.Data;

																if (dado[y].CodigoTipoFiltroDownload == 1) {
																	componente = $("#filter" + dado[y].CodigoFiltroDownload).data('kendoMultiSelect');

																	var valorReplace = '';

																	if (componente != null) {

																		for (var c = 0; c < componente.value().length; c++) {
																			valorReplace += '{' + componente.value()[c] + '}';
																		}
																		consulta = consulta.replace(dado[y].DescricaoFiltroDownload, (valorReplace != "" ? ("'" + valorReplace + "'") : "NULL"));
																	}
																	else {
																		consulta = consulta.replace(dado[y].DescricaoFiltroDownload, (valorReplace != "" ? ("'" + valorReplace + "'") : "NULL"));
																	}
																}
																else if (dado[y].CodigoTipoFiltroDownload == 2) {
																	componente = $("#filter" + dado[y].CodigoFiltroDownload).data('kendoDropDownList');
																	consulta = consulta.replace(dado[y].DescricaoFiltroDownload, (componente != null && componente.value() != "" ? ("'" + componente.value() + "'") : "NULL"));
																}
															}

															data.consulta = consulta;
														}
													}
													else
														$.when(mensagemInformacao("Erro", resultado.Mensagem)).then(function (confirmou) { });

												}
											});
										}
										else
											data.consulta = filtro.value.Consulta;
									}

									return JSON.stringify(data);
								}
							}
						});

						if (filtro.value.CodigoTipoFiltroDownload == tipoFiltroDownloadEnum.CheckBoxList.valueOf()) {
							filters.append($('<li class="col-md-' + filtro.value.NumeroColunas + '"  style="height:80px;"> <label ' + (!filtro.value.Obrigatorio ? 'class="campoOpcional"' : '') + '><b>' + filtro.value.DescricaoFiltroDownload + '</b></label>  <select multiple="multiple"  style="width:100%" name="_' + idComponente + '" id="' + idComponente + '" type="text" ' + (filtro.value.Obrigatorio ? 'required validationmessage=" "' : '') + '  /><span class="k-invalid-msg" id="span_' + idComponente + '" data-for="_' + idComponente + '"></span></li>'));

							$("#" + idComponente).kendoMultiSelect({
								placeholder: "Selecione...",
								filter: "contains",
								change: function (e) {
									if (filtro.value.PossuiDependente) {
										atualizarFiltrosDependentesDownload(filtro.key);
									}
								},
								dataSource: dataSource,
								dataTextField: "descricao",
								dataValueField: "codigo"
							}).data("kendoMultiSelect");
						}

						else if (filtro.value.CodigoTipoFiltroDownload == tipoFiltroDownloadEnum.DropDownList.valueOf()) {
							filters.append($('<li class="col-md-' + filtro.value.NumeroColunas + '"  style="height:80px;"> <label ' + (!filtro.value.Obrigatorio ? 'class="campoOpcional"' : '') + '><b>' + filtro.value.DescricaoFiltroDownload + '</b></label>  <input style="width:100%;" name="_' + idComponente + '" id="' + idComponente + '" type="text" ' + (filtro.value.Obrigatorio ? 'required validationmessage=" "' : '') + '  /><span class="k-invalid-msg" id="span_' + idComponente + '" data-for="_' + idComponente + '"></span></li>'));

							$("#" + idComponente).kendoDropDownList({
								optionLabel: "Selecione...",
								dataTextField: "descricao",
								dataValueField: "codigo",
								filter: "contains",
								change: function (e) {
									if (filtro.value.PossuiDependente) {
										atualizarFiltrosDependentesDownload(filtro.key);
									}
								},
								dataSource: dataSource
							}).data("kendoDropDownList");
						}
					}
				});

				$("#modalFiltroDownload").modal();

				gerenciarDadosNavegacao(storageEnum.SetSessionStorage, codigoUsuarioLogado + "codigoGrupoInterface", codigoGrupoInterface);
				gerenciarDadosNavegacao(storageEnum.SetSessionStorage, codigoUsuarioLogado + "dictFilter", dictFilter);

				return dfd.promise();
			}


			else {
				gerenciarDadosNavegacao(storageEnum.SetSessionStorage, codigoUsuarioLogado + "codigoGrupoInterface", codigoGrupoInterface);
				executarDownload(false);
			}

		},
		error: function (data) {
			$("#modalFiltroDownload").remove();
		}
	});
};

function removerString(value, sep) {
	sep = sep || ':';
	return value.substr(value.indexOf(sep) + 1, value.length)
}

function executarDownload(possuiFiltro) {

	var codigoGrupoInterface = gerenciarDadosNavegacao(storageEnum.GetSessionStorage, codigoUsuarioLogado + "codigoGrupoInterface", "");
	var ajax = null;

	if (possuiFiltro) {

		$('#modalFiltroDownload').on('hidden.bs.modal', function () {

			if (ajax != null) {
				ajax.abort();
				ajax = null;
			}

			$("#modalFiltroDownload").remove();
		})

		if (validator.validate()) {

			$("#msgAlerta").hide();

			var dictFilter = gerenciarDadosNavegacao(storageEnum.GetSessionStorage, codigoUsuarioLogado + "dictFilter", "").split('|');
			var dictParameters = '';
			var parametro = '';
			var valido = true;

			for (var i = 0; i < dictFilter.length; i++) {
				var valores = dictFilter[i].split(',');

				var idComponente = valores[0];
				var tipoComponenteId = valores[1];
				var nomeParametro = valores[2];

				if (tipoComponenteId == tipoFiltroDownloadEnum.CheckBoxList.valueOf()) {

					parametro = '';
					var multiSelectItems = $('#' + idComponente).data('kendoMultiSelect');
					var valor = multiSelectItems.value();

					for (var j = 0; j < valor.length; j++) {
						parametro += '{' + valor[j] + '}';
					}

					dictParameters += dictParameters == '' ? nomeParametro + ',' + parametro : '|' + nomeParametro + ',' + parametro;
				}

				else if (tipoComponenteId == tipoFiltroDownloadEnum.DropDownList.valueOf()) {
					var dropDownList = $('#' + idComponente).data('kendoDropDownList');
					parametro = dropDownList.value();

					dictParameters += dictParameters == '' ? nomeParametro + ',' + parametro : '|' + nomeParametro + ',' + parametro;
				}

				else if (tipoComponenteId == tipoFiltroDownloadEnum.DatePicker.valueOf()) {
					var datePicker = $('#' + idComponente).data('kendoDatePicker');
					parametro = datePicker._oldText;

					dictParameters += dictParameters == '' ? nomeParametro + ',' + parametro : '|' + nomeParametro + ',' + parametro;
				}
			}

			var parametros = '?codigoGrupoInterface=' + codigoGrupoInterface;
			parametros += '&considerarData=1';
			parametros += '&considerarCaracterEspecial=0';
			parametros += '&filtro=' + dictParameters;

			verificarStatusDownloadIntegracao();
			window.location = "../../../sistemas/portal/download/downloadIntegracao.aspx" + parametros;
		}
		else
			exibirAlerta("alerta", $("#msgAlerta"));
	}
	else {
		var parametros = '?codigoGrupoInterface=' + codigoGrupoInterface;
		parametros += '&considerarData=1';
		parametros += '&considerarCaracterEspecial=0';

		verificarStatusDownloadIntegracao();
		window.location = "../../../sistemas/portal/download/downloadIntegracao.aspx" + parametros;
	}
}

function verificarStatusDownloadIntegracao() {
	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		url: "../../../sistemas/portal/servicos/systemServico.svc/VerificarStatusDownload",
		data: JSON.stringify({}),
		dataType: "json",
		success: function (response) {

			var status = response.d;

			if (status == "2" || status == "0") // Processamento | Não Iniciado
				setTimeout("verificarStatusDownloadIntegracao()", 1000);
			else if (status == "3") // Erro
			{
				$.when(mensagemInformacao("Informação", "Ocorreu um erro na geração da apresentação!")).then(function (confirmou) { });
			}
		}
	});
}

function exportarExcel(parametro, codigoGrupoInterface, nomeArquivo, considerarData) {

	var parametros = '?codigoGrupoInterface=' + codigoGrupoInterface;
	parametros += '&nomeArquivo=' + nomeArquivo;
	parametros += '&considerarData=' + (considerarData ? 1 : 0);
	parametros += '&considerarCaracterEspecial=1';
	parametros += '&filtro=' + parametro;
	window.location = "../../../sistemas/portal/download/downloadIntegracao.aspx" + parametros;
}

function carregarUpload(codigoGrupoInterface, descricaoGrupoInterface, grid, parametros) {

	var dfd = new jQuery.Deferred();

	var codigoBisTransacao = null;
	var files = null;
	var notificarMensagem = true;

	var html = ' <div id="modalUpload" class="modal fade" role="dialog"> ';
	html += '     <div class="modal-dialog modal-lg"> ';
	html += '         <div class="modal-content" style="height: 650px"> ';
	html += '             <div class="modal-header"> ';
	html += '                 <header style="padding-left: 12px; font-size: 16px;"> ';
	html += '                     <button type="button" class="close" data-dismiss="modal">&times;</button> ';
	html += '                     <i class="fa fa-upload"></i>&nbsp; <span>Upload - ' + descricaoGrupoInterface + '</span> ';
	html += '                 </header> ';
	html += '                 <div> ';
	html += '                     <ul class="nav nav-tabs" data-toggle="tabs" style="margin-left: 0px; font-size: 10pt; cursor: pointer; margin-top:10px"> ';
	html += '                         <li class="active" id="liCarregar"><a id="carregar" tabindex="1">CARREGAR</a></li> ';
	html += '                         <li id="liHistorico"><a id="historico" tabindex="2">HISTÓRICO</a></li> ';
	html += '                     </ul> ';
	html += '                     <div id="divArquivo" class="modal-body" style="height:460px"> ';
	html += '                         <div id="dfiles"></div> ';
	html += '                         <div style="margin-top: 10px;"> ';
	html += '                             <div id="gridInconsistencia"></div> ';
	html += '                         </div> ';
	html += '                     </div> ';
	html += '                     <div id="divHistorico" style="margin-top: 10px;height:450px"> ';
	html += '                         <div id="gridHistoricoUpload"></div> ';
	html += '                     </div> ';
	html += '                     <div class="modal-footer"> ';
	html += '                         <button type="button" class="k-button k-button-cancel" data-dismiss="modal"><i class="fa fa-check"></i>&nbsp;&nbsp;Fechar&nbsp;&nbsp;</button> ';
	html += '                     </div> ';
	html += '                 </div> ';
	html += '             </div> ';
	html += '         </div> ';
	html += '     </div> ';
	html += ' </div> ';

	$(html).appendTo("body");

	$("#carregar").click(function () {
		if ($("#liCarregar")[0].className == "active")
			return;

		$("#divArquivo").fadeIn("fast");
		$("#divHistorico").hide();

		$("#liCarregar").addClass("active");
		$("#liHistorico").removeClass("active");

		$("#gridInconsistencia .k-grid-content").css("height", "210px");
		$("#gridHistoricoUpload .k-grid-content").css("height", "210px");
	});

	$("#historico").click(function () {
		if ($("#liHistorico")[0].className == "active")
			return;

		$("#divHistorico").fadeIn("fast");
		$("#divArquivo").hide();

		$("#liHistorico").addClass("active");
		$("#liCarregar").removeClass("active");

		$("#gridInconsistencia .k-grid-content").css("height", "368px");
		$("#gridHistoricoUpload .k-grid-content").css("height", "368px");
	});

	$('#modalUpload').modal({ backdrop: 'static', keyboard: false, show: false });

	$('#modalUpload').on('shown.bs.modal', function (e) {
		$('#modalUpload').on('hidden.bs.modal', function (e) {
			$("#modalUpload").remove();
			if (grid != null)
				grid.dataSource.read();
		})
	})

	var dataSourceHistorico = new kendo.data.DataSource({
		serverPaging: true,
		serverFiltering: true,
		serverSorting: true,
		batch: true,
		pageSize: 20,
		schema: {
			data: "Data",
			total: "Total",
			model: {
				fields: {
					CodigoTransacao: { type: "string", nullable: false },
					Conexao: { type: "string", nullable: false },
					EstadoTransacao: { type: "string", nullable: false },
					DataInicio: { type: "string", nullable: false },
					DataFim: { type: "string", nullable: false },
					NomeUsuario: { type: "string", nullable: false }
				}
			},
		},
		transport: {
			read: {
				url: "../../../sistemas/portal/servicos/systemServico.svc/RecuperarListaHistoricoUpload",
				contentType: "application/json; charset=utf-8",
				dataType: "jsonp",
				type: "POST"
			},
			parameterMap: function (data, operation) {
				if (operation == "read")
					data.codigoGrupoInterface = codigoGrupoInterface;

				return JSON.stringify(data);
			}
		}
	});

	$("#gridHistoricoUpload").kendoGrid({
		dataSource: dataSourceHistorico,
		reorderable: true,
		resizable: true,
		sortable: true,
		detailInit: detailInit,
		filterable: {
			messages: filterableMessagesGrid,
			extra: false,
			operators: {
				string: filterableOperatorsStringGridDefault,
				number: filterableOperatorsNumberGrid,
				date: filterableOperatorsDateGrid
			}
		},
		pageable: {
			refresh: true,
			buttonCount: pageableEnum.buttonCount,
			pageSizes: pageableEnum.pageSizes,
			messages: pageableMessagesGrid
		},
		columns: [{ name: "CodigoTransacao", field: "CodigoTransacao", title: "Transação", width: 110, hidden: false, locked: false },
		{ name: "Conexao", field: "Conexao", title: "Arquivo", width: 230, hidden: false, locked: false },
		{ name: "EstadoTransacao", field: "EstadoTransacao", title: "Estado Transação", width: 150, hidden: false, locked: false },
		{ name: "DataInicio", field: "DataInicio", title: "Data Início", width: 150, hidden: false, locked: false },
		{ name: "DataFim", field: "DataFim", title: "Data Fim", width: 150, hidden: false, locked: false },
		{ name: "NomeUsuario", field: "NomeUsuario", title: "Usuário", width: 150, hidden: false, locked: false }]

	}).data("kendoGrid");

	$("#divHistorico").hide();
	$('#gridInconsistencia').hide();

	files = $("#dfiles");
	files.append($('<input name="files" id="files" type="file" accept=".xls,.xlsx,.xlsm"/>'));

	$("#files").kendoUpload({
		multiple: false,
		async: {
			saveUrl: "../../../sistemas/portal/servicos/systemServico.svc/UploadExcel",
			autoUpload: false
		},
		upload: function (e) {
			e.data = {
				codigoGrupoInterface: codigoGrupoInterface,
				parametros: parametros
			};
		},
		localization: {
			select: 'Selecionar Arquivo',
			remove: '',
			cancel: '',
			clearSelectedFiles: "Remover",
			uploadSelectedFiles: 'Upload',
			invalidFileExtension: "Somente é possivel o formato xls/xlsx/xlsm !",
			invalidMaxFileSize: "Valor máximo permitido para upload é de 20MB !"
		},
		validation: {
			maxFileSize: 20971520,
			allowedExtensions: [".xls", ".xlsx", ".xlsm"]
		},
		select: function (e) {
			$('#gridInconsistencia').hide();
		},
		success: function (response) {

			if (response.response.d.ResultadoExecucaoEnum == resultadoExecucaoEnum.Sucesso.valueOf()) {

				var codigoBisTransacao = response.response.d.Data;

				if (codigoBisTransacao != 0) {

					notificarMensagem = true;

					dataSourceMaster = new kendo.data.DataSource({
						serverPaging: true,
						serverFiltering: true,
						serverSorting: true,
						pageSize: 10,
						async: false,
						batch: true,
						schema: {
							model: {
								Linha: { type: "string", nullable: false },
								Descricao: { type: "string", nullable: false },
								Tipo: { type: "string", nullable: false }
							},
							data: "Data",
							total: "Total"
						},
						transport: {
							read: {
								url: "../../../sistemas/portal/servicos/systemServico.svc/RecuperarListaInconsistencia",
								contentType: "application/json; charset=utf-8",
								dataType: "jsonp",
								type: "POST"
							},
							parameterMap: function (data, operation) {

								if (operation == "read")
									data.codigoBisTransacao = codigoBisTransacao;

								return JSON.stringify(data);
							}
						}
					});

					$("#gridInconsistencia").kendoGrid({
						dataSource: dataSourceMaster,
						reorderable: true,
						resizable: true,
						sortable: true,
						dataBound: function (e) {
							if (dataSourceMaster.page() == 1 && notificarMensagem == true) {
								if (dataSourceMaster.total() > 0) {
									$("#gridInconsistencia .k-grid-content").css("height", "210px");
									$('#gridInconsistencia').show();

									var upload = $("#files").data("kendoUpload");
									upload.clearAllFiles();

									notification.show({ title: "Erro no processo", message: "Falha ao realizar upload, porém existe algumas inconsistências!" }, "notificacao-erro");
								} else {

									$('#gridInconsistencia').hide();
									notification.show({ title: "Confirmação", message: "Upload realizado com sucesso!" }, "notificacao-sucesso");

									$(".k-widget.k-upload").find("ul").remove();

									if (grid != null)
										grid.dataSource.read();
								}

								notificarMensagem = false;
							}
						},
						pageable: {
							refresh: true,
							buttonCount: pageableEnum.buttonCount,
							pageSizes: pageableEnum.pageSizes,
							messages: pageableMessagesGrid
						},
						filterable: {
							messages: filterableMessagesGrid,
							extra: false,
							operators: {
								string: filterableOperatorsStringGridDefault,
								number: filterableOperatorsNumberGrid,
								date: filterableOperatorsDateGrid
							}
						},
						columns: [{ name: "Linha", field: "Linha", title: "   Linha", width: 150, hidden: false, locked: false },
						{ name: "Descricao", field: "Descricao", title: "   Descrição", encoded: false, width: 150, hidden: false, locked: false },
						{ name: "Tipo", field: "Tipo", title: "   Tipo", width: 150, hidden: false, locked: false }]
					}).data("kendoGrid");
				}
			}

			else {
				$.when(mensagemInformacao("Erro", response.response.d.Mensagem)).then(function (confirmou) { });

				var upload = $("#files").data("kendoUpload");
				upload.clearAllFiles();

				$('#gridInconsistencia').hide();
			}

			$("#gridHistoricoUpload").data('kendoGrid').dataSource.read();
			$("#gridHistoricoUpload").data('kendoGrid').refresh();
		},
		error: function (e) {
			if (e.operation == "upload") {
				$.when(mensagemInformacao("Erro", "Falha ao carregar arquivo !")).then(function (confirmou) { });
			}
		},

	});

	function detailInit(e) {

		itemSelecionado = e.data;

		var dataSourceDetalhe = new kendo.data.DataSource({
			serverPaging: true,
			serverFiltering: true,
			serverSorting: true,
			pageSize: 10,
			async: false,
			batch: true,
			schema: {
				data: "Data",
				total: "Total",
				model: {
					Linha: { type: "string", nullable: false },
					Descricao: { type: "string", nullable: false },
					Tipo: { type: "string", nullable: false }
				}
			},
			transport: {
				read: {
					url: "../../../sistemas/portal/servicos/systemServico.svc/RecuperarListaInconsistencia",
					contentType: "application/json; charset=utf-8",
					dataType: "jsonp",
					type: "POST"
				},
				parameterMap: function (data, operation) {

					if (operation == "read")
						data.codigoBisTransacao = itemSelecionado.CodigoTransacao;

					return JSON.stringify(data);
				}
			}
		});

		$("<div id='detalheGrid" + itemSelecionado.CodigoTransacao + "'/>").appendTo(e.detailCell).kendoGrid({
			dataSource: dataSourceDetalhe,
			pageable: true,
			reorderable: true,
			resizable: true,
			sortable: true,
			filterable: {
				messages: filterableMessagesGrid,
				extra: false,
				operators: {
					string: filterableOperatorsStringGridDefault,
					number: filterableOperatorsNumberGrid,
					date: filterableOperatorsDateGrid
				}
			},
			columns: [{ name: "Linha", field: "Linha", title: "   Linha", width: 150, hidden: false, locked: false },
			{ name: "Descricao", field: "Descricao", title: "   Descrição", encoded: false, width: 150, hidden: false, locked: false },
			{ name: "Tipo", field: "Tipo", title: "   Tipo", width: 150, hidden: false, locked: false }]
		});
	}

	$("#modalUpload").modal();
}

function atualizarFiltrosDependentesDownload(codigoFiltroDownload) {
	$.ajax({
		type: "POST",
		dataType: "jsonp",
		url: "../../../sistemas/portal/servicos/systemServico.svc/RecuperarListaDependente",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify({
			'codigoFiltroDownload': codigoFiltroDownload
		}),
		cache: false,
		async: false,
		success: function (response) {

			if (response.ResultadoExecucaoEnum == resultadoExecucaoEnum.Sucesso.valueOf() && response.Data.length != null) {

				var dado = response.Data;

				for (var y = 0; y < dado.length; y++) {
					var componente = null;

					if (dado[y].CodigoTipoFiltroDownload == 1) {
						componente = $("#filter" + dado[y].CodigoFiltroDownload).data('kendoMultiSelect');
						if (componente != null && componente.dataSource != null) {
							componente.dataSource.read();
							componente.refresh();
						}
					}
					else if (dado[y].CodigoTipoFiltroDownload == 2) {
						componente = $("#filter" + dado[y].CodigoFiltroDownload).data('kendoDropDownList');
						if (componente != null && componente.dataSource != null) {
							componente.dataSource.read();
							componente.refresh();
						}
					}
				}
			}
			else
				$.when(mensagemInformacao("Erro", response.Mensagem)).then(function (confirmou) { });
		}
	});
}

function formatarDataJsonFormatData(dataJson) {
	try {

		if (dataJson == null)
			return "";

		var data = new Date(parseInt(dataJson.replace('/Date(', '')));

		if (data == "Invalid Date")
			return "";

		return data;

	} catch (e) {
		return "";
	}
}

function formatarDataJsonFormat(dataAtualizacao, tipo) {
	try {

		if (dataAtualizacao == null)
			return "";

		var data = new Date(parseInt(dataAtualizacao.replace('/Date(', '')));

		if (data == "Invalid Date")
			return "";

		return kendo.toString(data, tipo);

	} catch (e) {
		return "";
	}
}