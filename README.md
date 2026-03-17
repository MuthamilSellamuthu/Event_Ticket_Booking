# Event Ticket Booking Platform - DevOps Implementation

This project implements a multi-container architecture for an Event Ticket Booking Platform using Docker Compose, automated with Jenkins, and monitored with Prometheus.

## Project Structure

```text
event-ticket-booking
├── frontend
│   ├── Dockerfile
│   ├── src/
│   └── package.json
├── backend
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
├── docker-compose.yml
├── Jenkinsfile
├── prometheus.yml
└── README.md
```

## Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Jenkins](https://www.jenkins.io/download/) (for automation)
- [Git](https://git-scm.com/downloads)

## Step-by-Step Guide

### 1. Building and Running with Docker Compose

To start the entire application including the frontend, backend, MongoDB database, and Prometheus monitoring:

```bash
docker-compose up -d --build
```

- **Frontend UI**: Accessible at `http://localhost:3000`
- **Backend API**: Accessible at `http://localhost:5000`
- **MongoDB**: Runs on `mongodb:27017` (internal name)
- **Prometheus**: Accessible at `http://localhost:9090`

### 2. Monitoring with Prometheus

Once the containers are running, you can access the Prometheus dashboard to view metrics:

1. Open `http://localhost:9090`.
2. Go to **Status > Targets** to verify that the `backend` service is being scraped successfully.
3. Use the **Graph** tab to query metrics like `http_requests_total`.

### 3. Automating with Jenkins

1. Open your Jenkins dashboard.
2. Create a new **Pipeline** job.
3. In the **Pipeline** section, select **Pipeline script from SCM**.
4. Choose **Git** and provide your repository URL.
5. Set the **Script Path** to `Jenkinsfile`.
6. Click **Save** and then **Build Now**.

The pipeline will:
- Clone your repository.
- Build the Docker images.
- Start the services using Docker Compose.
- Verify the deployment.

## Troubleshooting

- **Port Conflicts**: Ensure ports `5000`, `27017`, and `9090` are not in use by other applications.
- **Docker Permissions**: Run commands with `sudo` if necessary (on Linux).
- **Network Issues**: Ensure Docker can pull images from Docker Hub.
