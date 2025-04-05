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

                    // Kill any existing container with that name (ignore error if not found)
                    sh 'docker rm -f test-container || true'

                    // Run container on port 8081
                    sh 'docker run -d --name test-container -p 8081:8080 $IMAGE_NAME:$TAG'

                    // Wait for server to start
                    sh 'sleep 3'

                    // Send test request to the app
                    sh 'curl http://localhost:8081'

                    // Clean up
                    sh 'docker rm -f test-container'
                }
            }
        }
    }
}
