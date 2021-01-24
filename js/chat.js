//const url = 'ws://chat.shas.tel';
const url = 'ws://localhost:8181';
const connection = new WebSocket(url);
connection.onopen = () => {
    connection.send('hey');
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
    if (item.element === 'button') {
        input.value = item.value;
        input.innerHTML = item.value;
    }
    input.type = item.type;
    if (item.name) {
        input.name = item.name;
    }

    form.appendChild(input);
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
    console.log(`>> message FROM "${from}" - CONTENT [${msg}]`);
    connection.send(`from:${from};message:${msg}`);
    return false;
};
// to get something
connection.onmessage = (event) => {
    let message = event.data;
    let messageItem = document.createElement('div');
    messageItem.textContent = message;
    document.getElementById('messages').prepend(messageItem);
};
