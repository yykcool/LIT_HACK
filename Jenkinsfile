pipeline {
    agent { dockerfile true }
    stages {
        stage('Test') {
            steps {
                sh 'cd node'
                sh 'node --version'
                sh 'svn --version'
            }
        }
    }
}