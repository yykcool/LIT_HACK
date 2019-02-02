node{
  stage('Build') {
    checkout scm
    dir('node'){
      sh 'docker-compose up --build'
    }
  }
}