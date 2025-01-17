function initChat() {
    console.log('Initialisation du chat');
    
    // Logique pour charger le chat
    const chatBox = document.getElementById('chatBox');
    if (!chatBox) {
        console.error('ChatBox introuvable');
        return;
    }
    chatBox.innerHTML += '<p>Bienvenue dans le tchat !</p>';
}