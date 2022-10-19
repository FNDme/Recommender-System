[![Tests](https://github.com/FNDme/Recommender-System/actions/workflows/test.js.yml/badge.svg?branch=main)](https://github.com/FNDme/Recommender-System/actions/workflows/test.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/FNDme/Recommender-System/badge.svg?branch=main)](https://coveralls.io/github/FNDme/Recommender-System?branch=main)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=FNDme_Recommender-System&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=FNDme_Recommender-System)

# Sistema de reomendación basado en filtrado colaborativo

## Descripción
Los sistemas de recomendación son una herramienta muy útil para las organizaciónes a la hora de elegir que contenido mostrar u ofrecer a sus clientes/visitantes. En este caso, se busca desarrollar un sistema que, dado una matriz de valoraciones de usuarios ``j`` a productos ``i``, pueda predecir las valoraciones que un usuario ``j`` distinto daría a un producto ``i`` distinto, que ya ha sido valorado por otros usuarios, basandonos en la correlación entre los usuarios.

<!-- Tabla de ejemplo -->
|   | Producto 1 | Producto 2 | Producto 3 | Producto 4 | Producto 5 |
|---|------------|------------|------------|------------|------------|
| Usuario 1 | 5 | 3 | 4 | 4 | ? |
| Usuario 2 | 3 | 1 | 2 | 3 | 3 |
| Usuario 3 | 4 | 3 | 4 | 3 | 5 |
| Usuario 4 | 3 | 3 | 1 | 5 | 4 |
| Usuario 5 | 1 | 5 | 5 | 2 | 1 |

Por ejemplo, haciendo uso de la correlación de Pearson (ver [1]), se puede predecir que el usuario 1 valoraría el producto 5 con un 4.85.

Sin embargo, la mayoría de los casos que se encuentran, no tienen un único elemento desconocido dentro de esta matriz, con lo que nuestro sistema ha sido modelado para resolver múltiples elementos desconocidos.

