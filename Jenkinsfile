pipeline {
    agent any

    environment {
        IMAGE_NAME = "vasanth4747/login-animation"
        TAG = "latest"
    }

    stages {
        stage('Start Minikube') {
            steps {
                script {
                    // Start Minikube if it's not already running
                    sh "minikube status || minikube start"
                }
            }
        }

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

        stage('Deploy to Minikube') {
            steps {
                script {
                    // Ensure the right Minikube context
                    sh "kubectl config use-context minikube"

                    // Delete existing deployment and service if any
                    sh "kubectl delete deployment student-app-deployment --ignore-not-found"
                    sh "kubectl delete service student-app-service --ignore-not-found"

                    // Apply Kubernetes YAML files
                    sh "kubectl apply -f k8s/deployment.yaml"
                    sh "kubectl apply -f k8s/service.yaml"
                }
            }
        }

        stage('Get IP Address') {
            steps {
                script {
                    def serviceUrl = sh(script: "minikube service student-app-service --url", returnStdout: true).trim()
                    echo "✅ App is live at: $serviceUrl"
                    currentBuild.description = "🌐 App URL: $serviceUrl"
                }
            }
        }
    }
}
