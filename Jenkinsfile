
pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '290952542648'
        ECR_REGISTRY = '290952542648.dkr.ecr.ap-south-1.amazonaws.com'
        BACKEND_REPO = 'ai-productivity-backend'
        FRONTEND_REPO = 'ai-productivity-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                    docker build \
                      -t ${ECR_REGISTRY}/${BACKEND_REPO}:${BUILD_NUMBER} \
                      ./server

                    docker build \
                      -t ${ECR_REGISTRY}/${FRONTEND_REPO}:${BUILD_NUMBER} \
                      ./client
                '''
            }
        }

        stage('Login to Amazon ECR') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-ecr-credentials',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {
                    sh '''
                        export AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
                        export AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"
                        export AWS_DEFAULT_REGION="$AWS_REGION"

                        aws ecr get-login-password --region "$AWS_REGION" |
                          docker login \
                            --username AWS \
                            --password-stdin "$ECR_REGISTRY"
                    '''
                }
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                    docker push ${ECR_REGISTRY}/${BACKEND_REPO}:${BUILD_NUMBER}
                    docker push ${ECR_REGISTRY}/${FRONTEND_REPO}:${BUILD_NUMBER}
                '''
            }
        }
    }

    post {
        success {
            echo 'Frontend and backend images pushed to Amazon ECR.'
        }
        failure {
            echo 'Pipeline failed. Check the Jenkins console output.'
        }
    }
}

