import groovy.json.JsonOutput

def APP_NAME = 'range-myra-web'
def CADDY_BUILD_CONFIG = "${APP_NAME}-caddy"
def CADDY_IMAGESTREAM_NAME = "${APP_NAME}-caddy"
def TAG_NAMES = ['dev', 'test', 'prod']
def PIRATE_ICO = 'http://icons.iconarchive.com/icons/aha-soft/torrent/64/pirate-icon.png'
def JENKINS_ICO = 'https://wiki.jenkins-ci.org/download/attachments/2916393/logo.png'
def OPENSHIFT_ICO = 'https://commons.wikimedia.org/wiki/File:OpenShift-LogoType.svg'

def notifySlack(text, channel, url, attachments, icon) {
    def slackURL = url
    def jenkinsIcon = icon
    def payload = JsonOutput.toJson([text: text,
        channel: channel,
        username: "Jenkins",
        icon_url: jenkinsIcon,
        attachments: attachments
    ])
    sh "curl -s -S -X POST --data-urlencode \'payload=${payload}\' ${slackURL}"
}

// See https://github.com/jenkinsci/kubernetes-plugin
podTemplate(label: 'range-web-node8-build', name: 'range-web-node8-build', serviceAccount: 'jenkins', cloud: 'openshift', containers: [
  containerTemplate(
    name: 'jnlp',
    image: 'docker-registry.default.svc:5000/range-myra-tools/jenkins-slave-nodejs:8',
    resourceRequestCpu: '1500m',
    resourceLimitCpu: '2000m',
    resourceRequestMemory: '2Gi',
    resourceLimitMemory: '4Gi',
    workingDir: '/tmp',
    command: '',
    args: '${computer.jnlpmac} ${computer.name}',
    alwaysPullImage: false
    // envVars: [
    //     secretEnvVar(key: 'BDD_DEVICE_FARM_USER', secretName: 'bdd-credentials', secretKey: 'username'),
    //     secretEnvVar(key: 'BDD_DEVICE_FARM_PASSWD', secretName: 'bdd-credentials', secretKey: 'password'),
    //     secretEnvVar(key: 'ANDROID_DECRYPT_KEY', secretName: 'android-decrypt-key', secretKey: 'decryptKey')
    //   ]
  )
])
{
  node('range-web-node-build') {
    stage('Checkout') {
      echo "Checking out source"
      checkout scm

      GIT_COMMIT_SHORT_HASH = sh (
        script: """git describe --always""",
        returnStdout: true).trim()
      GIT_COMMIT_AUTHOR = sh (
        script: """git show -s --pretty=%an""",
        returnStdout: true).trim()
      GIT_BRANCH_NAME = sh (
        script: """git branch -a -v --no-abbrev --contains ${GIT_COMMIT_SHORT_HASH} | \
        grep 'remotes' | \
        awk -F ' ' '{print \$1}' | \
        awk -F '/' '{print \$3}'""",
        returnStdout: true).trim()
      echo "I think my branch is ${GIT_BRANCH_NAME}"

      SLACK_TOKEN = sh (
        script: """oc get secret/slack -o template --template="{{.data.token}}" | base64 --decode""",
        returnStdout: true).trim()
    }
    
    stage('Install') {
      echo "Setup: ${BUILD_ID}"

      // install packages
      sh "npm ci"

      // not sure if this needs to be added to package.json.
      // sh "npm i escape-string-regexp"
      sh "npm -v"
      sh "node -v"
    }

    stage('Code Quality') {
      SONARQUBE_URL = sh (
          script: 'oc get routes -o wide --no-headers | awk \'/sonarqube/{ print match($0,/edge/) ?  "https://"$2 : "http://"$2 }\'',
          returnStdout: true
            ).trim()
      echo "SONARQUBE_URL: ${SONARQUBE_URL}"
      dir('sonar-runner') {
        sh returnStdout: true, script: "./gradlew sonarqube -Dsonar.host.url=${SONARQUBE_URL} -Dsonar.verbose=true --stacktrace --info -Dsonar.projectName=${APP_NAME} -Dsonar.branch=${GIT_BRANCH_NAME} -Dsonar.projectKey=org.sonarqube:${APP_NAME} -Dsonar.sources=.."
      }
    }

    stage('Test') {
      echo "Testing: ${BUILD_ID}"

      try {
        // Run our unit tests et al.
        sh "npm test"
      } catch (error) {
        def attachment = [:]
        attachment.fallback = 'See build log for more details'
        attachment.title = "WEB Build ${BUILD_ID} Failed :hankey: :face_with_head_bandage:"
        attachment.color = '#CD0000' // Red
        attachment.text = "There are issues with the unit tests.\ncommit ${GIT_COMMIT_SHORT_HASH} by ${GIT_COMMIT_AUTHOR}"
        // attachment.title_link = "${env.BUILD_URL}"

        notifySlack("${APP_NAME}, Build #${BUILD_ID}", "#rangedevteam", "https://hooks.slack.com/services/${SLACK_TOKEN}", [attachment], JENKINS_ICO)
        sh "exit 1"
      }
    }

    stage('Build Artifacts') {
      echo "Build Artifacts: ${BUILD_ID}"
      try {
        // Run our unit tests et al.
        sh "npm run build"
      } catch (error) {
        def attachment = [:]
        attachment.fallback = 'See build log for more details'
        attachment.title = "WEB Build ${BUILD_ID} Failed :hankey: :face_with_head_bandage:"
        attachment.color = '#CD0000' // Red
        attachment.text = "There are issues with the build.\ncommit ${GIT_COMMIT_SHORT_HASH} by ${GIT_COMMIT_AUTHOR}"
        // attachment.title_link = "${env.BUILD_URL}"

        notifySlack("${APP_NAME}, Build #${BUILD_ID}", "#rangedevteam", "https://hooks.slack.com/services/${SLACK_TOKEN}", [attachment], JENKINS_ICO)
        sh "exit 1"
      }
    }

    stage('Build Image') {
      echo "Build: ${BUILD_ID}"
      // run the oc build to package the artifacts into a docker image
      openshiftBuild bldCfg: APP_NAME, showBuildLogs: 'true', verbose: 'true'

      openshiftBuild bldCfg: CADDY_BUILD_CONFIG, showBuildLogs: 'true', verbose: 'true'

      // Don't tag with BUILD_ID so the pruner can do it's job; it won't delete tagged images.
      // Tag the images for deployment based on the image's hash
      IMAGE_HASH = sh (
        script: """oc get istag ${CADDY_IMAGESTREAM_NAME}:latest -o template --template=\"{{.image.dockerImageReference}}\"|awk -F \":\" \'{print \$3}\'""",
        returnStdout: true).trim()
      echo ">> IMAGE_HASH: ${IMAGE_HASH}"

      openshiftTag destStream: CADDY_IMAGESTREAM_NAME, verbose: 'true', destTag: TAG_NAMES[0], srcStream: CADDY_IMAGESTREAM_NAME, srcTag: "${IMAGE_HASH}"

      try {
        def attachment = [:]
        attachment.fallback = 'See build log for more details'
        attachment.text = "Another huge sucess for the Range Team.\n A freshly minted build is being deployed. You should see the results shortly.\ncommit ${GIT_COMMIT_SHORT_HASH} by ${GIT_COMMIT_AUTHOR}"
        attachment.title = "WEB Build ${BUILD_ID} OK! :raised_hands: :clap:"
        attachment.color = '#00FF00' // Lime Green

        notifySlack("${APP_NAME}", "#rangedevteam", "https://hooks.slack.com/services/${SLACK_TOKEN}", [attachment], JENKINS_ICO)
      } catch (error) {
        echo "Unable send update to slack, error = ${error}"
      }
    }

    stage('Approval') {
      timeout(time: 1, unit: 'DAYS') {
        input message: "Deploy to test?", submitter: 'authenticated'
      }
      node ('master') {
        stage('Promotion') {
          openshiftTag destStream: CADDY_IMAGESTREAM_NAME, verbose: 'true', destTag: TAG_NAMES[1], srcStream: CADDY_IMAGESTREAM_NAME, srcTag: "${IMAGE_HASH}"
          notifySlack("Promotion Completed\n Build #${BUILD_ID} was promoted to test.", "#range-web-caddy", "https://hooks.slack.com/services/${SLACK_TOKEN}", [], OPENSHIFT_ICO)
        }
      }
    }   
  }
}
