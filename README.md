
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

#### Add space

```http
  POST /api/space
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Id of single space details to fetch |
| `authorID`      | `string` | **Required**. Id of single space details to fetch |
| `image`      | `url` | **Required**. Id of single space details to fetch |
| `postion`      | `array` | **Required**. Id of single space details to fetch |
| `rotation`      | `array` | **Required**. Id of single space details to fetch |
| `scale`      | `array` | **Required**. Id of single space details to fetch |