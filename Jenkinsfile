pipeline {
    agent any

    stages {

        stage('Build Images') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose build'
            }
        }

        stage('Tag Images') {
            steps {
                sh 'docker tag pern-todo-pipeline-backend sopudada641/pern-backend'
                sh 'docker tag pern-todo-pipeline-frontend sopudada641/pern-frontend'
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push sopudada641/pern-backend
                        docker push sopudada641/pern-frontend
                    '''
                }
            }
        }

        stage('Deploy Locally') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Verify Local') {
            steps {
                sh 'docker ps'
            }
        }

        stage('Deploy to Ubuntu Server') {
            steps {
                // Make sure 'ubuntu-server-ssh' credential (SSH key) exists in Jenkins
                sshagent(['ubuntu@3.110.189.247']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@3.110.189.247 '
                            cd ~/pern-app &&
                            docker compose down || true &&
                            docker pull sopudada641/pern-backend &&
                            docker pull sopudada641/pern-frontend &&
                            docker compose up -d
                        '
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline Completed Successfully'
        }
        failure {
            echo 'Pipeline Failed'
        }
    }
}