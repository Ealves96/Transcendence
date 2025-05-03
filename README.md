<h1 align="center">
  🚀 Transcendance
</h1>

<p align="center">
  <b>Application web de gestion d'utilisateurs, d'événements, de chat et de jeu en ligne, architecturée en microservices.</b>
</p>

<p align="center">
  <img src="/pong.gif" alt="Vidéo de présentation" width="800"/>
</p>

---

## 🏗️ Architecture

Le site est composé des services suivants :

- **https_proxy** : Proxy inverse Nginx avec gestion HTTPS automatique 🔒
- **api_gateway** : Point d'entrée unique (Nginx) pour router les requêtes vers les différents services backend et le frontend 🌐
- **frontend** : Site web statique : HTML, CSS, JavaScript (vanilla), Three.js pour le rendu 3D du jeu Pong 🎮
- **user_managment** : Service d'authentification et gestion des utilisateurs (Django + DRF) 👤
- **event_managment** : Service Django : gestion des événements, parties et tournois (Django, DRF, Channels/WebSockets, PostgreSQL) 🏆
- **chat_managment** : Gestion du chat en temps réel (Django + DRF) 💬
- **redis_cache** : Service Redis pour la gestion du cache et des sessions ⚡

---

## 🚦 Lancement

### Prérequis

- [Docker](https://www.docker.com/) 🐳
- [Docker Compose](https://docs.docker.com/compose/) ⚙️

### Lancer le site

```bash
make
```

> **Note :**  
> Pour accéder à l'application, ouvrez votre navigateur et rendez-vous à l'adresse affichée après "API Gateway", par exemple :  
> [https://192.168.1.146:8443](https://192.168.1.146:8443)  
> Cette adresse correspond à l'IP locale de votre machine.

### Arrêter le site

```bash
make clean
```

---

## 🗂️ Structure du dépôt

```
.
├── api_gateway/         # Configuration Nginx pour le routage interne entre les services (reverse proxy)
├── chat_managment/      # Service Django : chat en temps réel (Django, DRF, Channels/WebSockets, Redis)
├── event_managment/     # Service Django : gestion des événements, parties et tournois (Django, DRF, Channels/WebSockets, PostgreSQL)
├── front/               # Frontend statique : HTML, CSS, JavaScript (vanilla), Three.js pour le rendu 3D du jeu Pong
├── https_proxy/         # Proxy HTTPS (Nginx) et certificats SSL auto-signés
│   └── certs/           # Certificats SSL utilisés par le proxy HTTPS (générés au build)
├── redis_cache/         # Données Redis persistées (volume monté pour Redis)
├── user_managment/      # Service Django : gestion des utilisateurs (Django, DRF, JWT, PostgreSQL)
├── docker-compose.yml   # Orchestration multi-conteneurs (définit tous les services)
├── Makefile             # Commandes utilitaires pour le développement et le déploiement
└── README.md            # Présentation du projet
```

---

## ✨ Fonctionnalités principales

- 🔐 **Authentification JWT** et gestion des utilisateurs
- 🏅 **Gestion d'amis, relations, classement**
- 🎮 **Création et gestion d'événements, parties solo/duo/multi, tournois**
- 💬 **Chat en temps réel** entre utilisateurs
- 🖥️ **Interface web moderne** et responsive
- 🔒 **Proxy HTTPS automatique** (certificats auto-signés pour dev)
- ⚡ **Cache Redis** pour les performances

---

## 🛠️ Technologies & Outils utilisés

<p align="center">
  <!-- Langages -->
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <!-- Frameworks & Libs -->
  <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django"/>
  <img src="https://img.shields.io/badge/DRF-ff1709?style=for-the-badge&logo=django&logoColor=white" alt="Django REST Framework"/>
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/>
  <!-- Outils & Environnements -->
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx"/>
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=websocket&logoColor=white" alt="WebSockets"/>
  <img src="https://img.shields.io/badge/Makefile-3776AB?style=for-the-badge&logo=gnu&logoColor=white" alt="Makefile"/>
</p>

