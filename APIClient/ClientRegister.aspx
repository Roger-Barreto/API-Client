<%@ Page Language="C#" MasterPageFile="~/masterNOVA.Master" AutoEventWireup="true" CodeBehind="ClientRegister.aspx.cs" Inherits="APIClient.ClientRegister" %>


<%--<%@ Import Namespace="tripper.gescon.web.sistemas.portal.system" %>--%>

<asp:Content ID="ctHeader" ContentPlaceHolderID="cphEstilosCabecalho" runat="server">
    <style>
        .tools {
            height: 100%;
            width: 50%;
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

        .card {
            padding-right: 25px;
        }

        .card-head{
            border-bottom: 1px solid #969696;
        }

        #frmClient {
            padding: 20px;
            width: 50%;
            height: 100%;
            margin-left: 20px;
            display: flex;
            flex-direction: column;
        }

        .frm-group {
            display: flex;
            justify-content: right;
            text-align: right;
            margin-bottom: 25px;
        }

            .frm-group label {
                margin-right: 10px;
            }

        #btnSave {
            margin-right: 10px;
        }

        @media (max-width: 800px) {
            #frmClient {
                width: 100%;
            }
        }
    </style>
</asp:Content>

<asp:Content ID="ctScripts" ContentPlaceHolderID="cphScripts" runat="server">
    <script>
        var btnCancel = null;
        var btnSave = null;
        var txtClientName = null;
        var txtClientName = null;
        var ParameterIdClient = RequisicaoLerParametro("IdClient");

        $(document).ready(function () {
            kendo.culture("pt-BR");

            btnCancel = $("#btnCancel").kendoButton({
                click: btnCancel_onClick
            }).data("kendoButton");
            txtClientName = document.getElementById("txtClientName");

            if (ParameterIdClient != 0) {
                LoadFilds(ParameterIdClient);
                btnSave = $("#btnSave").kendoButton({
                    click: btnUpdate_onClick
                }).data("kendoButton");
            }
            else {
                btnSave = $("#btnSave").kendoButton({
                    click: btnRegister_onClick
                }).data("kendoButton");
            }
        });

        //methods

        function GUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        function LoadFilds(IdClient) {
            var url = "https://avaliacao1.azurewebsites.net/api/v1/client/clients/" + IdClient;

            $.ajax({
                url: url.toString(),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                type: "GET",                
                success: function (response) {
                    txtClientName.value = response.Data.NameClient;
                },
                error: function (e) {
                    //
                }
            });
        }

        //Events
        function btnCancel_onClick() {
            location.href = "Client.aspx";
        }

        function btnRegister_onClick() {
            var idClient = GUID();
            var data = JSON.stringify({
                'IdClient': idClient,
                'NameClient': txtClientName.value
            });

            $.ajax({
                type: "POST",
                url: "https://avaliacao1.azurewebsites.net/api/v1/client/clients",
                contentType: "application/json",
                dataType: "json",
                data: data,
                success: function (response) {
                    location.href = "Client.aspx";
                },
                error: function (e) {
                    //
                }
            });
        }

        function btnUpdate_onClick() {

            var data = JSON.stringify({
                'IdClient': ParameterIdClient,
                'NameClient': txtClientName.value
            });

            $.ajax({
                type: "PUT",
                url: "https://avaliacao1.azurewebsites.net/api/v1/client/clients",
                contentType: "application/json",
                dataType: "json",
                data: data,
                success: function (response) {
                    location.href = "Client.aspx";
                },
                error: function (e) {
                    //
                }
            });
        }

    </script>

    <script id="successTemplate" type="text/x-kendo-template">
        <div class="succes-notification"><p><i class="fa fa-check"></i>&nbsp; #= message #</p></div>
    </script>

    <script id="errorTemplate" type="text/x-kendo-template">
        <div class="error-notification"><p><i class="fa fa-close"></i>&nbsp; #= message #</p></div>
    </script>

</asp:Content>

<asp:Content ID="ctConteudo" ContentPlaceHolderID="cphConteudo" runat="server">
    <section>
        <div class="section-header">
            <ol class="breadcrumb">
               <%-- <%= (Master as masterNova).DescricaoSistema %>--%>
            </ol>
        </div>
        <div class="section-body bip-conteudo-elastico">
            <div class="row">
                <div class="col-xs-12">
                    <div class="card">
                        <div class="card-head">
                            <header><i class="far fa-edit"></i> Register new client</header>
                        </div>
                        <div class="card-body">
                            <form runat="server" id="frmClient" class="form-horizontal form" role="form">
                                <div id="clientName-field" class="frm-group">
                                    <label for="txtClientName">Name:</label>
                                    <input id="txtClientName" tabindex="1" type="text" name="_txtClientName" class="k-textbox" required />
                                </div>
                                <div id="buttons-field" class="frm-group">
                                    <button id="btnSave" class="k-button k-primary" type="button" tabindex="18" name="load/fa fa-check">&nbsp;&nbsp;SAVE</button>
                                    <button id="btnCancel" class="k-button k-button-cancel" type="button" tabindex="19"><i class="fa fa-close"></i>&nbsp;&nbsp;CANCEL</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</asp:Content>
