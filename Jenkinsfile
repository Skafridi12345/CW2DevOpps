pipeline {
    agent any

    environment {
        IMAGE_NAME = 'safridigcu/cw2-server'
        TAG = 'latest'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    sh 'docker build -t $IMAGE_NAME:$TAG .'
                }
            }
        }
    }
}

