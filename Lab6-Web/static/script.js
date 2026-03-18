const LOCAL_KEY = "myMessages";

// get local messages
const getLocalMessages = () => {
    return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
};

// save local message
const saveLocalMessage = (msg) => {
    const msgs = getLocalMessages();
    msgs.push(msg);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(msgs));
};

const getMessages = async () => {
    const ul = document.getElementById('messages');

    const isAtBottom =
        ul.scrollTop + ul.clientHeight >= ul.scrollHeight - 10;

    // API messages
    let apiMessages = [];
    try {
        const response = await fetch('/api/messages');
        apiMessages = await response.json();
    } catch (e) {
        console.log("API failed, using local only");
    }

    // local messages
    const localMessages = getLocalMessages();

    const allMessages = [...apiMessages, ...localMessages];

    ul.innerHTML = '';

    for (let i = 0; i < allMessages.length; i++) {
        const message = allMessages[i];
        const li = document.createElement('li');

        let content = message.text;

        if (content.includes('.jpg') || content.includes('.png') || content.includes('.gif')) {
            content += `<br><img src="${message.text}" width="150">`;
        }

        li.innerHTML = `<strong>${message.author}</strong>: ${content}`;
        ul.appendChild(li);
    }

    if (isAtBottom) {
        ul.scrollTop = ul.scrollHeight;
    }
};

const postMessage = async (message) => {
    // save locally FIRST (so it never disappears)
    saveLocalMessage(message);

    // try API (doesn’t matter if it fails)
    try {
        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });
    } catch (e) {
        console.log("API failed");
    }
};

function sendMessage() {
    const input = document.getElementById('message');
    const text = input.value;

    if (text.trim() === '') return;

    const message = {
        author: "Emily",
        text: text
    };

    postMessage(message);

    input.value = '';
    getMessages(); // update instantly
}

document.getElementById('send').addEventListener('click', sendMessage);

document.getElementById('message').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

getMessages();
setInterval(getMessages, 1000);