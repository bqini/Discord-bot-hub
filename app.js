const prompt = require("prompt-sync")();
const fs = require("fs");
const sleep = require("sleep");
var commandsf = "commands";
const readline = require("readline");
const shell = require("shelljs");
const blank = "\n".repeat(process.stdout.rows);
var version = "0.2.1-stable";
var botDir;

console.log(
  "Welcome to Discord Bot Hub v" + version + ".\nPlease select one of the following:"
);
console.log(
  "[1] Would you like to manage bots? \n[2] Would you like to setup a bot? \n[3] Would you like to update DBH?"
);
var ManageInstall = parseInt(prompt("Answer here. [1/2/3]: "));
if (ManageInstall == 1) {
  console.log("Please wait while you get redirected.");
  sleep.sleep(3);
  console.log(blank);
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
  require("child_process").fork("managebots.js");
} else if (ManageInstall == 2) {
  console.log("Please wait while everything is being setup.");
  sleep.sleep(2);

  console.log("[1] Discord.js \n[2] Discord.py");
  var Language = parseInt(prompt("Answer here. [1/2]: "));
  if (Language == 2) {
    console.log("Sorry, Discord.py isn't available right now. It is in the works, however I plan to add this in the very near future.");
    setTimeout(function () {
      return process.exit(22);
    }, 1000);
  }
  console.log(blank);
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
  console.log("[1] Basic bot with command handler. \n[2] Make your own project.");
  var djssetup = parseInt(prompt("Answer here. [1/2]: "));
  if (djssetup == 1) {
    console.log("Setting up Discord.js bot");

    var botDirName = prompt("What do you want your bot directory to be called?: ");
    var botDirConfirmation = prompt("Are you sure you want the bot directory to be called " + botDirName + "? [y/n]: ");
    if (botDirConfirmation == "y") {
      console.log(blank);
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
      console.log("Proceeding now.");

      var token = prompt("What is your bot token?: ");
      var prefix = prompt("What do you want your prefix to be?: ");
      console.log("Setting up the bot directory. ");
      sleep.sleep(3);
      botDir = `${botDirName}`;
      if (!fs.existsSync(botDir)) {
        fs.mkdirSync(botDir);
      }
      fs.mkdir(
        `${botDir}/${commandsf}`,
        {
          recursive: true,
        },
        (err) => {
          if (err) throw err;
        }
      );
      var writeStream = fs.createWriteStream(`./${botDir}/config.json`);
      writeStream.write("{ \n");
      writeStream.write(`  "token": "${token}", \n`);
      writeStream.write(`  "prefix": "${prefix}" \n`);
      writeStream.write(`} \n`);
      writeStream.end();

      var index = `
let Discord = require("discord.js");
let fs = require("fs")
let client = new Discord.Client();
client.commands = new Discord.Collection();
const config = require("./config.json")
client.token = config.token;
fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err)
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("No commands found...")
        return;
    }
    jsfile.forEach((f, i) => {
        let props = require(\`./commands/\${f}\`)
        console.log(\`\${f} loaded\`)
        client.commands.set(props.help.name, props);
    })
})
client.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    let prefix = config.prefix;
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0]
    let args = messageArray.slice(1)
    let commandfile = client.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(client, message, args);
})
client.on('ready', () => {
    console.log("Bot is now on")
})
client.login(client.token)
`;
      fs.writeFile(`./${botDir}/index.js`, index, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        console.log("Index.js has been made!");
      });

      var command1 = `
const Discord = require("discord.js")
module.exports.run = async (client, message, args) => {
    message.channel.send("Hellooooo")
}
module.exports.help = {
    name: "hello"
}
`;

      fs.writeFile(`./${botDir}/${commandsf}/hello.js`, command1, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        console.log("Testing command had been made!");
      });

      let managejs = `
            const readline = require('readline');
            const shell = require("shelljs")
            const prompt = require('prompt-sync')();
            
            shell.exec("clear")
            console.log("You can type help to find out the commands")
            
            function replDemo() {
              return new Promise(function(resolve, reject) {
                let rl = readline.createInterface(process.stdin, process.stdout)
                rl.setPrompt('ready> ')
                rl.prompt();
                rl.on('line', function(line) {
                  if (line === "exit" || line === "quit" || line == 'q') {
                    rl.close()
                    return // bail here, so rl.prompt() isn't called again
                  }
            
                  if (line === "help" || line === '?') {
                    console.log(\`[vsc] Open vsc \n[start] Start The Bot \n[update] Update Needed Packages \n[install] Install Packages \n[needed] Run this to install needed packages \n [exit] this will exit this script\`)
                  } else if (line === "start") {
                    shell.exec("node index.js")
                    rl.close()
                  } else if (line === "vsc") {
                    shell.exec("code .")
                  } else if (line === "update"){
                    console.log("Updating packages")
                    shell.exec("npm i")
                  } else if (line === "install"){
                    console.log("What package do you wish to install")
                    var package = prompt()
                    shell.exec(\`npm i \${package}\`)
                    console.log("Installed fs")
                  } else if (line === "needed"){
                    console.log("Installing the packages")
                    shell.exec("npm i discord.js")
                    console.log("Installed Discord.js")
                    shell.exec("npm i fs")
                    console.log("Installed fs")
                  } else {
                    console.log(\`Unknown command: "$\{line}"\`)
                  }
                  rl.prompt()
            
                }).on('close',function(){
                  console.log('bye')
                  resolve(42) // this is the final result of the function
                });
              })
            }
            
            async function run() {
              try {
                let replResult = await replDemo()
                console.log('repl result:', replResult)
            
              } catch(e) {
                console.log('failed:', e)
              }
            }
            
            run()
`;

      fs.writeFile(`./${botDir}/manage.js`, managejs, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        console.log("Manage.js has been made!");
        console.clear();
        console.log("Would you like to manage " + botDir + "?");
        console.log("Coming here will allow you to install bot packages etc [y/n]");
        var manageafter = prompt();

        console.log(
          "To enter the manage panel via the hub, You can also start this script again then send 1 instead."
        );
        sleep.sleep(5);
        if ((manageafter = "y")) {
          console.log("Redirecting!");
          sleep.sleep(3);
          console.clear();
          require("child_process").fork("managebots.js");
        } else if (manageafter) {
          console.log("If you ever want to manage the bot, just run this script again and type 1");
        }
      });
    }
  }
} else if (ManageInstall == 3) {
  console.clear();
  console.log("Updating DBH...");
  shell.exec("git stash && git pull && git stash apply");
}

if (djssetup == 2) {
  console.log('Sorry, this will be introduced in version "0.3.0"');
}
if (botDirConfirmation == "n") {
  console.log("Ending process");
  setTimeout(function () {
    return process.exit(22);
  }, 100);
}
