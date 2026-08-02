pipeline {
    agent any
    environment {
        TAG_WEBHOOK = credentials('discord-tag-webhook')
        PIPELINE_WEBHOOK = credentials('discord-pipeline-webhook')
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
        failure {
            script {
                def payload = """
                {
                    "content": "@everyone Błąd pipeline'a",
                    "allowed_mentions": { "parse": ["everyone"] },
                    "embeds": [{
                        "title": "${env.JOB_NAME}",
                        "description": "❌ Build nie przeszedł",
                        "color": 16711680,
                        "url": "${env.BUILD_URL}"
                    }]
                }
                """
                httpRequest(
                    httpMode: 'POST',
                    contentType: 'APPLICATION_JSON',
                    requestBody: payload,
                    url: env.PIPELINE_WEBHOOK
                )
            }
        }
        success {
            script {
                def payload = """
                {
                    "embeds": [{
                    "title": "${env.JOB_NAME}",
                    "description": "🎉 Build zakończony sukcesem",
                    "color": 65280,
                    "url": "${env.BUILD_URL}"
                    }]
                }
                """
                httpRequest(
                    httpMode: 'POST',
                    contentType: 'APPLICATION_JSON',
                    requestBody: payload,
                    url: env.PIPELINE_WEBHOOK
                )
            }
        }
        always {
           cleanWs()
        }
    }
}
