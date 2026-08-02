pipeline {
    agent any
    environment {
        TAG_WEBHOOK = credentials('discord-tag-webhook')
    }
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
        stage('mirror-sync') {
            steps {
                sh '/usr/local/bin/mirror-sync "$JOB_NAME" "$TAG_WEBHOOK"'
            }
        }
    }
    post {
        always {
           cleanWs()
        }
    }
}
