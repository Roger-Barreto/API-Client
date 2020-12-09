sulhome.kanbanBoardApp.controller('boardCtrl', function ($scope, boardService) {
    // Model
    $scope.listaEstruturaKanbanTarefa = [];
    $scope.projetoId = 0;
    $scope.areaId = "";
    $scope.empresaId = 0;
    $scope.dataInicio = "";
    $scope.dataFim = "";

    $scope.isLoading = false;

    $scope.init = function () {
        $scope.isLoading = true;
        boardService.initialize().then(function (data) {
            $scope.$apply(function () { $scope.isLoading = false; });
        }, onError);
    };

    $scope.refreshBoard = function refreshBoard() {
        $scope.isLoading = true;
        boardService.recuperarListaEstruturaKanbanTarefa($scope.projetoId, $scope.areaId, $scope.empresaId, $scope.dataInicio, $scope.dataFim)
           .then(function (data) {
               $scope.isLoading = false;
               $scope.listaEstruturaKanbanTarefa = data;
           }, onError);
    };

    $scope.onDrop = function (data, colunaDestinoId) {
        boardService.validarAcao(data.ColunaId, colunaDestinoId)
            .then(function (podeMover) {

                if (podeMover) {
                    boardService.moverTarefa($scope.projetoId, $scope.areaId, $scope.empresaId, $scope.dataInicio, $scope.dataFim, data.TarefaId, colunaDestinoId).then(function (tarefaMovida) {

                        $scope.isLoading = false;
                        boardService.sendRequest();

                        $scope.refreshBoard();
                    }, onError);
                    $scope.isLoading = true;
                }
                else
                    toastr.error("Esta ação não é permitida");

            }, onError);
    };

    $scope.$parent.$on("refreshBoard", function (e) {
        $scope.refreshBoard();
        toastr.success("Tarefa atualizada com sucesso!", "Success");
    });

    var onError = function (errorMessage) {
        $scope.isLoading = false;
        toastr.error(errorMessage, "Error");
    };

    $scope.init();
});
