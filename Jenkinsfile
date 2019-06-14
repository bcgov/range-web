import groovy.json.JsonOutput

def APP_NAME = 'range-myra-web'
def IMAGESTREAM_NAME = "${APP_NAME}"
def CADDY_IMAGESTREAM_NAME = "${APP_NAME}-caddy"
def TAG_NAMES = ['dev', 'test', 'prod']
def PIRATE_ICO = 'http://icons.iconarchive.com/icons/aha-soft/torrent/64/pirate-icon.png'
def JENKINS_ICO = 'https://wiki.jenkins-ci.org/download/attachments/2916393/logo.png'
def OPENSHIFT_ICO = 'https://commons.wikimedia.org/wiki/File:OpenShift-LogoType.svg'
def GIT_BRANCH_NAME = ("${env.JOB_BASE_NAME}".contains("master")) ? "master" : "dev"
def SLACK_CHANNEL = '#rangedevteam'
def POD_LABEL = "${APP_NAME}-${UUID.randomUUID().toString()}"

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
podTemplate(label: "${POD_LABEL}", name: "${POD_LABEL}", serviceAccount: 'jenkins', cloud: 'openshift',
  containers: [
    containerTemplate(
      name: 'jnlp',
      image: 'docker-registry.default.svc:5000/range-myra-tools/jenkins-slave-nodejs:10',
      resourceRequestCpu: '1500m',
      resourceLimitCpu: '2000m',
      resourceRequestMemory: '1Gi',
      resourceLimitMemory: '2Gi',
      workingDir: '/var/tmp',
      command: '',
      args: '${computer.jnlpmac} ${computer.name}',
      alwaysPullImage: false
    )
  ],
  volumes: [persistentVolumeClaim(claimName: 'jenkins-workspace', mountPath: '/var/tmp/workspace')]
) {
  node("${POD_LABEL}") {
    SLACK_TOKEN = sh (
      script: """oc get secret/slack -o template --template="{{.data.token}}" | base64 --decode""",
      returnStdout: true).trim()

    stage('Checkout') {
      echo "Checking out source"
      checkout scm

      GIT_COMMIT_SHORT_HASH = sh (
        script: """git describe --always""",
        returnStdout: true).trim()
      GIT_COMMIT_AUTHOR = sh (
        script: """git show -s --pretty=%an""",
        returnStdout: true).trim()
    }

    stage('Install') {
      echo "Setup: ${BUILD_ID}"

      sh "npm ci"
      sh "npm -v"
      sh "node -v"
    }

    stage('Test') {
        //
        // Run our code quality tests
        //

        try {
          echo "Checking code quality with SonarQube"
          SONARQUBE_URL = sh (
              script: 'oc get routes -o wide --no-headers | awk \'/sonarqube/{ print match($0,/edge/) ?  "https://"$2 : "http://"$2 }\'',
              returnStdout: true
                ).trim()
          echo "SONARQUBE_URL: ${SONARQUBE_URL}"
          dir('sonar-runner') {
            sh returnStdout: true, script: "./gradlew sonarqube -Dsonar.host.url=${SONARQUBE_URL} -Dsonar.verbose=true --stacktrace --info -Dsonar.projectName=${APP_NAME} -Dsonar.branch=${GIT_BRANCH_NAME} -Dsonar.projectKey=org.sonarqube:${APP_NAME} -Dsonar.sources=.."
          }
        } catch (error) {
          def attachment = [:]
          attachment.fallback = 'See build log for more details'
          attachment.title = "Web Build ${BUILD_ID} WARNING! :unamused: :zany_face: :fox4:"
          attachment.color = '#FFA500' // Orange
          attachment.text = "The SonarQube code quality check failed.\ncommit ${GIT_COMMIT_SHORT_HASH} by ${GIT_COMMIT_AUTHOR}"
          // attachment.title_link = "${env.BUILD_URL}"

          notifySlack("${APP_NAME}, Build #${BUILD_ID}", "${SLACK_CHANNEL}", "https://hooks.slack.com/services/${SLACK_TOKEN}", [attachment], JENKINS_ICO)
        }

        //
        // Run our unit tests et al.
        //

        try {
          echo "Running Unit Tests"
          sh "npm run test:ci"
        } catch (error) {
          def attachment = [:]
          attachment.fallback = 'See build log for more details'
          attachment.title = "Web Build ${BUILD_ID} FAILED! :face_with_head_bandage: :hankey:"
          attachment.color = '#CD0000' // Red
          attachment.text = "There are issues with the unit tests.\ncommit ${GIT_COMMIT_SHORT_HASH} by ${GIT_COMMIT_AUTHOR}"
          // attachment.title_link = "${env.BUILD_URL}"

          notifySlack("${APP_NAME}, Build #${BUILD_ID}", "${SLACK_CHANNEL}", "https://hooks.slack.com/services/${SLACK_TOKEN}", [attachment], JENKINS_ICO)
          sh "exit 1001"
        }
    }

    // stage('Build Artifacts') {
    //   echo "Build Artifacts: ${BUILD_ID}"
    //   try {
    //     // Run our unit tests et al.
    //     sh "npm run build"
    //   } catch (error) {
    //     def attachment = [: ]
    //     attachment.fallback = 'See build log for more details'
    //     attachment.title = "Web Build ${BUILD_ID} Failed :hankey: :face_with_head_bandage:"
    //     attachment.color = '#CD0000' // Red
    //     attachment.text = "There are issues with the build.\ncommit ${GIT_COMMIT_SHORT_HASH} by ${GIT_COMMIT_AUTHOR}"
    //     // attachment.title_link = "${env.BUILD_URL}"

    //     notifySlack("${APP_NAME}, Build #${BUILD_ID}", "${SLACK_CHANNEL}", "https://hooks.slack.com/services/${SLACK_TOKEN}", [attachment], JENKINS_ICO)
    //     sh "exit 1"
    //   }
    // }

    // if ("master".equalsIgnoreCase(GIT_BRANCH_NAME)) {
      stage('Image Build') {
        try {
          echo "Build: ${BUILD_ID}"

          // run the oc build to package the artifacts into a docker image
          def BUILD_CONFIG = "${APP_NAME}-${GIT_BRANCH_NAME}-build"
          openshiftBuild bldCfg: BUILD_CONFIG, showBuildLogs: 'true', verbose: 'true'

          def CADDY_BUILD_CONFIG = "${APP_NAME}-caddy-${GIT_BRANCH_NAME}-build"
          openshiftBuild bldCfg: CADDY_BUILD_CONFIG, showBuildLogs: 'true', verbose: 'true'

          // Don't tag with BUILD_ID so the pruner can do it's job; it won't delete tagged images.
          // Tag the images for deployment based on the image's hash
          IMAGE_HASH = sh(
            script: """oc get istag ${CADDY_IMAGESTREAM_NAME}:latest -o template --template=\"{{.image.dockerImageReference}}\"|awk -F \":\" \'{print \$3}\'""",
            returnStdout: true).trim()
          echo ">> IMAGE_HASH: ${IMAGE_HASH}"

          openshiftTag destStream: CADDY_IMAGESTREAM_NAME, verbose: 'true', destTag: TAG_NAMES[0], srcStream: CADDY_IMAGESTREAM_NAME, srcTag: "${IMAGE_HASH}"
          echo "Applying tag ${TAG_NAMES[0]} to image ${IMAGE_HASH}"

          def attachment = [: ]
          def message = "Another huge sucess; A freshly minted build is being deployed on dev environment and will be available shortly."
          message = message + "\ncommit ${GIT_COMMIT_SHORT_HASH} by ${GIT_COMMIT_AUTHOR}"
          message = message + "\nThis image can be promoted to the *test* environment"
          attachment.title = "Web Build ${BUILD_ID} OK! :heart: :tada:"
          attachment.fallback = 'See build log for more details'
          attachment.color = '#00FF00' // Lime Green
          def action = [: ]
          action.type = "button"
          action.text = "Promote Image? :rocket:"
          action.url = "https://jenkins-devhub-tools.pathfinder.gov.bc.ca/job/devhub-tools/job/devhub-tools-api-${GIT_BRANCH_NAME}-pipeline/${BUILD_ID}/input"
          attachment.actions = [action]
          attachment.text = message

          notifySlack("${env.JOB_NAME}", "${SLACK_CHANNEL}", "https://hooks.slack.com/services/${SLACK_TOKEN}", [attachment], JENKINS_ICO)
        } catch (error) {
          echo "Unable complete build, error = ${error}"

          def attachment = [: ]
          attachment.fallback = 'See build log for more details'
          attachment.title = "Web Build ${BUILD_ID} FAILED! :face_with_head_bandage: :hankey:"
          attachment.color = '#CD0000' // Red
          attachment.text = "There are issues with OpenShift build.\ncommit ${GIT_COMMIT_SHORT_HASH} by ${GIT_COMMIT_AUTHOR}"

          notifySlack("${env.JOB_NAME}, Build #${BUILD_ID}", "${SLACK_CHANNEL}", "https://hooks.slack.com/services/${SLACK_TOKEN}", [attachment], JENKINS_ICO)
          sh "exit 1002"
        }
      }
    // }

    // if ("master".equalsIgnoreCase(GIT_BRANCH_NAME)) {
      stage('Test Approval') {
        node('master') {
          timeout(time: 4, unit: 'HOURS') {
            input message: "Promote this image to test?", submitter: 'authenticated'
          }

          stage('Promotion') {

            // Don't tag with BUILD_ID so the pruner can do it's job; it won't delete tagged images.
            // Tag the images for deployment based on the image's hash
            IMAGE_HASH = sh(
              script: """oc get istag ${CADDY_IMAGESTREAM_NAME}:latest -o template --template=\"{{.image.dockerImageReference}}\"|awk -F \":\" \'{print \$3}\'""",
              returnStdout: true).trim()
            echo ">> IMAGE_HASH: ${IMAGE_HASH}"
            
            openshiftTag destStream: CADDY_IMAGESTREAM_NAME, verbose: 'true', destTag: TAG_NAMES[1], srcStream: CADDY_IMAGESTREAM_NAME, srcTag: "${IMAGE_HASH}"
            notifySlack("Promotion Completed\n Build #${BUILD_ID} was promoted to *test*.", "${SLACK_CHANNEL}", "https://hooks.slack.com/services/${SLACK_TOKEN}", [], OPENSHIFT_ICO)

            def attachment = [: ]
            def message = "This image can be promoted to the *prod* environment."
            message = message + "\ncommit ${GIT_COMMIT_SHORT_HASH} by ${GIT_COMMIT_AUTHOR}"
            attachment.title = "Test Promotion ${BUILD_ID} OK! :heart: :tada:"
            attachment.fallback = 'See build log for more details'
            attachment.color = '#00FF00' // Lime Green
            def action = [: ]
            action.type = "button"
            action.text = "Promote Image? :rocket:"
            action.url = "https://jenkins-devhub-tools.pathfinder.gov.bc.ca/job/devhub-tools/job/devhub-tools-api-${GIT_BRANCH_NAME}-pipeline/${BUILD_ID}/input"
            attachment.actions = [action]
            attachment.text = message

            notifySlack("${env.JOB_NAME}", "${SLACK_CHANNEL}", "https://hooks.slack.com/services/${SLACK_TOKEN}", [attachment], JENKINS_ICO)
          }

          stage('Prod Approval') {
            timeout(time: 4, unit: 'HOURS') {
              input message: "Promote this image to prod?", submitter: 'authenticated'
            }

            stage('Promotion') {
              // Don't tag with BUILD_ID so the pruner can do it's job; it won't delete tagged images.
              // Tag the images for deployment based on the image's hash
              IMAGE_HASH = sh(
                script: """oc get istag ${CADDY_IMAGESTREAM_NAME}:latest -o template --template=\"{{.image.dockerImageReference}}\"|awk -F \":\" \'{print \$3}\'""",
                returnStdout: true).trim()
              echo ">> IMAGE_HASH: ${IMAGE_HASH}"
              
              openshiftTag destStream: CADDY_IMAGESTREAM_NAME, verbose: 'true', destTag: TAG_NAMES[2], srcStream: CADDY_IMAGESTREAM_NAME, srcTag: "${IMAGE_HASH}"
              notifySlack("Promotion Completed\n Build #${BUILD_ID} was promoted to *prod*.", "${SLACK_CHANNEL}", "https://hooks.slack.com/services/${SLACK_TOKEN}", [], OPENSHIFT_ICO)
            }
          }
        }
      }
    // }
  }
}
