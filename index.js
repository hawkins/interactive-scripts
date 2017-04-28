#! /usr/bin/env node
var readJson = require('read-package-json');
var inquirer = require('inquirer');
var runAll = require('npm-run-all');
var path = require('path');

readJson(
  path.join(process.cwd(), 'package.json'),
  console.error,
  false,
  promptUser
);

function promptUser(err, data) {
  if (err) {
    throw err;
  }

  // Collect scripts
  var scriptNames = Object.keys(data.scripts);
  var choices = scriptNames.map(key => ({
    name: `${key}: \t${data.scripts[key]}`,
    value: key
  }));

  // Prompt user
  inquirer
    .prompt({
      type: 'list',
      name: 'theme',
      message: 'Select an npm script to run',
      choices
    })
    .then(runScript)
    .catch(console.error);
}

function runScript(val) {
  const script = val.theme;

  runAll(script, {
    stdout: process.stdout,
    stderr: process.stderr
  }).catch(() => {
    // Do nothing
  });
}
