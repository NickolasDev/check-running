var exec = require('child_process').exec;
var colors = require('colors');
var argv = require('minimist')(process.argv.slice(2));
var options = {};
var interval;
var numberIteration=0;
var stop;

options.process = argv.p;
options.interval = argv.i;
options.onEnd = argv.e;
options.onFinish = argv.f;
options.onRunning = argv.r;
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
    console.log('\t -p process name. Exemple:\n\t\t -p mongod');
    console.log('\t -i interval. Exemple:\n\t\t -i 10000');
    console.log('\t -m max check loop. Exemple:\n\t\t -m 3');
    console.log('\t -r onRunning process. Exemple:\n\t\t -r "echo \'Process is runing pid: {{pid}}\'"');
    console.log('\t -e if process not foud exec command line. Exemple:\n\t\t -e "echo \'Process not found\'"');
    console.log('\t -f exec command line on finish check-running. Exemple:\n\t\t -e "echo \'Exit check....\'"');

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
        exec(options.onFinish,{},function(error,stdout,stderr){
            if(stderr){
                return console.log(stderr);
            }
            return console.log(stdout);
        });

        return;
    }
    exec('pgrep -fx '+options.process,{},function(error,stdout,stderr){
        var pdi;
        if(stdout){
            pid = stdout.substring(0, stdout.length - 2);
            options.onRunning = options.onRunning.replace(/{{pid}}/g,pid)
            exec(options.onRunning,{},function(error,stdout,stderr){
                if(stderr){
                    return console.log(stderr);
                }
                return console.log(stdout);
            });
        }else if(options.onEnd){
            exec(options.onEnd,{},function(error,stdout,stderr){
                if(stderr){
                    return console.log(stderr);
                }
                return console.log(stdout);
            });
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
    if(options.help && options.help==false){
        exec(options.onFinish,{},function(error,stdout,stderr){
            if(stderr){
                return console.log(stderr);
            }
            return console.log(stdout);
        });
    }
});
