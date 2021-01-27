const url = 'ws://chat.shas.tel';
const connection = new WebSocket(url, ['ws']);
connection.onopen = () => {
    console.log('>> connection opened');
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

// add the form
document.body.appendChild(form);
document.body.appendChild(document.createElement('hr'));
// add a container for messages
const messages = document.createElement('div');
messages.id = 'messages';
document.body.appendChild(messages);
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
// to get something
connection.onmessage = (event) => {
    let message = event.data;
    let messageItem = document.createElement('div');
    messageItem.textContent = message;
    document.getElementById('messages').prepend(messageItem);
};
