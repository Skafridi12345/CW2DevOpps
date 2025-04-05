pipeline {
    agent any

    environment {
        IMAGE_NAME = 'safridigcu/cw2-server'
        TAG = 'latest'
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    sh "docker build -t ${IMAGE_NAME}:${TAG} ."
                }
            }
        }

        stage('Test Container Run') {
            steps {
                script {
                    echo "Testing container launch..."
                    sh """
                        docker rm -f test-container || true
                        docker run -d --name test-container -p 8081:8080 ${IMAGE_NAME}:${TAG}
                        echo "Waiting for container to be ready..."
                        sleep 3
                        for i in {1..5}; do
                          if curl -s http://localhost:8081; then
                            echo "Container is up!"
                            break
                          else
                            echo "Retry \$i: waiting 2s..."
                            sleep 2
                          fi
                        done
                        docker rm -f test-container
                    """
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    echo "Pushing image to DockerHub..."
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                        sh "docker push ${IMAGE_NAME}:${TAG}"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying to Kubernetes..."
                    // Use the kubeconfig and specify the context
                    sh '''
                        kubectl --kubeconfig=/var/lib/jenkins/.kube/config \
                               --context=minikube \
                               apply -f deployment.yaml
                    '''
                }
            }
        }
    }
}
