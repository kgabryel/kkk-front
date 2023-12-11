pipeline {
    agent any
    stages {
        stage('install') {
            steps {
                sh 'cd src && yarn install'
            }
        }
        stage('build'){
            steps {
                sh 'cd src && ng build --prod'
            }
        }
        stage('deploy') {
            steps {
                sh 'sudo rm -rf /var/www/html/kkk-front'
                sh 'cp -r src/dist/KKK /var/www/html/kkk-front'
                sh 'sudo chmod 755 -R /var/www/html/kkk-front'
                sh 'sudo chown www-data -R /var/www/html/kkk-front'
            }
        }
    }
    post {
        always {
           cleanWs()
        }
    }
}
