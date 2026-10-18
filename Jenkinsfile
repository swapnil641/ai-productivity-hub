pipeline {
    agent any

    options {
        timestamps()
    }

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

        stage('Build Backend Image') {
            steps {
                sh '''
                    echo "Building backend Docker image..."
                    docker build \
                      -t ${ECR_REGISTRY}/${BACKEND_REPO}:${BUILD_NUMBER} \
                      ./server
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    echo "Building frontend Docker image..."
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
                        set +x
                        export AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
                        export AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"
                        export AWS_DEFAULT_REGION="$AWS_REGION"

                        aws ecr get-login-password \
                          --region "$AWS_REGION" |
                        docker login \
                          --username AWS \
                          --password-stdin "$ECR_REGISTRY"
                    '''
                }
            }
        }

        stage('Push Images to ECR') {
            options {
                timeout(time: 15, unit: 'MINUTES')
            }

            steps {
                sh '''
                    echo "Pushing backend image to ECR..."
                    docker push \
                      ${ECR_REGISTRY}/${BACKEND_REPO}:${BUILD_NUMBER}

                    echo "Pushing frontend image to ECR..."
                    docker push \
                      ${ECR_REGISTRY}/${FRONTEND_REPO}:${BUILD_NUMBER}

                    echo "Both images pushed successfully."
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Frontend and backend images pushed to Amazon ECR.'
        }

        failure {
            echo 'FAILURE: Check the Jenkins console output for the error.'
        }

        aborted {
            echo 'BUILD ABORTED: Check the Jenkins console output.'
        }

        always {
            echo 'Jenkins pipeline execution finished.'
        }
    }
}

