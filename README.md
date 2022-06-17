# Dashboard Wheel The World

An API to manage a straightforward visual tool for WTW people to keep a track on the maps and mappers' insights (related to Places to Stay), built using ExpressJS.

![Wheel The World Logo](https://yt3.ggpht.com/ytc/AKedOLTqfmzzNJXFj_68GOpz6aZDrXKWDXlp_SCpc5Vr=s900-c-k-c0x00ffffff-no-rj)

## Project demo (integrated with its React App)
▶️ [Watch Full Demo](https://www.loom.com/share/e045c92a5cbd464ea3f3cd7166d1f2b3)

Below is a screenshot of the Database used to query data for this API.

## Available endpoints (API Documentation)
📄 [See our API Documentation page here](https://sugared-fahrenheit-260.notion.site/WTW-Dashboard-API-Documentation-bca6e2aabb9d4bfda8b9355f726d0490)

### Maps Overview
Gets the general overview information, which includes the **completed maps summary** affected by the date picker and all time statistics (not affected by the date). All Time Statistics includes **worldwide data of the organization**, **average number of photos per map**, **least mapped areas**, **average completion time** and data to fill the **yearly history graphic**.
 
**URL:** `https://apidash2.herokuapp.com/maps/overview/{initalDate}/{finisDate}`

**Method:** `GET`

 **Response** 
```json {
   "summary":{
      "completedMaps":12,
      "mapsInProgress":181
   },
   "allTimeStatistics":{
      "worldwideInsights":[
         {
            "country_name":"Argentina",
            "cantidad":3
         },
         {
            "country_name":"Australia",
            "cantidad":1
         },
         {
            "country_name":"Bahrain",
            "cantidad":1
         },
         {
            "country_name":"Canada",
            "cantidad":12
         },
         {
            "country_name":"Dominican Republic",
            "cantidad":7
         },
	 ...
         {
            "country_name":"Kenya",
            "cantidad":10
         },
         {
            "country_name":"Turkey",
            "cantidad":1
         },
         {
            "country_name":"United Kingdom",
            "cantidad":21
         },
         {
            "country_name":"United States",
            "cantidad":368
         }
      ],
      "highlights":[
         {
            "country_name":"United States",
            "cantidad":368
         },
         {
            "country_name":"France",
            "cantidad":49
         },
         ...
         {
            "country_name":"Italy",
            "cantidad":8
         }
      ],
      "presence":{
         "countryNumber":27,
         "destinationNumber":206
      },
      "avgNumberOfPhotos":5,
      "leastMappedAreas":[
         {
            "inquiry_id":"beachfront",
            "menosMapeadas":37
         },
         {
            "inquiry_id":"parking",
            "menosMapeadas":91
         },
         {
            "inquiry_id":"other_areas",
            "menosMapeadas":203
         }
      ],
      "avgTimeCompletionPerMap":8,
      "completedAMSMaps":[
         {
            "cant":22,
            "mes":6,
            "año":2021
         },
         ...
         {
            "cant":12,
            "mes":6,
            "año":2022
         }
      ]
   }

```
 

### Maps Table
Gets all the accommodations list affected by the date picker(:initialDate & :finishDate) and other filters. It is used as a POST method to be able to send filter data according to the expected body explained below.

**URL:** `https://apidash2.herokuapp.com/maps/table/{initialDate}/{finishDate}`

**Method:** `POST`

 **Expected Body**
 
As a JSON body, it is needed to send an object with three properties inside: an array of countries, an array of cities and a string that can be "complete"/"non-complete"
  
  ```json 
  {
		  "countries": [],
		  "cities":[],
		   "filter": " "
  }
```
    
**Response**
```json 
{
			"id": "1g1J1JToZrbJaxwJSHOb8yVDjyo1_1641838464537",
			"placeName": "Ambassador Chicago",
			"city": "Chicago, United States",
			"progress": 100
}
```




### Map Details
Gets detailed information about an specific accomodation. These details include **general non accessibility information** about the map, **mapping progress**, **mapping duration**, **mapping dates** and the **mapping progress detailed by area**. The accommodation_uid is passed as a param to specify the accommodation that will be queried.

**URL:** `https://apidash2.herokuapp.com/maps/detail/{accomodation_uid}`

**Method:** `GET`

**Response:**
```json 
{
   "mapper":{
      "idMapper":94,
      "name":"Zachary",
      "lastname":"Dorsey",
      "photo":"No information"
   },
   "accomodation":{
      "nameHotel":"The Carriage House",
      "type":"Hotel",
      "address":"105 E Harmon Ave, Las Vegas, NV 89109, USA"
   },
   "progress":{
      "completedpercentage":100,
      "created":"2022-06-02T20:03:57.000Z",
      "duration":1,
      "lastUpdate":"2022-06-02T21:10:39.000Z"
   },
   "progressAreas":[
      {
         "name":"building_entrance",
         "process":95
      },
      {
         "name":"elevator",
         "process":98
      },
      {
         "name":"general_attributes",
         "process":26
      },
      {
         "name":"lobby",
         "process":53
      },
      {
         "name":"rooms",
         "process":80
      }
   ],
   "photos":[
      {
         "inquiry_id":"building_entrance",
         "cant":7
      },
      {
         "inquiry_id":"elevator",
         "cant":0
      },
      
      {
         "inquiry_id":"general_attributes",
         "cant":0
      },
      {
         "inquiry_id":"lobby",
         "cant":6
      },
      {
         "inquiry_id":"rooms",
         "cant":0
      },
      {
         "inquiry_id":"swimming_pool",
         "cant":4
      }
   ]
}
```



### Mappers overview
Gets all mappers list with basic information such as **name**, **profile picture**, **completed maps**, **in progress maps** and **contact email**. Params are passed in the URI to apply sorting and search by name.

**URL:** `https://apidash2.herokuapp.com/mappers/overview?:maps?:nombre?:apellido?:order?:page?`

**Method:** `GET`

**Response**
```json
[
    {
        "name": {
            "id": 256,
            "name": "Annerys",
            "lname": "Rivas",
            "photo": "https://lh3.googleusercontent.com/a-/AOh14GhRQedMjChkNHb3acJKaZt0W-ka4LWtmmCy5Ogl=s96-c"
        },
        "maps": {
            "done": 1,
            "progress": 0
        },
        "contact": "annerys@gowheeltheworld.com"
	},
	...
	{
        "name": {
            "id": 121,
            "name": "Arturo",
            "lname": "Gaona",
            "photo": "https://lh3.googleusercontent.com/a-/AOh14GhRQedMjChkNHb3acJKaZt0W-ka4LWtmmCy5Ogl=s96-c"
        },
        "maps": {
            "done": 9,
            "progress": 0
        },
        "contact": "agaona@gowheeltheworld.com"
	}
]
 ```



### Mapper details
Gets detailed information about an specific mapper by giving its id as a param. Information includes **name**, **contributions statistics**, and **last activity**.

**URL:** `https://apidash2.herokuapp.com/mappers/details/{id}`

**Method:** `GET`

**Response:**
```json 
{
   "name":{
      "name":"Arturo",
      "lname":"Gaona",
      "photo":"https://lh3.googleusercontent.com/a-/AOh14GgRUshmT817YjvNoL3IG_wYyqvQY28OX6QPjnAH=s96-c"
   },
   "contributions":{
      "total":9,
      "WTWcontributions":"Pending",
      "inprogress":0,
      "averageTime":60.5556
   },
   "replies":{
      "lastReply":{
         "day":"16",
         "month":"05",
         "year":"2022",
         "hour":"19:07:43"
      },
      "lastCompletedArea":{
         "Area":"rooms_two",
         "location":{
            "name":"Hotel Marquis Reforma",
            "location":{
               "city":"Ciudad de México",
               "country":"Mexico"
            }
         }
      }
   }
}
```



### Mapper Contributions
Gets all the accommodations associated to an speciffic mapper affected by filters. It is used as a POST method to be able to send filter data according to the expected body explained below. It returns the **accommodations name**, **city** and **total progress**.

**URL:** `https://apidash2.herokuapp.com/mappers/contributions/{id}`

**Method:** `POST`

**Expected Body**
As a JSON body, it is needed to send an object with three properties inside: an array of countries, an array of cities and a string that can be "complete"/"non-complete".

```json
{
	"countries": ["Mexico","France", "United States"],
    "cities": [""],
    "filter": "complete"
}
 ```


**Response** 
```json 
[
    {
        "id": "CZ3qPFVV7qdlwqTpSSiRINgF14K3_1639426450208",
        "placeName": "Crowne Plaza Englewood, an IHG Hotel",
        "city": "Chicago, United States",
        "progress": 100
    },
    {
        "id": "CZ3qPFVV7qdlwqTpSSiRINgF14K3_1641149537492",
        "placeName": "Homewood Suites by Hilton Hamilton Township",
        "city": "Chicago, United States",
        "progress": 100
    }
    ...
]
```



### Countries & Cities List
Gets a list of all the cities and countries available in the database to apply filters according to these arrays.

**URL:** `https://apidash2.herokuapp.com/mappers/countries`

**Method:** `GET`


**Response**
```json 
{
    "cities": [
        "Aberdeen",
        "Alpharetta",
        "Altamonte Springs",
        "Anaheim",
        "Arlin",
        ...
    ],
    "countries": [
        "Afghanistan",
        "Andorra",
        "Argentina",
        "Australia",
        "Bahrain",
        "Belgium",
        "United Kingdom",
        "United States",
        ...
    ]
}
```




## Development
- Clone the repo:
```
$ git clone https://github.com/VicReyes1/apiWTW.git
```

- Go to the project directory and install dependencies:
```
$ cd apiWTW
$ npm i
```

- To properly run this project, you'll need to authenticate users by using Firebase. We invite you to add an .env file manually in the root directory. Firstly, create your own firebase project and its database. Inside that .env file, add the following line:
```
REACT_APP_ACCESS_KEY = {your access key here, without spaces, formatted in just one line}
```

- To use the required database service, please include the following data inside the same .env file:
```
PORT_serv = 
HOST = 
USER_db = 
PASS = 
NAME_db = 
PORT_db = 
```

- Run the API locally:
```
$ npm run dev
```

## Give it a try!
💻 You can get access to the API through this link: https://apidash2.herokuapp.com/


## Interesting links
- Wheel the World Website:
[https://wheeltheworld.com/](url)
- About Wheel the World:
[https://wheeltheworld.com/about-us](url)
- Frontend Repository:
[https://github.com/EmmanuelBoM/dashWTW](url)


## Contributors
- Víctor Serrano Reyes @VicReyes1
- José Herón Samperio León @HeronSamperio
- Edgar Daniel Acosta Rosales @DonKatsun
- Diana Guadalupe García Aguirre @DianaA96
- Emmanuel Bolteada Manzo @EmmanuelBoM

