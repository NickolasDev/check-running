# Check Running


[![NPM version](https://badge.fury.io/js/check-running.svg)](http://badge.fury.io/js/check-running)
[![Dependency Status](https://david-dm.org/nickolasdev/check-running.svg)](https://david-dm.org/nickolasdev/check-running)

## Install

```sh
$ npm install check-running -g
```


## Usage

```
Usage: check-running <options>
         -p process name. Example: -p mongod
         -i interval. Example: -i 10000
         -m max check. Example: -m 3
         -r onRunning process. Example: -r "echo 'Process is runing pid: {{pid}}'"
         -y exit on Found process. Example: -y true'
         -e if process not found, exec command line. Example: -e "echo 'Process not found'"
         -k exit on Not Found process. Example: -k true
         -f exec command line on finish check-running
```

## License

The MIT License (MIT)