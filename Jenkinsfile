node{
  stage('Build') {
    checkout scm
    dir('node'){
      step([$class: 'DockerComposeBuilder', dockerComposeFile: 'docker-compose.yml', option: [$class: 'StartAllServices'], useCustomDockerComposeFile: true])  
    }
  }
}