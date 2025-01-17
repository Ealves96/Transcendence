function initRanking() {
    console.log('Initialisation du classement');
    const rankingTable = document.getElementById('rankingTable');
    if (!rankingTable) {
        console.error('rankingTable introuvable');
        return;
    }

    // Ajouter une logique pour charger le classement
    rankingTable.innerHTML += '<p>Classement mis à jour !</p>';
}
