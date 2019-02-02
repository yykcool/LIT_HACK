pipeline {
    agent { 
      dockerfile {
        dir 'node'
        filename 'dockerfile'
      } 
    }
    stages {
        stage('Build') {
            steps {
              dir('node'){
                node('master'){
                  step([$class: 'DockerComposeBuilder', dockerComposeFile: 'docker-compose.yml', option: [$class: 'StartAllServices'], useCustomDockerComposeFile: true])
                }
              }
            }
        }
    }
}