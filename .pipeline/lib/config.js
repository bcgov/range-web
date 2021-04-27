'use strict';

let options= require('pipeline-cli').Util.parseArguments()

const config = require('../../.config/config.json');
const changeId =`${Math.floor((Date.now() * 1000)) / 60.0}`;
const version = config.version || '1.0.0';
const name = 'range-web';

const branch = options.branch;
const tag = `build-${version}-${changeId}`;

const processOptions = (options) => {
  const result = { ...options };
  // Check git
  if (!result.git.url.includes('.git')) {
    result.git.url = `${result.git.url}.git`
  }
  if (!result.git.http_url.includes('.git')) {
    result.git.http_url = `${result.git.http_url}.git`
  }

  // Fixing repo
  if (result.git.repository.includes('/')) {
    const last = result.git.repository.split('/').pop();
    const final = last.split('.')[0];
    result.git.repository = final;
  }
  return result;
};

options = processOptions(options);

console.log(`${JSON.stringify(options, null, 2)}`);


const phases = {
  build: {
    namespace:'3187b2-tools'    ,
    name: `${name}`, 
    phase: 'build'  , 
    tag: tag,
    branch: branch
  },
  dev: {
    namespace:'3187b2-dev'    , 
    name: `${name}`, 
    phase: 'dev'  , 
    tag: 'dev',
    env: 'dev',
    replicas: 1,
    maxReplicas: 1
  }
};

// This callback forces the node process to exit as failure.
process.on('unhandledRejection', (reason) => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = {phases, options};
