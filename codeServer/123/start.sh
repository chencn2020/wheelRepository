#start.sh
export PASSWORD="123456"
nohup ./code-server --port 8080 --host 0.0.0.0 --auth password > test.log 2>&1 &
echo $! > save_pid.txt