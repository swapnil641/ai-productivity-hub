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

    stage('Push Backend') {
        steps {
            sh 'docker push sopudada641/pern-backend'
        }
    }

    stage('Push Frontend') {
        steps {
            sh 'docker push sopudada641/pern-frontend'
        }
    }

    stage('Deploy') {
        steps {
            sh 'docker compose up -d'
        }
    }

    stage('Verify') {
        steps {
            sh 'docker ps'
        }
    }

    stage('Deploy to Ubuntu Server') {
        steps {
            sh '''
                ssh ubuntu@13.203.204.45
                    cd ~/pern-app 
                    docker compose down
                    docker pull sopudada641/pern-backend
                    docker pull sopudada641/pern-frontend
                    docker compose up -d

               '''
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
