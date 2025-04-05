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
                    // Run the container in detached mode
                    sh 'docker run -d --name test-container -p 8080:8080 $IMAGE_NAME:$TAG'
                    // Wait a moment for container to boot up
                    sh 'sleep 3'
                    // Run curl inside Jenkins to check the container is responding
                    sh 'curl http://localhost:8080'
                    // Clean up the container
                    sh 'docker rm -f test-container'
                }
            }
        }
    }
}
