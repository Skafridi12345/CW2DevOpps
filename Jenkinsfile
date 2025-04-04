pipeline {
  agent any
  environment {
    DOCKERHUB_CREDS = credentials('dockerhub-creds') // DockerHub credentials ID
    IMAGE_NAME = 'cw2-server'
    DOCKERHUB_REPO = 'safridigcu/cw2app'  // Your DockerHub repo
    K8S_DEPLOYMENT = 'cw2app-deployment' // Kubernetes deployment name
    K8S_CONTAINER = 'cw2app-container'   // Kubernetes container name
    KUBECONFIG = credentials('CW2-kube-config-id') // Kubernetes config file
  }

  stages {
    // Task 3b: Build Docker Image
    stage('Build') {
      steps {
        script {
          docker.build("${IMAGE_NAME}:${env.BUILD_ID}")
        }
      }
    }

    // Task 3c: Test Container Launch
    stage('Test') {
      steps {
        script {
          try {
            // Run the container in detached mode and test health
            docker.image("${IMAGE_NAME}:${env.BUILD_ID}").run('--name test-container -d')

            // Introduce a wait time before testing the health check
            sh 'sleep 10' // Allow the server to start up

            // Test the health of the server
            sh "docker exec test-container curl --fail http://localhost:3000 || exit 1"
          } finally {
            // Clean up: stop and remove the test container
            sh "docker stop test-container || true"
            sh "docker rm test-container || true"
          }
        }
      }
    }

    // Task 3d: Push to DockerHub
    stage('Push') {
      steps {
        script {
          docker.withRegistry('https://registry.hub.docker.com', DOCKERHUB_CREDS) {
            docker.image("${IMAGE_NAME}:${env.BUILD_ID}").push()
            docker.image("${IMAGE_NAME}:${env.BUILD_ID}").push('latest')  // Tag 'latest' as well
          }
        }
      }
    }

    // Task 3e: Deploy to Kubernetes
    stage('Deploy') {
      steps {
        script {
          // Update Kubernetes deployment with the new Docker image
          sh "export KUBECONFIG=$KUBECONFIG"
          sh "kubectl set image deployment/${K8S_DEPLOYMENT} ${K8S_CONTAINER}=${DOCKERHUB_REPO}:${env.BUILD_ID} --record"
          
          // Verify that the rollout was successful
          sh "kubectl rollout status deployment/${K8S_DEPLOYMENT}"
        }
      }
    }
  }
}
