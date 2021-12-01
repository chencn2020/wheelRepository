from smt.sampling_methods import LHS
import numpy as np

xlimits = np.array([[0, 10.99], [0, 9.99], [0, 99.99]])
sampling = LHS(xlimits=xlimits, criterion='correlation')
sample = sampling(3)
print(sample)