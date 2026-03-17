pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "event-backend"
    }

    stages {
        stage('Clone Repository') {
            steps {
                // In a real Jenkins environment, this is usually handled by the plugin or SCM configuration
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                bat 'docker compose build'
            }
        }

        stage('Run Containers') {
            steps {
                echo 'Cleaning up old containers and starting services...'
                bat 'docker compose down'
                bat 'docker compose up -d'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying services...'
                bat 'docker ps'
                // Use curl (comes with Git for Windows) or powershell
                bat 'curl -f http://localhost:5000/api/health || exit 1'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        failure {
            echo 'Pipeline failed. Check the logs.'
        }
    }
}