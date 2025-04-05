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
                    sh 'docker rm -f test-container || true'
                    sh 'docker run -d --name test-container -p 8081:8080 $IMAGE_NAME:$TAG'
                    sh 'sleep 3'
                    sh 'curl http://localhost:8081'
                    sh 'docker rm -f test-container'
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    echo "Pushing image to DockerHub..."
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        sh 'docker push $IMAGE_NAME:$TAG'
                    }
                }
            }
        }
    }
}
