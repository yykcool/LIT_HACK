node('master'){
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
          step([$class: 'DockerComposeBuilder', dockerComposeFile: 'docker-compose.yml', option: [$class: 'StartAllServices'], useCustomDockerComposeFile: true])
            
        }
      }
    }
  }

}