## Présentation

**ft_transcendance** est une application web complète, architecturée en microservices, permettant la gestion d'utilisateurs, d'événements, de chat en temps réel, et de parties de jeu en ligne. Le projet est conçu pour être déployé facilement via Docker et Docker Compose, garantissant une séparation claire des responsabilités et une scalabilité optimale.

## Architecture

L'application est composée des services suivants :

- **https_proxy** : Proxy inverse Nginx avec gestion HTTPS automatique.
- **api_gateway** : Point d'entrée unique (Nginx) pour router les requêtes vers les différents services backend et le frontend.
- **frontend** : Application web statique (servie par Nginx).
- **user_managment** : Service d'authentification et gestion des utilisateurs (Django + DRF).
- **event_managment** : Gestion des événements, parties et tournois (Django + DRF).
- **chat_managment** : Gestion du chat en temps réel (Django + DRF).
- **redis_cache** : Service Redis pour la gestion du cache et des sessions.

## Démarrage rapide

### Prérequis

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Lancer l'application

```bash
make
docker-compose up --build
```

L'ensemble des services sera accessible via le proxy HTTPS sur les ports `8080` (HTTP) et `8443` (HTTPS).

### Arrêter l'application

```bash
docker-compose down
```

## Structure du dépôt

```
.
├── api_gateway/         # Nginx pour le routage interne
├── chat_managment/      # Service de chat (Django)
├── event_managment/     # Service d'événements et jeux (Django)
├── front/               # Frontend statique (Nginx)
├── https_proxy/         # Proxy HTTPS (Nginx)
├── redis_cache/         # Données Redis persistées
├── user_managment/      # Service utilisateurs (Django)
├── docker-compose.yml   # Orchestration multi-conteneurs
├── Makefile             # Commandes utilitaires
├── check_list.txt       # Liste de vérification avant push
├── todo                 # Tâches en cours
└── README.md            # Ce fichier
```

## Fonctionnalités principales

- **Authentification JWT** et gestion des utilisateurs
- **Gestion d'amis, relations, classement**
- **Création et gestion d'événements, parties solo/duo, tournois**
- **Chat en temps réel** entre utilisateurs
- **Interface web moderne** et responsive
- **Proxy HTTPS automatique** (certificats auto-signés pour dev)
- **Cache Redis** pour les performances

## Checklist avant de pousser

Merci de vérifier les points du fichier `check_list.txt` avant tout push sur la branche stable. Ajoutez-y toute nouvelle fonctionnalité ou test important.

## Développement

Chaque service possède son propre `Dockerfile` et peut être lancé indépendamment pour le développement. Reportez-vous aux README spécifiques dans chaque dossier pour plus de détails sur les endpoints, variables d'environnement, et commandes utiles.

## Contribution

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commitez vos modifications (`git commit -am 'Ajout d'une fonctionnalité'`)
4. Poussez la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

## Aide & Support

Pour toute question, bug ou suggestion, ouvrez une issue sur le dépôt Git.