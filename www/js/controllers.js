angular.module('ciudadgourmetco.controllers', [])

.controller('HomeCtrl', ['$scope', 'upload', '$http', '$ionicPopup', function ($scope, upload, $http, $ionicPopup) {
    $scope.platoNuevo = { //ng-model en los input
        id_restaurante: localStorage.id_restaurante,
        nombre_plato: "",
        caracteristica: "",
        precio: 0,
        id_categoria: "",
        urlimg: ""
    };
    $scope.uploadFile = function () {
        var name = $scope.name;
        var file = $scope.file;

        upload.uploadFile(file, name).then(function (res) {
            console.log(res);
            $scope.platoNuevo.urlimg = file.name;

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
        })
    }
}])

.controller('HomeCtrlEdit', ['$scope', 'upload', '$http', '$ionicPopup', function ($scope, upload, $http, $ionicPopup) {
    $scope.platoEditado = { //ng-model en los input
        urlimg: "",
        nombre_plato: "",
        caracteristica: "",
        precio: 0,
        id_categoria: ""
    };
    $scope.uploadFileEdit = function () {
        var name = $scope.name;
        var file = $scope.file;

        upload.uploadFile(file, name).then(function (res) {
            console.log(res);
            $scope.platoEditado.urlimg = file.name;

            var id = localStorage.iddelplato;
            $http({
                method: "PUT",
                url: "http://www.ciudadgourmet.co/api-ncg/actualizar/" + id,
                data: $scope.platoEditado,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(function mySucces(response) {
                alert("el plato se ha modificado");
            }, function myError(response) {
                alert("Eror en el servidor, intente nuevamente.");
            });
        })
    }
}])

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
    .controller('Descrip_restauranteCtrl', function ($scope, $http, $ionicModal, $ionicPopup, upload) {

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

        $ionicModal.fromTemplateUrl('templates/nuevo_plato.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal1 = modal;
        });

        $ionicModal.fromTemplateUrl('templates/editar_menu.html', {
            scope: $scope,
            animation: 'slide-left-right'
        }).then(function (modal) {
            $scope.modal2 = modal;
        });

        $scope.openModal = function (index) {
            if (index == 1) $scope.modal1.show();
            else $scope.modal2.show();
        };

        $scope.closeModal = function (index) {
            if (index == 1) $scope.modal1.hide();
            else $scope.modal2.hide();
        };
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
            }, function myError(response) {
                alert("Eror en el servidor, intente nuevamente.");
            });
        };

        $scope.edit = function (item) {
            localStorage.iddelplato = item.id;
            
        };

        /*$scope.platoEditado = { //ng-model en los input
            nombre_plato: ""
        };

        $scope.editdelmodal = function () {
            var id = $scope.iddelplato;
            $http({
                method: "PUT",
                url: "http://www.ciudadgourmet.co/api-ncg/actualizar/" + id,
                data: $scope.platoEditado,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(function mySucces(response) {
                alert("el plato se ha modificado");
            }, function myError(response) {
                alert("Eror en el servidor, intente nuevamente.");
            });

        }*/
    })
    .controller('RegistroCtrl', function ($scope, $ionicPopup) {

    })



.service('upload', ["$http", "$q", function ($http, $q)
    {
        this.uploadFile = function (file, name) {
            var deferred = $q.defer();
            var formData = new FormData();
            formData.append("name", name);
            formData.append("file", file);
            return $http.post("http://www.ciudadgourmet.co/server.php", formData, {
                    headers: {
                        "Content-type": undefined
                    },
                    transformRequest: angular.identity
                })
                .success(function (res) {
                    deferred.resolve(res);
                })
                .error(function (msg, code) {
                    deferred.reject(msg);
                })
            return deferred.promise;
        }
}]);