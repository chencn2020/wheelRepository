import time
print('Begin Test 2')
print('Begin time: ', time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()))

index = 0
while index <= 10:
    print("\tSleep {} ...".format(index))
    index += 1
    time.sleep(1)

print('End test2')
print('End time: ', time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()))