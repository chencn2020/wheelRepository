nohup python3 -u test1.py > test1.log &
while true
do
        process=`ps -ef| grep $! | grep -v grep`; #查询mysqld进程，grep -v grep去掉grep进程
        sleep 1;
        if [ "$process" == "" ]; then
            sleep 1;
            echo "process 不存在,开始执行";
            nohup python3 -u test2.py > test2.log &
            break;
        fi
done