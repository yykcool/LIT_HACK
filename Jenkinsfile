dir('/var/lib/jenkins/workspace/lit/node') {
    sh label: '', script: '''docker build -t yykcool/lit .
                              docker run -p 8888:8080 yykcool/lit'''
}