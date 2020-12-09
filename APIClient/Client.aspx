<%@ Page Language="C#" MasterPageFile="~/masterNOVA.Master" AutoEventWireup="true" CodeBehind="Client.aspx.cs" Inherits="APIClient.Client" %>

<%--<%@ Import Namespace="tripper.gescon.web.sistemas.portal.system" %>--%>

<asp:Content ID="ctHeader" ContentPlaceHolderID="cphEstilosCabecalho" runat="server">
    <style>
        .card-head {
            border-bottom: 1px solid #969696;
        }

        .tools {
            padding-right: 8px;
            height: 100%;
            width: auto;
            display: flex;
            justify-content: right;
            text-align: right;
            padding-right: 0;
        }

        .tool-item {
            height: 32px;
            width: auto;
            margin-right: 1rem;
        }
    </style>
</asp:Content>

<asp:Content ID="ctScripts" ContentPlaceHolderID="cphScripts" runat="server">

    <script>    

        var grdClient = null;
        var ColumnsGridClient = [];
        var notificationSpan = null;

        $(document).ready(function () {
            kendo.culture("pt-BR");

            btnAddClient = $("#btnAddClient").kendoButton({
                click: btnAddClient_onClick
            }).data("kendoButton");

            notificationSpan = $("#notificationSpan").kendoNotification({
                position: {
                    pinned: true,
                    top: 72,
                    left: Math.floor($(window).width() / 2 - 300)
                },
                show: centralizarNotificacao,
                autoHideAfter: 3000,
                stacking: "down",
                templates: [{ type: "notificacao-sucesso", template: $("#successTemplate").html() },
                { type: "notificacao-erro", template: $("#errorTemplate").html() }]
            }).data("kendoNotification");

            LoadGridClient();
        });

        //events
        function excluir(e) {

            var dataGrdClient = $("#grdClient").data("kendoGrid");
            var tr = $(e).closest("tr");
            var dataItem = dataGrdClient.dataItem(tr);
            var IdClient = dataItem.IdClient;
            var NameClient = dataItem.NameClient;

            var url = "https://avaliacao1.azurewebsites.net/api/v1/client/clients/" + IdClient;

            $.when(mensagemConfirmacao("Deseja excluir o cliente " + NameClient + "?")).then(function (confirmed) {
                if (confirmed) {
                    $.ajax({
                        type: "DELETE",
                        url: url.toString(),
                        contentType: "application/json; charset=utf-8",
                        success: function (response) {
                            notificationSpan.show({ message: response.Message }, "notificacao-sucesso");
                            grdClient.dataSource.read();
                        },
                        error: function () {
                            notificationSpan.show({ message: response.Message }, "notificacao-erro");
                            grdClient.dataSource.read();
                        }
                    });
                }
                else {
                    $("#grdClient").data("kendoGrid").refresh();
                }
            });
        }

        function alterar(e) {

            var datagrdClient = $("#grdClient").data("kendoGrid");
            var tr = $(e).closest("tr");
            var dataItem = datagrdClient.dataItem(tr);
            var IdClient = dataItem.IdClient;

            location.href = "ClientRegister.aspx?IdClient=" + IdClient;
        }

        function btnAddClient_onClick() {
            location.href = "ClientRegister.aspx?IdClient=0";
        }
        //methods
        function LoadGridClient() {

            dataSourceClient = new kendo.data.DataSource({
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
                pageSize: 10,
                batch: true,
                schema: {
                    data: "Data",
                    model: {
                        id: "IdClient",
                        fields: {
                            IdClient: { type: "string" },
                            NameClient: { type: "string" }
                        }
                    }
                },
                transport: {
                    read: {
                        url: "https://avaliacao1.azurewebsites.net/api/v1/client/clients/",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        type: "GET",
                        cache: false
                    },
                    parameterMap: function (data) {
                        kendo.ui.progress($("#grdGeral"), false);
                        return JSON.stringify(data);
                    }
                },
                logic: "and",
            });

            ColumnsGridClient.push({ name: "btnAlterar", template: $("#btn-templateAlterar").html(), width: 33, lockable: false, locked: true, sortable: false, filterable: false });
            ColumnsGridClient.push({ name: "btnExcluir", template: $("#btn-templateExcluir").html(), width: 33, lockable: false, locked: true, sortable: false, filterable: false });
            ColumnsGridClient.push({ name: "NameClient", field: "NameClient", title: "Name", width: 250, filterable: true, sortable: true, hidden: false, locked: false });
            ColumnsGridClient.push({});

            grdClient = $("#grdClient").kendoGrid({
                dataSource: dataSourceClient,
                pageable: true,
                reorderable: true,
                resizable: true,
                persistSelection: true,
                sortable: true,
                messages: messagesGrid,
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
                    buttonCount: 10,
                    pageSizes: [10, 20, 30, 40, 50],
                    messages: pageableMessagesGrid
                },
                columnMenu: {
                    sortable: false,
                    messages: columnMenuMessagesGrid
                },
                columns: ColumnsGridClient
            }).data("kendoGrid");

            $("#grdClient").kendoTooltip({
                filter: "th",
                position: "top",
                showAfter: 1000,
                animation: {
                    open: {
                        effects: "fade:in",
                        duration: 200
                    }, close: {
                        effects: "fade:out",
                        duration: 500
                    }
                },
                content: function (e) {
                    var target = e.target;
                    if (target[0].dataset.field == "NameClient")
                        return "Name";
                    else
                        return "";
                }
            });
        }

    </script>

    <script id="btn-templateExcluir" type="text/x-kendo-template">
        <div style='text-align:center;'><a id='btnExc#=IdClient#' title='Excluir: #=NameClient#' name='fa fa-minus-square' onclick="excluir(this)" class='k-grid-Delete' href='\\#' ><i class='fa fa-minus-square'></i></a></div>
    </script>

    <script id="btn-templateAlterar" type="text/x-kendo-template">
        <div style='text-align:center;'><a id='btnExc#=IdClient#' title='Alterar: #=NameClient#' name='glyphicon glyphicon-edit' onclick="alterar(this)" class='k-grid-Update' href='\\#' style='color:\\#D65F16; font-size: 12pt;'><i class="fas fa-edit"></i></a></div>
    </script>

    <script id="successTemplate" type="text/x-kendo-template">
        <div class="notificacao-sucesso"><p><i class="fa fa-check"></i>&nbsp; #= message #</p></div>
    </script>

    <script id="errorTemplate" type="text/x-kendo-template">
        <div class="notificacao-erro"><p><i class="fa fa-close"></i>&nbsp; #= message #</p></div>
    </script>

</asp:Content>

<asp:Content ID="ctConteudo" ContentPlaceHolderID="cphConteudo" runat="server">
    <section>
        <div class="section-body bip-conteudo-elastico">
            <div class="row">
                <div class="col-xs-12">
                    <div class="card">
                        <div class="card-head">
                            <header style="padding-left: 15px"><i class="fas fa-list"></i> Clients list</header>
                            <div class="tools" style="">
                                <button class="k-button k-primary tool-item" tabindex="3" type="button" id="btnAddClient" name="load/fa fa-plus-square"><i class="fa fa-plus-square"></i>&nbsp;&nbsp;NOVO</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="grdClient" class="bip-grid-elastico"></div>
                            <span id="notificationSpan" style="display: none;"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</asp:Content>
