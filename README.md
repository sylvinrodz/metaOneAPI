
# Meta One By Skilliza

You will get all api's listed below:


## API Reference

#### Get All login 

```http
  GET /api/logins
```

#### Get login by id

```http
  GET /api/login/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of single login details to fetch |

#### Get All Space 

```http
  GET /api/spaces
```

#### Get space by id

```http
  GET /api/space/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of single space details to fetch |

#### Delete space by id

```http
  DELETE /api/space/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of single space details to fetch |

#### Update space by id

```http
  PUT /api/space/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of single space details to fetch |
| `data`    | `array` | **Required**. Data of single space details to fetch |

#### Add space

```http
  POST /api/addSpace
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Id of single space details to fetch |
| `authorID`  | `string` | **Required**. authorID of single space details to fetch |
| `image`     | `url` | **Required**. image of single space details to fetch |

#### Add modal in space

```http
  POST /api/addSpace
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Id of single space details to add |
| `spaceID`  | `string` | **Required**. spaceID of single space details to add |
| `authorID`  | `string` | **Required**. authorID of single space details to add |
| `position`     | `array` | **Required**. position of single space details to add |
| `rotation`     | `array` | **Required**. rotation of single space details to add |
| `scale`     | `array` | **Required**. scale of single space details to add |
| `model`     | `GLB` | **Required**. 3d Model in GLB format of single space details to add minimum 15 mb |