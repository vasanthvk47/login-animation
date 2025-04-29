pipeline {
    agent any

    environment {
        IMAGE_NAME = "vasanth4747/login-animation"
        TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/vasanthvk47/login-animation.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t $IMAGE_NAME:$TAG ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-password', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    script {
                        sh '''
                            echo $PASSWORD | docker login -u $USERNAME --password-stdin
                            docker push $IMAGE_NAME:$TAG
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Delete existing services and deployments
                    sh "kubectl delete deployment student-app-deployment || true"
                    sh "kubectl delete service student-app-service || true"
                    
                    // Deploy the new application
                    sh "kubectl apply -f k8s/deployment.yaml"
                    sh "kubectl apply -f k8s/service.yaml"
                }
            }
        }

        stage('Get IP Address') {
            steps {
                script {
                    // Get the Minikube service URL for the deployed application
                    def serviceUrl = sh(script: "minikube service student-app-service --url", returnStdout: true).trim()
                    echo "Service is available at: $serviceUrl"
                    
                    // Optionally, display the URL for reviewer
                    currentBuild.description = "Access the application at: $serviceUrl"
                }
            }
        }
    }
}
