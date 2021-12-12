from matplotlib import pyplot as plt

import numpy as np

from mpl_toolkits.mplot3d import Axes3D

X, Y, Z1, Z2 = [], [], [], []
with open("20gain_SSIM+0.2PSNR_whole_Case1.csv") as f:
    infos = f.readlines()
    for info in infos:
        data = list(map(float, info.strip().split(',')[1:]))
        x, y, z1, z2 = data[0], data[5], data[-2], data[-1]
        # print(x, y, z1, z2)
        X.append(x)
        Y.append(y)
        Z1.append(z1)
        Z2.append(z2)

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
ax.plot_trisurf(X, Y, Z1)
ax.plot_trisurf(X, Y, Z2)


plt.show()

