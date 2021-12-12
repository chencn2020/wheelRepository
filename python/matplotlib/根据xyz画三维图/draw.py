from matplotlib import pyplot as plt

import numpy as np
from matplotlib import cm
from mpl_toolkits.mplot3d import Axes3D
import math

X, Y, Z1, Z2 = [], [], [], []
bestZ1 = [0, 0, 0]
bestZ2 = [0, 0, 0]

fileName = "20gain_SSIM+0.2PSNR_whole_Case18.csv"
with open(fileName) as f:
    infos = f.readlines()
    for info in infos:
        print(info)
        data = list(map(float, info.strip().split(',')[1:]))
        x, y, z1, z2 = data[0], data[5], data[-2], data[-1]
        # print(data)
        X.append(x)
        Y.append(y)
        Z1.append(z1)
        Z2.append(z2)
        if z1 > bestZ1[-1]:
            bestZ1 = [x, y, z1]
        if z2 > bestZ2[-1]:
            bestZ2 = [x, y, z2]
        # Z2.append(pow(2, z2))

figure = plt.figure()
#
ax = Axes3D(figure)

# X = np.arange(-10, 10, 0.25)
X = np.array(X)
#
# Y = np.arange(-10, 10, 0.25)
Y = np.array(Y)

#网格化数据

# X, Y = np.meshgrid(X, Y)

# R = np.sqrt(X**2 + Y**2)

# Z = np.cos(R)
Z1 = np.array(Z1)
Z2 = np.array(Z2)
# print(Z.shape)
# print(Z[0])
fig = plt.figure()
plt.title(fileName)
plt.axis('off')
ax = fig.add_subplot(121, projection='3d')
ax.plot_trisurf(X, Y, Z1, cmap=cm.coolwarm)
ax.scatter(bestZ1[0], bestZ1[1], bestZ1[2])
ax.text(bestZ1[0], bestZ1[1], bestZ1[2], '[{},{},{}]'.format(bestZ1[0], bestZ1[1], bestZ1[2]))
ax.set_title('formula')
ax.set_xlabel('fs')
ax.set_ylabel('ee')

ax = fig.add_subplot(122, projection='3d')
# ax.title('Formula')
ax.plot_trisurf(X, Y, Z2, cmap=cm.coolwarm)
ax.scatter(bestZ2[0], bestZ2[1], bestZ2[2])
ax.text(bestZ2[0], bestZ2[1], bestZ2[2], '[{},{},{}]'.format(bestZ2[0], bestZ2[1], bestZ2[2]))
ax.set_title('iqa')
ax.set_xlabel('fs')
ax.set_ylabel('ee')

plt.show()

