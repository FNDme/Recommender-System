# Recommender system based on collaborative filtering

[![Tests](https://github.com/FNDme/Recommender-System/actions/workflows/test.js.yml/badge.svg?branch=main)](https://github.com/FNDme/Recommender-System/actions/workflows/test.js.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=FNDme_Recommender-System&metric=coverage)](https://sonarcloud.io/summary/new_code?id=FNDme_Recommender-System)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=FNDme_Recommender-System&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=FNDme_Recommender-System)

## Description

Recommender systems are a very useful tool for organizations when choosing what content to show or offer to their customers/visitors. In this case, we seek to develop a system that, given a matrix of ``j`` user ratings to ``i`` products, can predict the ratings that a different ``j`` user would give to a different ``i`` product, which has already been rated by other users, based on the correlation between users.

|   | Product 1 | Product 2 | Product 3 | Product 4 | Product 5 |
|---|------------|------------|------------|------------|------------|
| User 1 | 5 | 3 | 4 | 4 | ? |
| User 2 | 3 | 1 | 2 | 3 | 3 |
| User 3 | 4 | 3 | 4 | 3 | 5 |
| User 4 | 3 | 3 | 1 | 5 | 4 |
| User 5 | 1 | 5 | 5 | 2 | 1 |

For example, making use of Pearson's correlation, it can be predicted that user 1 would rate product 5 with a 4.85.

However, most of the cases encountered do not have a single unknown element within this matrix, so our system has been modeled to resolve multiple unknown elements.

## Input format

The recommender system receives as input a plain text file with the following format:

```txt
1 2 3 4 5
1 5 3 4 4
2 - 1 2 3
3 4 3 4 3
4 3 3 1 5
5 1 5 5 2
```

Where each value can be a number or a `-`. The numbers represent the rating that a user has given to a product, while the dashes represent that the user has not rated the product. In this case, the recommender system should predict the rating that user 3 would give to product 3.
