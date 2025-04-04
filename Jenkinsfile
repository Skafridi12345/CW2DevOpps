pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'safridigcu/cw2app'
        DOCKER_TAG = 'latest'
        KUBECONFIG_CREDENTIALS_ID = 'your-kube-config-id' // Set this to your actual Kubernetes credentials ID in Jenkins
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $DOCKER_IMAGE:$DOCKER_TAG .'
                }
            }
        }

        stage('Test Docker Container') {
            steps {
                script {
                    sh 'docker run --rm $DOCKER_IMAGE:$DOCKER_TAG echo "Container is running"'
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        sh 'docker push $DOCKER_IMAGE:$DOCKER_TAG'
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withKubeConfig(credentialsId: "$KUBECONFIG_CREDENTIALS_ID") {
                        sh 'kubectl apply -f deployment.yaml'
                    }
                }
            }
        }
    }
}
