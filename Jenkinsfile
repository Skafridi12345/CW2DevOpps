pipeline {
  agent any
  environment {
    DOCKERHUB_CREDS = credentials('dockerhub-creds')
    IMAGE_NAME = 'cw2-server'
    DOCKERHUB_REPO = 'your-dockerhub-username/cw2-server'
    K8S_DEPLOYMENT = 'cw2-deployment'
    K8S_CONTAINER = 'cw2-container'
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
            // Run container and check health
            docker.image("${IMAGE_NAME}:${env.BUILD_ID}").run('--name test-container -d')
            sh "docker exec test-container curl --fail http://localhost:3000"
          } finally {
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
            docker.image("${IMAGE_NAME}:${env.BUILD_ID}").push('latest')
          }
        }
      }
    }
    
    // Task 3e: Deploy to Kubernetes
    stage('Deploy') {
      steps {
        script {
          // Update Kubernetes deployment with new image
          sh "kubectl set image deployment/${K8S_DEPLOYMENT} ${K8S_CONTAINER}=${DOCKERHUB_REPO}:${env.BUILD_ID} --record"
          // Verify rollout status
          sh "kubectl rollout status deployment/${K8S_DEPLOYMENT}"
        }
      }
    }
  }
}
