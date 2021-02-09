const prompt = require('prompt-sync')();
const fs = require('fs')
const sleep = require("sleep")
const {
    exec
} = require("child_process");
var commandsf = "commands"
const readline = require('readline')
const blank = '\n'.repeat(process.stdout.rows)
var version = "0.1.1"
var botDir;

console.log("Welcome to Vedux's discord bot hub version " + version + "\nPlease Select what you are here for")
console.log("[1] Would you like to manage bots? \n[2] Would you like to setup a bot?")
var ManageInstall = parseInt(prompt('Answer Here (1/2): '));
if (ManageInstall == 1) {
    console.log("Please wait while you get redirected")
    sleep.sleep(3)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    require('child_process').fork('managebots.js');
} else {
    console.log("Please wait while everything is settup")
    sleep.sleep(2)

    console.log("[1] Discord.js \n[2] Discord.py")
    var Language = parseInt(prompt('Answer Here (1/2): '));
    if (Language == 2) {
        console.log("Sorry, Discord.py is still in the works")
        setTimeout((function() {
            return process.exit(22);
        }), 1000);
    }
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    console.log("[1] Basic bot with command handler \n[2] Comming soon")
    var djssetup = parseInt(prompt('Answer Here (1/2): '));
    if (djssetup == 1) {
        console.log("Setting up discord.js bot")

        var botDirName = prompt('What do you want your bot directory to be called?: ');
        var botDirConfirmation = prompt('Are you sure you want it to be ' + botDirName + " (y/n)?: ")
        if (botDirConfirmation == "y") {
            console.log(blank)
            readline.cursorTo(process.stdout, 0, 0)
            readline.clearScreenDown(process.stdout)
            console.log("Proceeding now")

            var token = prompt("What is your bot token?: ")
            var prefix = prompt("What do you want your prefix to be?: ")
            console.log("Setting up the directrory ")
            sleep.sleep(3)
            botDir = `${botDirName}`
            if (!fs.existsSync(botDir)) {
                fs.mkdirSync(botDir);
            }
            fs.mkdir(`${botDir}/${commandsf}`, {
                recursive: true
            }, (err) => {
                if (err) throw err;
            });
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

`
            fs.writeFile(`./${botDir}/index.js`, index, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;

                // success case, the file was saved
                console.log('Index.js has been mades!');
            });

            var command1 = `
const Discord = require("discord.js")

module.exports.run = async (client, message, args) => {
    message.channel.send("Hellooooo")
}

module.exports.help = {
    name: "hello"
}
`

            fs.writeFile(`./${botDir}/${commandsf}/hello.js`, command1, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;

                // success case, the file was saved
                console.log('Command 1 had been made!');
            });

            let managejs = `
            const shell = require("shelljs")
            const time = require("sleep")
            const prompt = require('prompt-sync')();
            shell.config.verbose = false;
            
            console.log("Welcome to the Vedux manage hub")
            
            console.log(\`[1] Open vsc \n[2] Start \n[3] Update Packages \n[4] Install Packages \n[5] Package installer\`)
            var answer = parseInt(prompt("(1/2/3/): "))
             
            if(answer==1){
                console.log("Opining Visual studio code")
                time.sleep(2)
                shell.exec("code .")
            }
            else if(answer==2) {
                console.log("starting bot!")
                console.log("This feature may not work as intended too!")
                shell.exec("node index.js")
            }
            else if(answer==3){
                console.log("Updating packages")
                shell.exec("npm i")
            }
            else if(answer==4){
                console.log("Installing the packages")
                time.sleep(2)
                shell.exec("npm i discord.js")
                console.log("Installed Discord.js")
                shell.exec("npm i fs")
                console.log("Installed fs")
                var start = prompt("Would you like to start the bot? (y/n): ")
                if(start=="y"){
                    console.log("starting bot!")
                    console.log("This feature may not work as intended too!")
                    shell.exec("node index.js")
                }
                else if(start=="n"){
                    console.log("Ok")
                }
            }
            
            else if(answer==5){
                console.log("What package do you wish to install")
                var package = prompt()
                shell.exec(\`npm i \${package}\`)
            }
`

            fs.writeFile(`./${botDir}/manage.js`, managejs, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;

                // success case, the file was saved
                console.log('Manage.js had been made!');
                console.clear()
                console.log("Would you like to manage " + botDir)
                console.log("Comming here will allow you too install bot packages etc (y/n)")
                var manageafter = prompt()

                console.log("To enter the manage panel aka the hub, You can also start this script again then send 1 instead.")
                sleep.sleep(5)
                if (manageafter = "y") {
                console.log("Redirecting!")
                sleep.sleep(3)
                console.clear()
                require('child_process').fork('managebots.js');
            } else if (manageafter) {
                console.log("If you ever want to mane the bot just run this script again and press 1")
            }

            });
        }
    }
}

    if (botDirConfirmation == "n") {
        console.log("Ending process")
        setTimeout((function() {
            return process.exit(22);
        }), 100);
    }
