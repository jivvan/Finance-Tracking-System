import numpy as np
from collections import Counter
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split


class DecisionTree:
    def __init__(self, max_depth=None):
        self.max_depth = max_depth

    def fit(self, X, y):
        self.n_classes = len(set(y))
        self.features = X.shape[1]
        self.tree = self._build_tree(X, y)

    def predict(self, X):
        return np.array([self._predict_single(x, self.tree) for x in X])

    def _build_tree(self, X, y, depth=0):
        if len(set(y)) == 1 or len(y) == 0 or (self.max_depth and depth >= self.max_depth):
            return Counter(y).most_common(1)[0][0]

        feature, threshold = self._best_split(X, y)
        if feature is None:
            return Counter(y).most_common(1)[0][0]

        left_indices = X[:, feature] < threshold
        right_indices = X[:, feature] >= threshold

        return {
            "feature": feature,
            "threshold": threshold,
            "left": self._build_tree(X[left_indices], y[left_indices], depth + 1),
            "right": self._build_tree(X[right_indices], y[right_indices], depth + 1)
        }

    def _best_split(self, X, y):
        n_samples, n_features = X.shape
        best_gain = -1
        split_feature, split_threshold = None, None

        for feature in range(n_features):
            # Get all values for this feature
            feature_column = X[:, feature]
            # Unique values as candidate thresholds
            thresholds = np.unique(feature_column)

            for threshold in thresholds:
                gain = self._information_gain(feature_column, y, threshold)
                if gain > best_gain:
                    best_gain = gain
                    split_feature = feature
                    split_threshold = threshold

        return split_feature, split_threshold

    def _information_gain(self, feature_column, y, threshold):
        parent_entropy = self._entropy(y)

        # Split y based on the threshold
        left_indices = feature_column < threshold
        right_indices = ~left_indices  # Complement of left indices

        left_split = y[left_indices]
        right_split = y[right_indices]

        # Calculate weighted average entropy of child nodes
        n = len(y)
        n_left = len(left_split)
        n_right = len(right_split)

        if n_left == 0 or n_right == 0:  # Avoid division by zero
            return 0

        child_entropy = (n_left / n) * self._entropy(left_split) + \
            (n_right / n) * self._entropy(right_split)
        return parent_entropy - child_entropy

    def _entropy(self, y):
        if len(y) == 0:
            return 0
        counts = np.bincount(y)
        probabilities = counts / len(y)
        return -np.sum([p * np.log2(p) for p in probabilities if p > 0])

    def _predict_single(self, x, tree):
        if isinstance(tree, dict):
            feature = tree["feature"]
            threshold = tree["threshold"]
            if x[feature] < threshold:
                return self._predict_single(x, tree["left"])
            else:
                return self._predict_single(x, tree["right"])
        else:
            return tree


class RandomForest:
    def __init__(self, n_trees=10, max_depth=None, max_features=None, random_state=None):
        self.n_trees = n_trees
        self.max_depth = max_depth
        self.max_features = max_features
        self.random_state = random_state
        self.trees = []
        if random_state is not None:
            np.random.seed(random_state)

    def fit(self, X, y):
        self.trees = []
        n_samples, n_features = X.shape
        self.max_features = self.max_features or n_features

        # Convert `y` to NumPy array to avoid Pandas slicing issues
        y = np.array(y)

        for _ in range(self.n_trees):
            # Bootstrap sampling
            indices = np.random.choice(n_samples, n_samples, replace=True)
            X_sample, y_sample = X[indices], y[indices]

            # Create and train a new tree
            tree = DecisionTree(max_depth=self.max_depth)
            tree.fit(X_sample, y_sample)
            self.trees.append(tree)

    def predict(self, X):
        tree_predictions = np.array([tree.predict(X) for tree in self.trees])
        # Majority voting
        return np.apply_along_axis(lambda x: Counter(x).most_common(1)[0][0], axis=0, arr=tree_predictions)


if __name__ == "__main__":
    # Load dataset
    iris = load_iris()
    X, y = iris.data, iris.target

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)

    # Train Random Forest
    rf = RandomForest(n_trees=5, max_depth=3)
    rf.fit(X_train, y_train)

    # Make predictions
    y_pred = rf.predict(X_test)

    # Calculate accuracy
    accuracy = np.sum(y_pred == y_test) / len(y_test)
    print(f"Accuracy: {accuracy:.2f}")
