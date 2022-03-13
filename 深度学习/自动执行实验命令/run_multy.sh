order_list=(`nohup python3 -u test1.py > test1_1.log \&`
`nohup python3 -u test1.py > test1_2.log \&`
`nohup python3 -u test1.py > test1_3.log \&`
`nohup python3 -u test2.py > test2.log \&`
)
for order in ${order_list[@]}; do
    $order
    sleep 10;
    while true
    do
        process=`ps -ef| grep $! | grep -v grep`;
        sleep 1;
        if [ "$process" == "" ]; then
            echo "Order has been finished. Begin Another one.";
            break;
        fi
    done
done
echo 'Finish all orders in list'