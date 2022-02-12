/**
 * Created by stefan on 23.10.15.
 */
angular.module('myApp.sl-item').directive('slItem', function() {

    function SlItemController($scope, SlData) {
        this.item = $scope.item;
        this.item.dirty = [];

        this.markAsDirty = function () {
            if (this.item.dirty.length === 0) {
                this.item.dirty.push(0);
            }
        }

        this.onAmountChange = this.markAsDirty;

        this.onCommentChange = function() {
            this.item.amount = this.item.amount <= 0 ? 1 : this.item.amount;
            this.markAsDirty();
        };

        this.onMinus = function () {
            this.item.amount = Math.max(this.item.amount - 1, 0);
            this.markAsDirty();
        }

        this.onPlus = function () {
            ++this.item.amount;
            this.markAsDirty();
        }
    }

    // DDO - Directive Definition Object
    return {
        restrict: 'EA',
        scope: {
            item: '=',
            save: '&'
        },
        templateUrl: 'components/sl-item/sl-item.directive.html',
        controller: SlItemController,
        controllerAs: 'vm'
    };

});
