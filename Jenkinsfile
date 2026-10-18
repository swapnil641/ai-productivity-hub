pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '290952542648'
        ECR_REGISTRY = '290952542648.dkr.ecr.ap-south-1.amazonaws.com'

        BACKEND_REPO = 'ai-productivity-backend'
        FRONTEND_REPO = 'ai-productivity-frontend'

        EC2_HOST = '65.2.123.160'
        EC2_USER = 'ubuntu'
        DEPLOY_PATH = '/opt/ai-productivity-hub'
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
                    set -eu

                    docker build \
                      -t "$ECR_REGISTRY/$BACKEND_REPO:$BUILD_NUMBER" \
                      ./server
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    set -eu

                    docker build \
                      -t "$ECR_REGISTRY/$FRONTEND_REPO:$BUILD_NUMBER" \
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
                        set -eu
                        set +x

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
                timeout(time: 20, unit: 'MINUTES')
            }

            steps {
                sh '''
                    set -eu

                    echo "Pushing backend image..."
                    docker push \
                      "$ECR_REGISTRY/$BACKEND_REPO:$BUILD_NUMBER"

                    echo "Pushing frontend image..."
                    docker push \
                      "$ECR_REGISTRY/$FRONTEND_REPO:$BUILD_NUMBER"

                    echo "Both images pushed successfully."
                '''
            }
        }

        stage('Deploy to EC2') {
            options {
                timeout(time: 10, unit: 'MINUTES')
            }

            steps {
                sshagent(credentials: ['ec2-ssh-key']) {
                    sh '''
                        set -eu

                        echo "Deploying build $BUILD_NUMBER to EC2..."

                        ssh \
                          -o StrictHostKeyChecking=accept-new \
                          -o ConnectTimeout=15 \
                          "$EC2_USER@$EC2_HOST" \
                          "cd '$DEPLOY_PATH' &&
                           export IMAGE_TAG='$BUILD_NUMBER' &&
                           sudo -E docker compose \
                             -f docker-compose.prod.yml pull &&
                           sudo -E docker compose \
                             -f docker-compose.prod.yml up -d &&
                           sudo docker compose \
                             -f docker-compose.prod.yml ps"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Images pushed to ECR and deployment completed.'
        }

        failure {
            echo 'FAILURE: Check the Jenkins Console Output.'
        }

        aborted {
            echo 'BUILD ABORTED.'
        }

        always {
            echo 'Jenkins pipeline execution finished.'
        }
    }
}

