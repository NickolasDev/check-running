## Install

```sh
$ npm install check-running -g
```


## Usage

```
Usage: check-running <options>
         -p process name. Exemple: -p mongod
         -i interval. Exemple: -i 10000
         -m max check. Exemple: -m 3
         -r onRunning process. Exemple: -r "echo 'Process is runing pid: {{pid}}'"
         -e if process not found, exec command line. Exemple: -e "echo 'Process not found'"
         -f exec command line on finish check-running
```

## License

The MIT License (MIT)