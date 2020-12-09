sulhome.kanbanBoardApp.service('boardService', function ($http, $q, $rootScope) {
    var proxy = null;
    //var iisapp = "/sistemas/GESCON";
    //TODO
    var iisapp = "/GESCON";

    var recuperarListaEstruturaKanbanTarefa = function (projetoId, areaId, empresaId, dataInicio, dataFim) {

        if (projetoId == 0 || empresaId == 0 || dataInicio == null || dataInicio == "" || dataFim == null || dataFim == "")
            return $q.reject("Por favor preencha os campos!");

        return $http.get(iisapp + "/api/BoardWebApi/RecuperarListaEstruturaKanbanTarefa", { params: { projetoId: projetoId, areaId: areaId, empresaId: empresaId, dataInicio: dataInicio, dataFim: dataFim } })
            .then(function (response) {
                return response.data;
            }, function (error) {
                return $q.reject(error.data.Message);
            });
    };

    var validarAcao = function (colunaOrigemId, colunaDestinoId) {
        return $http.get(iisapp + "/api/BoardWebApi/ValidarAcao", { params: { colunaOrigemId: colunaOrigemId, colunaDestinoId: colunaDestinoId } })
            .then(function (response) {
                return response.data.podeMover;
            }, function (error) {
                return $q.reject(error.data.Message);
            });
    };

    var moverTarefa = function (projetoId, areaId, empresaId, dataInicio, dataFim, tarefaId, colunaDestinoId) {
        return $http.post(iisapp + "/api/BoardWebApi/MoverTarefa", { projetoId: projetoId, areaId: areaId, empresaId: empresaId, dataInicio: dataInicio, dataFim: dataFim, tarefaId: tarefaId, colunaDestinoId: colunaDestinoId })
            .then(function (response) {
                return response.status == 200;
            }, function (error) {
                return $q.reject(error.data.Message);
            });
    };

    var initialize = function () {

        connection = jQuery.hubConnection(iisapp + "/signalr");
        this.proxy = connection.createHubProxy('KanbanBoard');

        this.proxy.on('BoardUpdated', function () {
            $rootScope.$emit("refreshBoard");
        });

        return connection.start()
        .then(function (connectionObj) {
            return connectionObj;
        }, function (error) {
            return error.message;
        });
    };

    var sendRequest = function () {
        this.proxy.invoke('NotifyBoardUpdated');
    };

    return {

        initialize: initialize,
        sendRequest: sendRequest,
        recuperarListaEstruturaKanbanTarefa: recuperarListaEstruturaKanbanTarefa,
        validarAcao: validarAcao,
        moverTarefa: moverTarefa
    };
});