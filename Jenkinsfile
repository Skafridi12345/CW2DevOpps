pipeline {
  agent any
  environment {
    DOCKERHUB_CREDS = credentials('dockerhub-creds')
    IMAGE_NAME = 'cw2-server'
    DOCKERHUB_REPO = 'safridigcu/cw2app'
    K8S_DEPLOYMENT = 'cw2app-deployment'
    K8S_CONTAINER = 'cw2app-container'
    KUBECONFIG = credentials('CW2-kube-config-id')
  }

  stages {
    stage('Build') {
      steps {
        script {
          docker.build("${IMAGE_NAME}:${env.BUILD_ID}")
        }
      }
    }
    
    stage('Test') {
      steps {
        timeout(time: 2, unit: 'MINUTES') {
          script {
            try {
              docker.image("${IMAGE_NAME}:${env.BUILD_ID}").run('--name test-container -d -p 3000:3000')
              sh """
                for i in {1..5}; do
                  if docker exec test-container curl -f http://localhost:3000; then
                    exit 0
                  fi
                  sleep 5
                done
                echo "Health check failed after 5 attempts"
                exit 1
              """
            } catch (err) {
              sh "docker logs test-container"
              throw err
            } finally {
              sh "docker stop test-container || true"
              sh "docker rm test-container || true"
            }
          }
        }
      }
    }
    
    stage('Push') {
      steps {
        script {
          docker.withRegistry('https://registry.hub.docker.com', DOCKERHUB_CREDS) {
            docker.image("${IMAGE_NAME}:${env.BUILD_ID}").push()
          }
        }
      }
    }
    
    stage('Deploy') {
      steps {
        script {
          sh "KUBECONFIG=${KUBECONFIG} kubectl set image deployment/${K8S_DEPLOYMENT} ${K8S_CONTAINER}=${DOCKERHUB_REPO}:${env.BUILD_ID} --record"
          sh "KUBECONFIG=${KUBECONFIG} kubectl rollout status deployment/${K8S_DEPLOYMENT}"
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
    failure {
      echo "Pipeline failed! Check logs for details."
    }
  }
}
