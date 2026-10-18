pipeline {
    agent any
    stages {
        stage('install') {
            steps {
                dir('src') {
                    sh 'npm ci'
                }
            }
        }
        stage('build'){
            steps {
                dir('src') {
                    sh 'npx ng build --configuration production'
                }
            }
        }
        stage('deploy') {
            steps {
                sh 'sudo rsync -a --delete src/dist/KKK/browser/ /var/www/html/kkk-front/'
                sh 'sudo chown -R www-data:www-data /var/www/html/kkk-front'
                sh 'sudo find /var/www/html/kkk-front -type d -exec chmod 755 {} \\;'
                sh 'sudo find /var/www/html/kkk-front -type f -exec chmod 644 {} \\;'
            }
        }
    }
    post {
        always {
           cleanWs()
        }
    }
}
