const testSubject = `10.0.0.1`;
const hostname = 'fillin.lan';
const password = 'fillin';

const { spawn } = require('child_process');
const ping = spawn('ping', ['-c 1', `${testSubject}`])


function restart() {
    var res = spawn('python', [`-m acp`, `-t ${hostname}`, `-p ${password}`, '--reboot'])
    console.log('Watchdog Triggered!!!')
    res.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    res.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    res.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}


function idle() {
    console.log('Watchdog calm')
    console.log("Delay for 2 second.");
    setTimeout(() => {
    }, "2000");
}

ping.stdout.on('data', (data) => {
    console.log(`${data}`);
    if (data.includes('1 packets received') == true) {
        idle()
    } else {
        restart()
    }
});

ping.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

ping.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});