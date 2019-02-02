pipeline {
    agent { 
      dockerfile {
        dir 'node'
      } 
    }
    stages {
        stage('Test') {
            steps {
              dir('node'){
                sh 'node --version'
                sh 'svn --version'
              }
            }
        }
    }
}