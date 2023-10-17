---
title: Machine Learning with Python - Data Preprocessing
published: true
description: 
date: 2023-10-17
---

# Machine Learning with Python - Data Preprocessing

Data preprocessing is an essential step in any machine learning project. It involves cleaning and transforming raw data into a format suitable for training machine learning models. In this blog post, we will walk through a Python code snippet for data preprocessing using the popular libraries pandas and scikit-learn. We will explain each step in detail and demonstrate how to handle missing data and perform feature scaling.

## Step 1: Importing Libraries and Loading Data

The first step is to import the necessary libraries and load the dataset. In our example, we are using the pandas library to read a CSV file named 'house-prices.csv'. This dataset likely contains various features related to house prices, and our goal is to prepare it for machine learning tasks.

```python
import pandas as pd
import numpy as np

# Load the dataset
dataset = pd.read_csv('house-prices.csv')
```
This is how our dataset looks like:

```csv
name,size,bedrooms,bathrooms,garage_size,price
house A,64,3,2,,430000
house B,42,2,1,1,260000
house C,53,3,2,2,330000
house D,42,2,1,1,255000
house E,64,3,2,2,410000
house F,70,4,3,2,450000
house G,38,2,1,1,245000
house H,55,3,,2,360000
house I,48,2,1,1,305000
house J,60,3,2,2,390000
house K,33,2,1,0,220000
house L,58,3,2,2,375000
house M,46,2,1,1,290000
house N,62,3,2,2,400000
house O,35,,1,0,230000
house P,51,3,2,2,340000
house Q,45,2,1,1,295000
house R,67,4,3,2,430000
house S,40,2,1,1,255000
house T,53,3,2,2,345000
```

## Step 2: Splitting Data into Features (X) and Target (y)

In machine learning, we typically distinguish between features (X) and the target variable (y). Features are the input variables that our model will use to make predictions, while the target is what we want to predict. We can split the dataset into X and y as follows:

```python
X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, -1].values
```

## Step 3: Handling Missing Data

Real-world datasets often contain missing values, which can lead to issues during model training. To address this, we need to handle missing data. In this example, we count the number of missing entries for each column and then fill in missing values with the median using scikit-learn's SimpleImputer.

```python
from sklearn.impute import SimpleImputer
imputer = SimpleImputer(missing_values=np.nan, strategy='median')
imputer.fit(X[:, 1:5])
X[:, 1:5] = imputer.transform(X[:, 1:5])
```

`SimpleImputer` is instantiated with the following parameters:
- `missing_values`: This parameter specifies what to consider as missing values. In the code, np.nan represents NaN values.
- `strategy`: This parameter determines the imputation strategy. In this case, 'median' is chosen, which means missing values in a column are replaced with the median value of that column.

`imputer.fit(X[:, 1:5])`: This line calculates the median for each of the selected columns (columns 1 to 4, as represented by X[:, 1:5]).

`imputer.transform(X[:, 1:5])`: This line replaces the missing values in the selected columns with the calculated medians. The transformation is applied to the same columns used for fitting the imputer.

By imputing missing values with the median, we ensure that the dataset remains representative of the overall data distribution. The median is a robust statistic that is less affected by outliers, making it a suitable choice for imputation.

Handling missing data in this way allows your machine learning models to work with complete datasets, preventing errors and ensuring that no valuable information is lost due to missing values.

## Step 4: Splitting the Dataset into Training and Test Sets

To evaluate the performance of a machine learning model, we split the dataset into a training set and a test set. The training set is used to train the model, while the test set is used to evaluate its performance. In this code, we use scikit-learn's train_test_split to accomplish this.

```python
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=1)
```

## Step 5: Feature Scaling

Feature scaling is a critical data preprocessing step that aims to standardize or normalize the numerical features in your dataset. This process ensures that all the features have the same scale, making it easier for machine learning algorithms to work effectively and converge faster. Many machine learning algorithms, such as linear regression, support vector machines, and k-nearest neighbors, are sensitive to the scale of the input features. When features have different scales, it can lead to issues like:

- Gradient Descent Convergence: In optimization algorithms like gradient descent, having features with different scales can cause the algorithm to converge slowly or get stuck in local minima.

