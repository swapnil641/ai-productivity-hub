pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        AWS_REGION    = 'ap-south-1'
        AWS_ACCOUNT_ID = '290952542648'
        ECR_REGISTRY  = '290952542648.dkr.ecr.ap-south-1.amazonaws.com'

        BACKEND_REPO  = 'ai-productivity-backend'
        FRONTEND_REPO = 'ai-productivity-frontend'

        EC2_HOST      = '65.2.123.160'
        EC2_USER      = 'ubuntu'
        DEPLOY_PATH   = '/opt/ai-productivity-hub'
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm

                sh '''
                    echo "Git checkout successful"
                    echo "Branch: $BRANCH_NAME"
                    echo "Build number: $BUILD_NUMBER"
                '''
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

        stage('Login to AWS ECR') {
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

                        export AWS_ACCESS_KEY_ID
                        export AWS_SECRET_ACCESS_KEY
                        export AWS_DEFAULT_REGION="$AWS_REGION"

                        aws ecr get-login-password \
                          --region "$AWS_REGION" \
                        | docker login \
                          --username AWS \
                          --password-stdin "$ECR_REGISTRY"
                    '''
                }
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                    set -eu

                    docker push \
                      "$ECR_REGISTRY/$BACKEND_REPO:$BUILD_NUMBER"

                    docker push \
                      "$ECR_REGISTRY/$FRONTEND_REPO:$BUILD_NUMBER"
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
                          "set -eu &&
                           cd '$DEPLOY_PATH' &&

                           aws ecr get-login-password \
                             --region '$AWS_REGION' |
                           sudo docker login \
                             --username AWS \
                             --password-stdin '$ECR_REGISTRY' &&

                           sudo env IMAGE_TAG='$BUILD_NUMBER' \
                             docker compose \
                             --env-file .env \
                             -f docker-compose.prod.yml pull &&

                           sudo env IMAGE_TAG='$BUILD_NUMBER' \
                             docker compose \
                             --env-file .env \
                             -f docker-compose.prod.yml up -d &&

                           sudo docker compose \
                             --env-file .env \
                             -f docker-compose.prod.yml ps"
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sshagent(credentials: ['ec2-ssh-key']) {
                    sh '''
                        set -eu

                        echo "Checking deployed containers..."

                        ssh \
                          -o StrictHostKeyChecking=accept-new \
                          -o ConnectTimeout=15 \
                          "$EC2_USER@$EC2_HOST" \
                          "sudo docker ps \
                             --filter name=ai-productivity-hub \
                             --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}' &&
                           sudo docker compose \
                             --env-file '$DEPLOY_PATH/.env' \
                             -f '$DEPLOY_PATH/docker-compose.prod.yml' \
                             ps"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully!'
            echo "Backend image: ${env.ECR_REGISTRY}/${env.BACKEND_REPO}:${env.BUILD_NUMBER}"
            echo "Frontend image: ${env.ECR_REGISTRY}/${env.FRONTEND_REPO}:${env.BUILD_NUMBER}"
        }

        failure {
            echo 'Pipeline failed. Check the failed stage and console output.'
        }

        aborted {
            echo 'Pipeline was aborted.'
        }

        always {
            echo "Jenkins build ${env.BUILD_NUMBER} finished with status: ${currentBuild.currentResult}"
        }
    }
}

