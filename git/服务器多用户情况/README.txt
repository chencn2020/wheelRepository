如果服务器里面有多个git公钥，会出现clone时采用默认ssh公钥去clone私有库
从而导致权限不足的问题

解决方法：
在.ssh文件夹下创建config文件
分别指定不同ssh公钥，这样在clone时，服务器端就会自动遍历对应的具有权限的ssh公钥去发送请求

配置文件模板如下：

Host github.com                 
    HostName github.com
    IdentityFile /home/liwenjuan/.ssh/zevin
    PreferredAuthentications publickey
    User zevin

    
Host gitee.com                 
    HostName gitee.com
    IdentityFile /home/liwenjuan/.ssh/zevin
    PreferredAuthentications publickey
    User zevin
