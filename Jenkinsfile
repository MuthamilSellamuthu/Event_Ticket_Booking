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
                sh 'docker-compose build'
            }
        }

        stage('Run Containers') {
            steps {
                echo 'Starting services using Docker Compose...'
                sh 'docker-compose up -d'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying services...'
                sh 'docker ps'
                sh 'curl -f http://localhost:5000/api/health || exit 1'
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