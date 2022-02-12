/**
 * Created by stefan on 23.10.15.
 */
angular.module('myApp.sl-list').directive('slList', function() {

    function SlListController($scope, SlData) { // angular components zuerst
        this.items = [];

        SlData.getItems().then(function(items) {
            $scope.$apply(
                function() {
                    items.forEach(function(item) {
                        this.items.push(item);
                    }.bind(this));
                }.bind(this)
            );
            $scope.$watch('vm.items', function(oldValue, newValue, scope) {
                let firstChange = oldValue.find(function(item) {
                    return item.dirty && item.dirty.length > 0;
                });
                if (!firstChange) {
                    return;
                }
                console.log('firstChange', JSON.stringify(firstChange));
                SlData.storeItems(scope.vm.items)
                    .then(
                        function () {
                            scope.$apply(
                                function () {
                                    scope.vm.items.forEach(
                                        function (item) {
                                            if (item.dirty && item.dirty.length) {
                                                item.dirty.length = 0;
                                            }
                                        }
                                    );
                                }
                            );
                        }
                    );
            }, true);
        }.bind(this));

        this.change = function() {
            ++this.value.item.amount;
        };

        this.select = function() {
            this.value && ++this.value.amount;
        };

        this.submit = function() {
            let list = this.compilePlainList();
            console.log(JSON.stringify(list));
            SlData.emailList(list).then(
                function(res) {
                    console.log('statusCode', res);
                    SlData.resetList(list);
                    alert('Viel Spaß beim Einkaufen');
                },
                function(error) {
                    console.error(error);
                    alert('Die Email wurde nicht verschickt');
                }
            );
        };

        this.compilePlainList = function() {
            return this.items
                .filter(function(item) {
                    return item.amount && parseInt(item.amount) > 0;
                })
                .map(function(item) {
                    return item.amount + ' x ' + item.text +
                        (item.comment && item.comment.trim().length > 0
                            ? (' (' + item.comment + ')') : '') +
                        '\n';
                })
                .join('') +
                (this.comment || '');
        };

        $scope.filterOptionsForSelect = function (selectId) {
            return function (item) {
                return 'select' !== item.type &&
                    item.selectId === selectId &&
                    item.amount === 0;
            }
        };
    }

    // DDO - Directive Definition Object
    return {
        restrict: 'EA',
        templateUrl: 'components/sl-list/sl-list.directive.html',
        scope: true,
        controller: SlListController,
        controllerAs: 'vm' // löst das "punkt-problem". alles, was in this ist, liegt im vm-objekt
    };

});

