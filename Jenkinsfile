#!groovy

node {
   def REGISTRY = "registry.gitlab.com/sfulasalle/febiz"
   def IMAGENAME = "1002.pfe-web"
   def INTERNALPORT = '80'
   def EXTERNALPORT = '8090'
   def USERSERVER = 'mcalle'
   def IPSERVER = '104.196.1.181'

   ///build, junit,, sonaqube, imagen docker, push, despliegue
   stage ('Actualizar Repositorio') {
      echo 'Descargando código de SCM'
      sh 'rm -rf *'
      checkout scm
   }

   stage ('Instalando Librerías'){
      sh 'npm install'
      sh 'npm run build_dev'
   }

   stage('DOCKER PUSH') {
      docker.withRegistry('https://'+REGISTRY, 'gitlabregistry') {
         def app = docker.build(REGISTRY + "/" + IMAGENAME + ":${env.BUILD_ID}")
         app.push("${env.BUILD_NUMBER}")
         app.push("lastest")

         try {
             sh 'docker stop '+IMAGENAME
         } catch (err) {
         }
         try {
             sh 'docker rm '+IMAGENAME
         } catch (err) {

         }
         try {
             sh 'docker rmi -f $(docker images | grep '+IMAGENAME+' | awk "{print \\$3}");'
         } catch (err) {

         }

         try {
            sh 'ssh ' +USERSERVER+'@'+IPSERVER+ ' sudo docker stop '+IMAGENAME
         } catch (err) {
         }
         try {
            sh 'ssh ' +USERSERVER+'@'+IPSERVER+ ' sudo docker rm '+IMAGENAME
         } catch (err) {

         }
         try {
            sh 'ssh ' +USERSERVER+'@'+IPSERVER+ ' sudo docker rmi -f $(ssh ' +USERSERVER+'@'+IPSERVER+ ' sudo docker images | grep '+IMAGENAME+' | awk "{print \\$3}");'
         } catch (err) {

         }

      }


   }

   stage('Despliegue'){
      sh 'ssh ' +USERSERVER+'@'+IPSERVER+ ' sudo docker pull '+REGISTRY+'/'+IMAGENAME+":${env.BUILD_NUMBER}"
      sh 'ssh ' +USERSERVER+'@'+IPSERVER+ ' sudo docker run -d -p '+EXTERNALPORT+':'+INTERNALPORT+' --name='+IMAGENAME+'  '+REGISTRY+'/'+IMAGENAME+":${env.BUILD_NUMBER}"
   }
}
