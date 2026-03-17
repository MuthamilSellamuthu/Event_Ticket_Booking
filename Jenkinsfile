pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "event-backend"
    }

    stages {

        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                bat 'docker compose build'
            }
        }

        stage('Clean Old Containers') {
            steps {
                echo 'Stopping and removing old containers...'
                bat 'docker compose down --remove-orphans'
            }
        }

        stage('Run Containers') {
            steps {
                echo 'Starting services using Docker Compose...'
                bat 'docker compose up -d --build'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Waiting for services to initialize (10s)...'
                bat 'timeout /t 10'

                echo 'Checking running containers...'
                bat 'docker ps'

                echo 'Checking backend health endpoint...'
                bat 'curl -f http://localhost:5000/api/health'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful 🎉'
        }
        failure {
            echo 'Pipeline failed ❌ Check logs in Jenkins.'
        }
        always {
            echo 'Pipeline execution finished.'
        }
    }
}