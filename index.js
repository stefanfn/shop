const
    http = require('http'),
    sqlite3 = require('sqlite3'),
    database = new sqlite3.Database('shop'),

    tableName = 'list';

function dbErrorHandler(resolve, reject, err) {
    if (err === null) {
        resolve();
    } else {
        console.log('prepareDatabase', err);
        reject(err.code);
    }
}

function dumpDatabase() {
    database.each(
        'SELECT * FROM ' + tableName,
        (err, row) => {
            console.log(err || row);
        }
    );
}

function onPostData(postEvent, data) {
    postEvent.postData = postEvent.postData || '' + data;
}

function onPostEnd(postEvent) {
    console.log('onPostEnd', JSON.parse(postEvent.postData));
    persistList(postEvent.postData)
        .then(() => {
            respond(postEvent.response, {httpCode: 200});
            dumpDatabase();
        })
        .catch(() => {
            respond(postEvent.response, {httpCode: 501});
        });
}

function persistList(list) {
    return prepareDatabase().then(updatePendingList.bind(this, list))
}

function prepareDatabase() {
    return new Promise((resolve, reject) => {
        database.run(
            'CREATE TABLE IF NOT EXISTS ' + tableName +
                ' (list_id integer PRIMARY KEY, items text, pending boolean NOT NULL)',
            dbErrorHandler.bind(this, resolve, reject)
        );
    });
}

function queryPendingList() {
    return new Promise((resolve, reject) => {
        database.get(
            'SELECT items FROM ' + tableName + ' WHERE pending',
            (err, row) => {
                if (err === null) {
                    resolve(row.items);
                } else {
                    console.log(err);
                    reject(err.code);
                }
            }
        );
    });
}

function respond(response, config = {}) {
    if (config.httpCode || config.contentType) {
        response.writeHead(config.httpCode || 200, config.contentType || {'Content-Type': 'text/html'});
    }

    if (config.content) {
        response.write(config.content);
    }

    if (config.endResponse === undefined || config.endResponse === true) {
        response.end();
    }
}

function sendAnswer(response) {
    prepareDatabase()
        .then(queryPendingList)
        .then((list) => {
            respond(response, {httpCode: 200, contentType: 'application/json', content: list});
        })
        .catch((err) => {
            console.log('sendAnswer', err);
            respond(response, {httpCode: 501});
        });
}

function updatePendingList(items) {
    return new Promise((resolve, reject) => {
        database.run(
            'INSERT OR REPLACE INTO list (list_id, items, pending)' +
                'VALUES ((SELECT list_id FROM list WHERE pending), ?, 1)',
            {1: items},
            (error) => {
                if (error === null) {
                    resolve();
                } else {
                    console.log('updatePendingList', error);
                    reject(error.code);
                }
            }
        );
    });
}

http.createServer((request, response) => {
    let params, postData;
    switch (request.method) {
        case 'GET':
            sendAnswer(response);
        break;
        case 'POST':
            let postEvent = {/*request, */response};
            request.on('data', onPostData.bind(this, postEvent));
            request.on('end', onPostEnd.bind(this, postEvent));
        break;
        default:
            respond(response, 501);
    }
}).listen(8080);
