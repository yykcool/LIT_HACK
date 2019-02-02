pipeline {
    agent { 
      dockerfile {
        dir 'node'
        filename 'dockerfile'
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