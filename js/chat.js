// WS connection string
const url = 'ws://chat.shas.tel';
// list of headers
const headers = ['time', 'id', 'from', 'message'];
// WS connection handler
let connection = new WebSocket(url, ['ws']);

connection.onopen = () => {
    console.log('>> WS connection opened');
};

connection.onerror = (err) => {
    console.error('>> WS connection encountered an error ', err);
    connection.close();
};

connection.onclose = (event) => {
    console.log('>> WS connection will be re-established in 1 second');
    setTimeout(function() {
        connection = new WebSocket(url, ['ws']);
    }, 1000);
};

connection.onmessage = (event) => {
    let messageList = JSON.parse(event.data);
    let tbl = document.getElementsByTagName('table')[0];
    messageList.forEach(m => {
        let row = document.createElement('tr');
        for (let h of headers) {
            let td = document.createElement('td');
            td.appendChild(document.createTextNode(m[h]));
            row.appendChild(td);
        }
        tbl.appendChild(row);
    });
};

const form = document.createElement('form');
form.name = 'publish';
const inputFields = [
    { name: 'from', type: 'text', element: 'input' },
    { name: 'message', type: 'text', element: 'textarea' },
    { type: 'submit', element: 'button', value: 'Submit' }
];
inputFields.forEach(item => {
    let input = document.createElement(item.element);
    let label = document.createElement('label');
    input.type = item.type;
    // to add a button
    if (item.element === 'button') {
        input.value = item.value;
        input.innerHTML = item.value;
    }
    // to add a label for others input fields
    if (item.name) {
        input.name = item.name;
        label.htmlFor = item.element === 'input' ? 'text-' + item.element : item.element;
        label.innerHTML = item.name.toUpperCase();
    }

    form.appendChild(input);
    form.insertBefore(label, input);
    form.appendChild(document.createElement('br'));
});

// to add a form
document.body.appendChild(form);
document.body.appendChild(document.createElement('hr'));
// to create a table
let table = document.createElement('table');
let thRow = document.createElement('tr');
for (let h of headers) {
    let th = document.createElement('th');
    th.innerHTML = h.toUpperCase();
    thRow.appendChild(th);
}
table.appendChild(thRow);
document.body.appendChild(table);

// to send message
document.forms.publish.onsubmit = function () {
    let msg = this.message.value;
    let from = this.from.value;
    if (!msg || !from) {
        console.warn('Either From or Message is empty');
        return false;
    }
    console.log(`>> message FROM "${from}" - CONTENT [${msg}]`);
    connection.send(JSON.stringify({from: from, message: msg }));
    console.log('>> connection state ', connection.readyState);
    return false;
};
