var exec = require('child_process').exec;
var colors = require('colors');
var argv = require('minimist')(process.argv.slice(2));
var options = {};
var interval;
var numberIteration=0;

options.process = argv.p;
options.interval = argv.i;
options.onNotFound = argv.n;
options.exitNotFound = argv.k || false;
options.onFinish = argv.f;
options.onRunning = argv.r;
options.exitRunning = argv.y || false;
options.help = (argv.h) ? true : false;
options.max = argv.m;
if(options.max){
    try{
        options.max = parseInt(options.max);
    }catch(e){
        return console.log('Only number for -m'.red);
    }
}
if(options.max){
    try{
        options.interval = parseInt(options.interval);
    }catch(e){
        return console.log('Only number for -i'.red);
    }
}


if(!options.process){
    options.help = true;
}

if(options.help){
    console.log('Usage: check-running <options>');
    console.log('\t -p process name. Example:\n\t\t -p mongod');
    console.log('\t -i interval. Example:\n\t\t -i 10000');
    console.log('\t -k exit on Not Found process. Example:\n\t\t -k true');
    console.log('\t -y exit on Found process. Example:\n\t\t -y true');
    console.log('\t -i interval. Example:\n\t\t -i 10000');
    console.log('\t -m max check loop. Example:\n\t\t -m 3');
    console.log('\t -r onRunning process. Example:\n\t\t -r "echo \'Process is runing pid: {{pid}}\'"');
    console.log('\t -n if process not found exec command line. Example:\n\t\t -e "echo \'Process not found\'"');
    console.log('\t -f exec command line on finish check-running. Example:\n\t\t -e "echo \'Exit check....\'"');

    return;
}

var check = function(){
    /**
     * -x, --exact
     */

    numberIteration++;
    if(options.max && options.max<numberIteration){
        if(interval){
            clearInterval(interval);
        }
        return;
    }
    exec('pgrep -fx '+options.process,{},function(error,stdout,stderr){
        var pdi;
        if(stdout){
            pid = stdout.substring(0, stdout.length - 2);
            if(options.onRunning){
                options.onRunning = options.onRunning.replace(/{{pid}}/g,pid)
                exec(options.onRunning,{},function(error,stdout,stderr){
                    if(stderr){
                        return console.log(stderr);
                    }
                    return console.log(stdout);
                });

                if(options.exitRunning){
                    if(interval){
                        clearInterval(interval);
                    }
                    return;
                }
            }
        }else if(options.onNotFound){
            exec(options.onNotFound,{},function(error,stdout,stderr){
                if(stderr){
                    return console.log(stderr);
                }
                return console.log(stdout);
            });
            if(options.exitNotFound){
                if(interval){
                    clearInterval(interval);
                }
                return;
            }

        }
    });
};


if(options.interval){
    check();
    interval = setInterval(check, options.interval);
}else{
    check();
}


process.on('exit', function(code) {
    if(!options.help && options.onFinish){
        exec(options.onFinish,{},function(error,stdout,stderr){
            if(stderr){
                return console.log(stderr);
            }
            return console.log(stdout);
        });
    }
});
