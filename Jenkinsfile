import groovy.json.JsonOutput

def APP_NAME = 'range-myra-web'
def BUILD_CONFIG = APP_NAME
def IMAGESTREAM_NAME = APP_NAME
def TAG_NAMES = ['dev', 'test', 'prod']
def CMD_PREFIX = 'PATH=$PATH:$PWD/node-v9.6.1-linux-x64/bin'
def NODE_URI = 'https://nodejs.org/dist/v9.7.0/node-v9.7.0-linux-x64.tar.xz'
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

node {
  stage('Checkout') {
    echo "Checking out source"
    checkout scm
  }
  
  stage('Install') {
    echo "Setup: ${BUILD_ID}"
    
    // The version of node in the `node` that comes with OpenShift is too old
    // so I use a generic Linux and install my own node from LTS.
    sh "curl ${NODE_URI} | tar -Jx"

    // setup the node dev environment
    sh "${CMD_PREFIX} npm i "
    // not sure if this needs to be added to package.json.
    sh "${CMD_PREFIX} npm i escape-string-regexp"
    sh "${CMD_PREFIX} npm -v"
    sh "${CMD_PREFIX} node -v"
  }
  
  stage('Build Artifacts') {
    echo "Build Artifacts: ${BUILD_ID}"
    // Run a security check on our packages
    // sh "${CMD_PREFIX} npm run test:security"
    // Run our unit tests et al.
    sh "${CMD_PREFIX} npm run build"
  }

  stage('Test') {
    echo "Testing: ${BUILD_ID}"
    // Run our unit tests et al.
    try {
      // Run our unit tests et al.
      sh "${CMD_PREFIX} npm test"
    } catch (error) {
      def attachment = [:]
      attachment.fallback = 'See build log for more details'
      attachment.title = 'Unit Testing Failed'
      attachment.color = '#CD0000' // Red
      attachment.text = 'Their are issues with the unit tests.'
      // attachment.title_link = "${env.BUILD_URL}"

      notifySlack("${APP_NAME}, Build #${BUILD_ID}", "#rangedevteam", "https://hooks.slack.com/services/${SLACK_TOKEN}", [attachment], JENKINS_ICO)
      sh "exit 1001"
    }
  }

  stage('Build Image') {
    echo "Build: ${BUILD_ID}"
    // run the oc build to package the artifacts into a docker image
    openshiftBuild bldCfg: APP_NAME, showBuildLogs: 'true', verbose: 'true'

    // Don't tag with BUILD_ID so the pruner can do it's job; it won't delete tagged images.
    // Tag the images for deployment based on the image's hash
    IMAGE_HASH = sh (
      script: """oc get istag ${IMAGESTREAM_NAME}:latest -o template --template=\"{{.image.dockerImageReference}}\"|awk -F \":\" \'{print \$3}\'""",
      returnStdout: true).trim()
    echo ">> IMAGE_HASH: ${IMAGE_HASH}"

    openshiftTag destStream: IMAGESTREAM_NAME, verbose: 'true', destTag: TAG_NAMES[0], srcStream: IMAGESTREAM_NAME, srcTag: "${IMAGE_HASH}"

    try {
      def attachment = [:]
      attachment.fallback = 'See build log for more details'
      attachment.text = ':raised_hands: :clap: Another huge sucess for the Range Team.\n A freshly minted build is being deployed. You should see the results shortly.'
      attachment.title = "Build ${BUILD_ID} OK!"
      attachment.color = '#00FF00' // Lime Green

      notifySlack("${APP_NAME}", "#rangedevteam", "https://hooks.slack.com/services/${SLACK_TOKEN}", [attachment], JENKINS_ICO)
    } catch (error) {
      echo "Unable send update to slack, error = ${error}"
    }
  }
}
