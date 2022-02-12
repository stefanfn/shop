/**
 * Created by stefan on 28.10.15.
 */
angular.module('myApp').factory('SlData', function($http) {

    var items = null;

    const url = 'http://shop.coolmule.de:54783/';

    function createNewItems() {
        return $http.get('liste.xml')
            .then(function(response) {
                var items = [];
                new X2JS().xml_str2json(response.data).items
                    .item.forEach(function(element, index) {
                        //if (!!element._selectId) {
                            //return;
                        //}
                        if ('select' === element._type) {
                            items.push({
                                type: element._type,
                                selectId: element._selectId,
                            });
                        } else if (typeof element === 'string') {
                            // artikel ohne unterartikel und ohne attribute
                            items.push({
                                id: index,
                                selectId: element._selectId,
                                text: element,
                                amount: 0
                            });
                        } else {
                            var item = {
                                id: index,
                                selectId: element._selectId,
                                amount: element._amount || 0
                            };
                            if (typeof element.__text === 'string') {
                                item.text = element.__text;
                            } else if (element._title && typeof element._title === 'string') {
                                item.text = element._title;
                            }
                            items.push(item);
                        }
                    });
                return items;
                }
            );
    }

    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            return new Promise(function(resolve, reject) {
                var later = function () {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args).then(resolve, reject);
                    }
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args).then(resolve, reject);
                }
            });
        };
    };

    function emailList(list) {
        console.log('emailItems');
        return $http.post(
                url + 'email',  
                JSON.stringify({list})
            );
    }
    
    function exportItem(item) {
        let preparedItem = {};
        for (var key in item) {
            if (item.hasOwnProperty(key)) {
                switch (key) {
                    case 'amount':
                        if (item[key] !== 0) {
                            preparedItem[key] = parseInt(item[key]);
                        }
                        break;
                    case 'comment':
                    case 'text':
                    case 'title':
                    case 'type':
                    case 'selectId':
                        preparedItem[key] = item[key];
                        break;
                    default:
                        break;
                }
            }
        }
        return preparedItem;
    }

    function getItemById(id) {
        for (var item in items) {
            if (items[item].id === id) {
                return items[item];
            }
        }
    }

    function getItems() {
        return new Promise(function(resolve, reject) {
            loadItems()
                .then(
                    resolve,
                    function() {
                        createNewItems().then(resolve, reject);
                    }
                )
                .catch(reject);
        });
    }
    
    function importItems(storedItems) {
        let items = [];
        storedItems.forEach(function (storedItem) {
            let item = {};
            items.push(item);
            if ('select' === storedItem.type) {
                item.type = 'select';
                item.selectId = storedItem.selectId;
            } else {
                item.text = storedItem.text;
                item.selectId = storedItem.selectId;
                item.amount = storedItem.amount || 0;
                item.comment = storedItem.comment || '';
            }
        });
        return items;
    }

    function loadItems() {
        //return Promise.reject();
        return new Promise(function(resolve, reject) {
            $http.get(url)
                .then(
                    function(response) {
                        if (response && response.data) {
                            resolve(importItems(response.data));
                        } else {
                            reject();
                        }
                    },
                    function(err) {
                        console.log('reject', err);
                        reject();
                    }
                )
                .catch(function(err) {
                    console.log('err', err);
                    reject();
                });
            }
        );
    }
    
    function resetList(list) {
        console.log('resetList');
        return $http.put(url);
    }
    
    function storeItems(items) {
        console.log('storeItems');
        return new Promise(function(resolve, reject) {
            $http.post(
                url,
                JSON.stringify(
                    items
                        .map(function(item) {
                            return exportItem(item);
                        })
                )
            )
                .then(resolve, reject)
                .catch(reject);
        });
    }

    return {
        emailList: function(list) {
            return emailList(list);
        },
        getItemById: function(id) {
            return getItemById(id);
        },
        getItems: function() {
            return getItems();
        },
        resetList: function() {
            return resetList();
        },
        storeItems: debounce(
            function(items) {
                return storeItems(items);
            },
            2000
        )
    }

});
