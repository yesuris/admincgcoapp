angular.module('ciudadgourmetco.controllers', [])
    .controller('LoginCtrl', function ($scope, $http) {
        localStorage.centinela = "false";
        $scope.restaurante = {
            correo: "",
            contrasena: ""
        };
        $scope.login = function () {
            console.log($scope.restaurante);
            $http({
                method: "POST",
                url: "http://www.ciudadgourmet.co/api-cg/sesion/restaurante",
                data: $scope.restaurante,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(function mySucces(response) {
                var respuesta = response.data;
                if (respuesta.restaurante) {
                    location.href = "#/app/descrip_restaurante";
                    localStorage.id_restaurante = respuesta.restaurante.id;
                    localStorage.centinela = "true";
                } else {
                    alert("Verifica tus datos.");
                }
            }, function myError(response) {
                console.log(response);
            });
        };
    })
    .controller('RestauranteCtrl', function ($scope, $ionicPopup, $ionicSideMenuDelegate) {
        $scope.centinealalogin = function () {
            if (localStorage.centinela == "true") {
                location.href = "#/app/reservar_mesas";
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Importante!',
                    template: 'Debes iniciar sesión para poder reservar.'
                });
                alertPopup.then(function (res) {
                    location.href = "#/app/restaurante";
                    $ionicSideMenuDelegate.toggleLeft(true);
                });
            }
        }
    })
    .controller('Descrip_restauranteCtrl', function ($scope, $http, $ionicModal, $ionicPopup) {
        console.log("Descrip_restauranteCtrl");
        $scope.reservas = [];
        var id_restaurante = 1; //fijo por ahora
        $http({
            method: "GET",
            url: "http://www.ciudadgourmet.co/api-cg/restaurantes/" + id_restaurante + "/reservas"
        }).then(function mySucces(response) {
            var respuesta = response.data;
            $scope.reservas = respuesta.result;
        }, function myError(response) {
            alert("Eror en el servidor, intente nuevamente.");
        });

        $ionicModal.fromTemplateUrl('templates/mostrar_menu.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.modal2 = $ionicModal.fromTemplate('templates/editar_menu.html', {
            scope: $scope,
            animation: 'slide-left-right'
        });
        $scope.listarMenu = function () {
            $http({
                method: "GET",
                url: "http://www.ciudadgourmet.co/api-cg/restaurantes/" + id_restaurante + "/platos"
            }).then(function mySucces(response) {
                var respuesta = response.data;
                $scope.groups = respuesta.result;
            }, function myError(response) {
                alert("Eror en el servidor, intente nuevamente.");
            });
        };
        $scope.categorias = [];
        $http({
            method: "GET",
            url: "http://www.ciudadgourmet.co/api-ncg/categorias"
        }).then(function mySucces(response) {
            var respuesta = response.data;
            $scope.categorias = respuesta.result;
        }, function myError(response) {
            alert("Eror en el servidor, intente nuevamente.");
        });
        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };
        $scope.platoNuevo = { //ng-model en los input
            id_restaurante: localStorage.id_restaurante,
            nombre_plato: "",
            caracteristica: "",
            precio: 0,
            id_categoria: 1
        };
        $scope.agregarplatonuevo = function () {
            $http({
                method: "POST",
                url: "http://www.ciudadgourmet.co/api-ncg/nuevoPlato",
                data: $scope.platoNuevo,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(function mySucces(response) {
                var respuesta = response.data;
                var alertPopup = $ionicPopup.alert({
                    title: 'Genial!',
                    template: 'Tu nuevo plato fue agregado'
                });
            }, function myError(response) {
                alert("Eror en el servidor, intente nuevamente.");
            })
        };
        $scope.data = {
            showDelete: false
        };
        $scope.onItemDelete = function (item) {
            var id = item.id;
            $http({
                method: "DELETE",
                url: "http://www.ciudadgourmet.co/api-ncg/platos/" + id
            }).then(function mySucces(response) {
                alert("el plato se ha eliminado");
                $scope.listarMenu;

            }, function myError(response) {
                alert("Eror en el servidor, intente nuevamente.");
            });
        };
        $scope.edit = function (item) {
            alert('Edit Item:' + item.id);
        };
    })
    .controller('RegistroCtrl', function ($scope, $ionicPopup) {

    });