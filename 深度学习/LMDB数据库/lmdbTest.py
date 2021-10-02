
from cv2 import imwrite
import lmdb
import os
import tqdm
from PIL import Image  
import shutil

# path = '/home/liwenjuan/wangjuan/BIQA/dataBase/MakeBigData/data/rank_tid2013'
# img_path = os.path.join(path, 'distorted_img')
# ref_path = os.path.join(path, 'pristine_images')


env = lmdb.open('oppoFile', map_size=1099511627776)
# env = lmdb.open('waterloo', map_size=1099511627776)
saveFile = open('saveInfo.txt', 'w')

# txn = env.begin(write=True)
# index = 0
# print(sorted(os.listdir(img_path))[:100])

# for file in tqdm.tqdm(sorted(os.listdir(img_path))):
#     filePath = os.path.join(img_path, file)
#     # print(filePath)
#     saveFile.write(str(filePath) + '\n')
#     with open(filePath, 'rb') as f:
#         image_bin = f.read()
#     txn.put(filePath.encode(), image_bin) # path = '/home/liwenjuan/wangjuan/BIQA/dataBase/MakeBigData/data/rank_tid2013'
#     index += 1
#     os.remove(filePath)
#     if (index + 1) % 5000 == 0:
#         txn.commit()
#         txn = env.begin(write=True)
#         # break

# index = 0
# txn.commit()
# txn = env.begin(write=True)
# for file in tqdm.tqdm(os.listdir(ref_path)):
#     filePath = os.path.join(ref_path, file)
#     saveFile.write(str(filePath) + '\n')
#     with open(filePath, 'rb') as f:
#         image_bin = f.read()
#     txn.put(filePath.encode(), image_bin) # path = '/home/liwenjuan/wangjuan/BIQA/dataBase/MakeBigData/data/rank_tid2013'
#     index += 1
#     os.remove(filePath)
#     if (index + 1) % 5000 == 0:
#         txn.commit()
#         txn = env.begin(write=True)
#         # break
# txn.commit()
# saveFile.close()

oppoPath = '/home/liwenjuan/wangjuan/IQA_Oppo_testData/ISP_emulator-master/SSIMRes'
with env.begin(write=True) as txn:
    for case in tqdm.tqdm(os.listdir(oppoPath)):
        if 'csv' in case:
            continue
        filePath = os.path.join(oppoPath, case)
        for file in os.listdir(filePath):
            fileName = os.path.join(filePath, file)
            # print(fileName)
            saveFile.write(str(fileName) + '\n')
            with open(fileName, 'rb') as f:
                image_bin = f.read()
            txn.put(fileName.encode(), image_bin) # path = '/home/liwenjuan/wangjuan/BIQA/dataBase/MakeBigData/data/rank_tid2013'
# txn.commit()
saveFile.close()

# import cv2
# import numpy as np

# env = lmdb.open('waterloo')

# with env.begin(write=False) as txn:
#     # for key, value in txn.cursor():
#     #     print(key)
#     for file in tqdm.tqdm(os.listdir(ref_path)):

#         # 获取图像数据
#         image_bin = txn.get(os.path.join(ref_path, file).encode())
#         # print(image_bin)
#         # 将二进制文件转为十进制文件（一维数组）
#         image_buf = np.frombuffer(image_bin, dtype=np.uint8)
#         img = cv2.imdecode(image_buf, cv2.IMREAD_COLOR)
#         cv2.imwrite('./test/{}'.format(file), img)
        # cv2.waitKey(0)