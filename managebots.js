const prompt = require('prompt-sync')();
const fs = require('fs')
const sleep = require("sleep")
const { exec } = require("child_process");
var shell = require("shelljs")
var commandsf = "commands"
const readline = require('readline')
const blank = '\n'.repeat(process.stdout.rows)
shell.config.verbose = false;

shell.exec('ls -I node_modules -I start.js -I managebots.js -I package.json -I package-lock.json -I app.js -I README.md -I LICENSE')
const cdfile = prompt('What bot would you like to manage: ');

shell.cd(`${cdfile}`)

require('child_process').fork('manage.js');
//ls --ignore={"*start.js","*managebots.js","*package.json","*package-lock.json","*node_modules","*LICENSE"}
