# Habit Tracker

A simple, full-stack application to help you build, track, and maintain positive habits over time. Designed for clarity, consistency, and self-improvement.

---

## Features

- Create, update, and delete habits  
- Mark daily progress with check-ins  
- View habit history, streaks, and stats  
- Dockerized environment (backend, frontend, database)  

---

## Tech Stack

- **Backend:** PHP / Symfony
- **Frontend:** JavaScript, HTML, CSS  
- **Infrastructure:** Docker & Docker Compose  
- **Web Server:** Nginx  
- **Database:** PostgreSQL  

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/get-started)  
- [Docker Compose](https://docs.docker.com/compose/)  
- (Optional) Node.js & Composer if running outside containers  

### Installation

```bash
# Clone the repository
git clone https://github.com/IgnasSar/habit-tracker.git
cd habit-tracker

# Start containers
docker compose up -d

# Exec into php container
docker exec -it ht-php sh

# Install dependencies
composer install

# Do migrations
php bin/console d:m:m

# Go back and exec into frontend (node) container
exit
docker exec -it ht-node sh

# Install dependencies
npm install

# Now you are ready to go
