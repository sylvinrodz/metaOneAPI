
## API Reference

#### Main API base URL
```http
https://asia-south1-metaone-ec336.cloudfunctions.net/api
```
## Login
#### Get All login 

```http
  GET /logins
```
- To get all the users data


#### Get login by id

```http
  GET /login/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID of the user      |

- To get single user data by ID

## Avtar (Save Avtar)


```http
  POST /saveAvatar
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userID`      | `string` | **Required**. ID of the user  |
| `Data`      | `string` | **Required**. Add all your data points  |

- To save user Avtar

```http
  GET /getAvtar/:userID
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `userID`      | `string` | **Required**. ID of the user      |

- To get single user Avtar by userID

## Spaces (User Based)

#### Get All Space 

```http
  GET /spaces/:userID/:limit/:lastName
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :-------------------------   |
| `userID` | `string` | **Required**. ID of the user  |
| `limit` | `string` | **Required**. number of spaces |
| `lastName` | `string` | **Required**. name of the last space |

- To get spaces of the user by userID

#### Search Space by name 

```http
  GET /serchSpaces/:userID/:name
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :-------------------------   |
| `userID` | `string` | **Required**. ID of the user  |
| `name` | `string` | **Required**. Search Text (name) |

- To serach spaces by name

#### Get space by id

```http
  GET /api/space/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. SpaceId of single space details to fetch |

- To get single space data by Space ID

## Spaces (New Spaces)(Pre-Added)

#### Get All Space 

```http
  GET /newSpaces/:limit/:lastName
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :-------------------------   |
| `limit` | `string` | **Required**. number of spaces |
| `lastName` | `string` | **Required**. name of the last space |

- To get all spaces added by Admin(Skilliza)

#### Add new space in user spaces 

```http
  POST /addnewSpacesInUser
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :-------------------------   |
| `newSpacesID` | `string` | **Required**.ID of the New Spaces |
| `userID` | `string` | **Required**. ID of the user |

- To add spaces added by Admin(Skilliza) to spaces (user based)


## Spaces (3d Models)(unity)

#### All Models
```http
  GET /getSpaceObjects/:spaceID/:SpaceType
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :-------------------------   |
| `spaceID` | `string` | **Required**. ID of spaces |
| `SpaceType` | `string` | **Required**. type of space (Explor,spaces) |

- To get 3d models of particular space

#### All Models move
```http
  POST /moveSpaceObject
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :-------------------------   |
| `modalID` | `string` | **Required**. ID of model |
| `position` | `string` | **Required**. position of model |
| `rotation` | `string` | **Required**. rotation of model |
| `scale` | `string` | **Required**. scale of model |
- To get 3d models of particular space

#### Main Model
```http
  GET /getSpaceMainObject/:spaceID/:SpaceType
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :-------------------------   |
| `spaceID` | `string` | **Required**. ID of spaces |
| `SpaceType` | `string` | **Required**. type of space (Explor,spaces) |

- To get 3d models of particular space

## Spaces (Files)(images,videos)(unity)
```http
  GET /getSpaceFiles/:spaceID/:SpaceType
```

| Parameter | Type     | Description                  |
| :-------- | :------- | :-------------------------   |
| `spaceID` | `string` | **Required**. ID of spaces |
| `SpaceType` | `string` | **Required**. type of space (Explor,spaces) |

- To get 3d models of particular space