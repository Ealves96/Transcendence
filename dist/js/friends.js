function initFriends() {
    console.log('Initialisation des amis');
    const friendsList = document.getElementById('friendsList');
    if (!friendsList) {
        console.error('friendsList introuvable');
        return;
    }

    // Ajouter une logique pour charger les amis
    friendsList.innerHTML += '<p>Liste des amis chargée !</p>';
}
