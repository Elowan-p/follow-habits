# Follow Habits API 🚀

Bienvenue sur l'API backend **Follow Habits**, une application robuste permettant de créer, suivre, et gérer des habitudes quotidiennes ainsi que des défis de groupes avec un système de points et de badges.

Ce projet est construit avec **NestJS**, **TypeScript** et utilise **MySQL** pour la gestion de base de données.

---

## 🛠️ Pré-requis

Avant de lancer le projet, assurez-vous d'avoir installé sur votre machine :
- **Node.js** (v18+)
- **npm** ou **yarn**
- **Docker** et **Docker Compose** (pour la base de données)

## 🚀 Démarrage Rapide

Suivez ces étapes pour lancer l'application en environnement de développement local :

### 1. Lancer la Base de Données (via Docker)
L'application utilise une base de données MySQL conteneurisée.
```bash
docker compose up -d
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Démarrer le Serveur Backend
```bash
npm run start:dev
```
*Le serveur démarrera par défaut sur le port configuré (ex: `http://localhost:4000`).*

### 4. Accéder à la Documentation de l'API (Swagger)
Une fois le backend lancé, vous pouvez explorer et tester toutes les routes de l'API via l'interface Swagger intégrée :
👉 **[http://localhost:4000/api#/](http://localhost:4000/api#/)**

---

## 🧪 Lancer les Tests

Le backend est couvert par un ensemble complet de tests unitaires (couverture à 100%).

> **Attention :** Avant de lancer les tests ou vérifier la couverture de code, assurez-vous que **Docker (base de données)** et le **Backend** sont lancés.

Pour exécuter la suite de tests et afficher le rapport de couverture :
```bash
npm run test -- --coverage
```
