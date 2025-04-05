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

        stage('Test Container Run') {
            steps {
                script {
                    echo "Testing container launch..."
                    sh 'docker run -d --name test-container -p 8081:8080 $IMAGE_NAME:$TAG'
                    sh 'sleep 3'
                    sh 'curl http://localhost:8081'
                    sh 'docker rm -f test-container'
                }
            }
        }
    }
}