- Euclidean Distance: Algorithms that rely on distance calculations, like k-nearest neighbors and clustering, are influenced by feature scales. Features with larger scales can dominate the distance calculation.

- Model Performance: Scaling features can lead to improved model performance and the ability to compare the importance of different features more accurately.

In this code, we use StandardScaler from scikit-learn to standardize our features. This process involves subtracting the mean and dividing by the standard deviation.

```python
from sklearn.preprocessing import StandardScaler
sc = StandardScaler()
X_train[:, 1:] = sc.fit_transform(X_train[:, 1:])
X_test[:, 1:] = sc.transform(X_test[:, 1:])
```

- `X_train[:, 1:] and X_test[:, 1:]` refer to all rows but only columns from index 1 onward. This is because the first column might be categorical or contain IDs, which should not be scaled.
- `fit_transform` is used on the training set to calculate the mean and standard deviation and then perform the transformation.
- `transform` is used on the test set to apply the same scaling as the training set to ensure consistency.

By standardizing the features, the scale-related issues mentioned earlier are mitigated. The transformed features will have a mean of 0 and a standard deviation of 1, making them more amenable to machine learning algorithms and ensuring that no particular feature dominates the learning process.

## Conclusion

Final dataset looks like the one below. Missing data was filled with values, after split to training set and test set all features are standardized. Now this data can be used to train a machine learning model.


Training set features:
```python
[
  ['house C' -0.12687740177229898 0.20851441405707477 0.29559878344928797 0.6255432421712244]
  ['house O' -1.953911987293404 0.20851441405707477 -1.2809280616135812 -2.710687382741972]
  ['house E' 0.989643733823932 0.20851441405707477 0.29559878344928797 0.6255432421712244]
  ['house R' 1.2941494980774495 1.876629726513673 1.872125628512157 0.6255432421712244]
  ['house H' 0.07612644106337939 0.20851441405707477 0.29559878344928797 0.6255432421712244]
  ['house B' -1.24339853736853 -1.4596008983995234 -1.2809280616135812 -1.0425720702853738]
  ['house N' 0.7866398909882536 0.20851441405707477 0.29559878344928797 0.6255432421712244]
  ['house A' 0.989643733823932 0.20851441405707477 0.29559878344928797 0.6255432421712244]
  ['house T' -0.12687740177229898 0.20851441405707477 0.29559878344928797 0.6255432421712244]
  ['house S' -1.4464023802042083 -1.4596008983995234 -1.2809280616135812 -1.0425720702853738]
  ['house J' 0.5836360481525753 0.20851441405707477 0.29559878344928797 0.6255432421712244]
  ['house P' -0.3298812446079773 0.20851441405707477 0.29559878344928797 0.6255432421712244]
  ['house I' -0.6343870088614948 -1.4596008983995234 -1.2809280616135812 -1.0425720702853738]
  ['house M' -0.8373908516971732 -1.4596008983995234 -1.2809280616135812 -1.0425720702853738]
  ['house L' 0.3806322053168969 0.20851441405707477 0.29559878344928797 0.6255432421712244]
  ['house F' 1.598655262330967 1.876629726513673 1.872125628512157 0.6255432421712244]
]
```
Training set target:
```python
[
  330000 230000 410000 430000 360000 260000 400000 430000 345000 255000 390000 340000 305000 290000 375000 450000
]
```
Test set features:
```python
[
  ['house D' -1.24339853736853 -1.4596008983995234 -1.2809280616135812 -1.0425720702853738]
  ['house Q' -0.9388927731150124 -1.4596008983995234 -1.2809280616135812 -1.0425720702853738]
  ['house G' -1.6494062230398867 -1.4596008983995234 -1.2809280616135812 -1.0425720702853738]
  ['house K' -2.1569158301290825 -1.4596008983995234 -1.2809280616135812 -2.710687382741972]
]
```
Test set target:
```python
[
  255000 295000 245000 220000
]
```

Data preprocessing is a vital step in building machine learning models. In this blog post, we explained each step of data preprocessing using Python, with a focus on handling missing data and feature scaling. By following these steps, you can ensure that your dataset is ready for training machine learning models, leading to better results and more robust predictions.