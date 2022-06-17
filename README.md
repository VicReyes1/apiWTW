# Dashboard Wheel The World

An API to manage a straightforward visual tool for WTW people to keep a track on the maps and mappers' insights (related to Places to Stay), built using ExpressJS.

![Wheel The World Logo](https://yt3.ggpht.com/ytc/AKedOLTqfmzzNJXFj_68GOpz6aZDrXKWDXlp_SCpc5Vr=s900-c-k-c0x00ffffff-no-rj)

## Project demo (integrated with its React App)
(Insert demo link here).

## Available endpoints
- (Insert here a list of the endpoints and their description).

1. Name: Map Overview
Type: Get
 URI Deploy: https://apidash2.herokuapp.com/maps/overview/{initalDate}/{finisDate}

 Response: "Status: 200, JSON: {
        ""summary"": {
                ""completedMaps"": 565,
                ""mapsInProgress"": 734
        },
        ""allTimeStatistics"": {
                ""worldwideInsights"": [
                        {
                                ""country_name"": ""Argentina"",
                                ""cantidad"": 3
                        },
                        {
                                ""country_name"": ""Australia"",
                                ""cantidad"": 1
                        },
                        {
                                ""country_name"": ""Bahrain"",
                                ""cantidad"": 1
                        },
                        {
                                ""country_name"": ""Canada"",
                                ""cantidad"": 12
                        },
                        {
                                ""country_name"": ""Cayman Islands"",
                                ""cantidad"": 1
                        },
                        {
                                ""country_name"": ""Chile"",
                                ""cantidad"": 45
                        },
                      
                        {
                                ""country_name"": ""Denmark"",
                                ""cantidad"": 4
                        },
                        {
                                ""country_name"": ""Dominican Republic"",
                                ""cantidad"": 7
                        },
                        {
                                ""country_name"": ""France"",
                                ""cantidad"": 49
                        },
                        {
                                ""country_name"": ""Greece"",
                                ""cantidad"": 6
                        },
                      
                        {
                                ""country_name"": ""Italy"",
                                ""cantidad"": 8
                        },
                        {
                                ""country_name"": ""Kenya"",
                                ""cantidad"": 10
                        },
                        {
                                ""country_name"": ""Mexico"",
                                ""cantidad"": 24
                        },
                        {
                              
                                ""country_name"": ""United Kingdom"",
                                ""cantidad"": 21
                        },
                        {
                                ""country_name"": ""United States"",
                                ""cantidad"": 368
                        }
                ],
                ""highlights"": [
                        {
                                ""country_name"": ""United States"",
                                ""cantidad"": 368
                        },
                        {
                                ""country_name"": ""France"",
                                ""cantidad"": 49
                        },
                        {
                                ""country_name"": ""Chile"",
                                ""cantidad"": 45
                        },
                        {
                                ""country_name"": ""Mexico"",
                                ""cantidad"": 24
                        },
                        {
                                ""country_name"": ""United Kingdom"",
                                ""cantidad"": 21
                        },
                        {
                                ""country_name"": ""Spain"",
                                ""cantidad"": 17
                        },
                        {
                                ""country_name"": ""Canada"",
                                ""cantidad"": 12
                        },
                        {
                                ""country_name"": ""Peru"",
                                ""cantidad"": 11
                        },
                        {
                                ""country_name"": ""Kenya"",
                                ""cantidad"": 10
                        },
                        {
                                ""country_name"": ""Italy"",
                                ""cantidad"": 8
                        }
                ],
                ""presence"": {
                        ""countryNumber"": 27,
                        ""destinationNumber"": 206
                },
                ""avgNumberOfPhotos"": 5,
                ""leastMappedAreas"": [
                        {
                                ""inquiry_id"": ""ROOM3302\""\"":85"",
                                ""menosMapeadas"": 1
                        },
                        {
                                ""inquiry_id"": ""EVT401\""\"":[\""\""https://firebasestorage.googleapis.com/v0/b/wtw-production.appspot.com/o/ams-photos%2F71RnhfWcFRWfawtiKbLoz0L6tek1_1644050091575_EVT401_0.jpg\""\"""",
                                ""menosMapeadas"": 1
                        },
                        {
                                ""inquiry_id"": ""https://firebasestorage.googleapis.com/v0/b/wtw-production.appspot.com/o/ams-photos%2FTbZKVFhNloX75OVgQDbrAZH5FYJ3_1651184452195_EXTRA_PHOTOS_1.jpg\""\"""",
                                ""menosMapeadas"": 1
                        }
                ],
                ""avgTimeCompletionPerMap"": 8,
                ""completedAMSMaps"": [
                        {
                                ""cant"": 22,
                                ""mes"": 6,
                                ""año"": 2021
                        },
                        {
                                ""cant"": 28,
                                ""mes"": 7,
                                ""año"": 2021
                        },
                        {
                                ""cant"": 10,
                                ""mes"": 8,
                                ""año"": 2021
                        },
                        {
                                ""cant"": 16,
                                ""mes"": 9,
                                ""año"": 2021
                        },
                        {
                                ""cant"": 22,
                                ""mes"": 10,
                                ""año"": 2021
                        },
                        {
                                ""cant"": 38,
                                ""mes"": 11,
                                ""año"": 2021
                        },
                        {
                                ""cant"": 53,
                                ""mes"": 12,
                                ""año"": 2021
                        },
                        {
                                ""cant"": 69,
                                ""mes"": 1,
                                ""año"": 2022
                        },
                        {
                                ""cant"": 76,
                                ""mes"": 2,
                                ""año"": 2022
                        },
                        {
                                ""cant"": 45,
                                ""mes"": 3,
                                ""año"": 2022
                        },
                        {
                                ""cant"": 63,
                                ""mes"": 4,
                                ""año"": 2022
                        },
                        {
                                ""cant"": 50,
                                ""mes"": 5,
                                ""año"": 2022
                        },
                        {
                                ""cant"": 12,
                                ""mes"": 6,
                                ""año"": 2022
                        }
                ]
        }
}"
 
 Description : Obtiene la información de el overview, el cual consta de summary (afectado por initialDate e finishDate), el cual contiene los ampeos en porgreso y completados, y all Time estadistics (no afectado por las fechas), esta parte contiene los paises con mayores mapeos, el top 10 de esos paies, en cuantos paises esta la empresa (countryNumber), cantidad ciudades donde tienen presencia(destinationNumber), promedio de fotos por mapeo (avgNumberOfPhotos), nombre de áreas menos mapeadas (leastMappedAreas), el promedio de tiempo que se tardan en completar un mapeo(avgTimeCompletionPerMap) y por mes la cantidad de mapas completados (completedAMSMaps).

 2. Name: Map Table
 Type: POST
 URI Deploy: https://apidash2.herokuapp.com/maps/table/{initialDate}/{finishDate}

 Body: "{""countries"": [],
  ""cities"":[],
    filter"": """"}"

Body description: Como body recibe los parámetros de los filtros, en country recibe las ciudades a filtrar dentro del arreglo de igual manera en cities un arreglo con todas las ciudades a filtrar, y el filter una palabra clave ya sea complete o non-complete para el filtro de completados o no.

Response: "Status: 200, JSON: {
                ""id"": ""1g1J1JToZrbJaxwJSHOb8yVDjyo1_1641838464537"",
                ""placeName"": ""Ambassador Chicago"",
                ""city"": ""Chicago, United States"",
                ""progress"": 100
        },..."

Description: Obtiene la información de todos los accomodations, afectados por la fecha (:initialDate y :finishDate), el body que recibe se puede decir que es una form de los filtros aplicados.


3. Name: Map Detail
Type: Get

URI Deploy: https://apidash2.herokuapp.com/maps/detail/{accomodation_uid}

Response: "Status 200, JSON: {
	""mapper"": {
		""idMapper"": 170,
		""name"": ""Candace"",
		""lastname"": ""Laouenan"",
		""photo"": ""No information""
	},
	""accomodation"": {
		""nameHotel"": ""Nobu Hotel Miami Beach"",
		""type"": ""Hotel"",
		""address"": ""4525 Collins Ave, Miami Beach, FL 33140, USA""
	},
	""progress"": {
		""completedpercentage"": 49,
		""created"": ""2022-04-14T00:31:05.000Z"",
		""duration"": 1,
		""lastUpdate"": ""2022-04-14T21:44:44.000Z""
	},
	""progressAreas"": [
		{
			""name"": ""building_entrance"",
			""process"": 95
		},
		{
			""name"": ""elevator"",
			""process"": 98
		},
		{
			""name"": ""general_attributes"",
			""process"": 47
		},
		{
			""name"": ""lobby"",
			""process"": 53
		},
		{
			""name"": ""rooms"",
			""process"": 0
		}
	],
	""photos"": [
		{
			""inquiry_id"": ""beachfront"",
			""cant"": 0
		},
		{
			""inquiry_id"": ""building_entrance"",
			""cant"": 5
		},
		{
			""inquiry_id"": ""common_area_toilet"",
			""cant"": 0
		},
		{
			""inquiry_id"": ""elevator"",
			""cant"": 0
		},
		{
			""inquiry_id"": ""fitness_center"",
			""cant"": 0
		},
		{
			""inquiry_id"": ""foodservice"",
			""cant"": 0
		},
		{
			""inquiry_id"": ""general_attributes"",
			""cant"": 0
		},
		{
			""inquiry_id"": ""lobby"",
			""cant"": 10
		},
		{
			""inquiry_id"": ""other_areas"",
			""cant"": 0
		},
		{
			""inquiry_id"": ""swimming_pool"",
			""cant"": 11
		}
	]
}"

Description: Obtiene información detallada de un accomodation en espécifico, tal cual como el mapper que lo mapeo, el tiempo de mapeo esto incluye la fecha de inicio, la fecha de termino o last update, y la cantidad de días que se tardo, así como el progreso de las áres y la cantidad de fotos en las áreas, a esta uri se le passa el accomodation_uid, que vendria siendo el identificador de un accomodation

4. Name: mappers overview
Type: Get

URI Deploy: https://apidash2.herokuapp.com/mappers/overview?:maps?:nombre?:apellido?:order?:page?

Response: "Status: 200, JSON: [
    {
        ""name"": {
            ""id"": 256,
            ""name"": ""Annerys"",
            ""lname"": ""Rivas"",
            ""photo"": ""https://lh3.googleusercontent.com/a-/AOh14GhRQedMjChkNHb3acJKaZt0W-ka4LWtmmCy5Ogl=s96-c""
        },
        ""maps"": {
            ""done"": 1,
            ""progress"": 0
        },
        ""contact"": ""annerys@gowheeltheworld.com""
    }, ..."

Description: Obtiene la lista completa de los mappers, en este caso, los filtros vienen en la URI, como nombre, apellido, el orden y la cantidad de paginas, el ejemplo es los datos que vienen para cada mapper en la lista.

5. Name: Mapper details
Type: GET

URI Deploy: https://apidash2.herokuapp.com/mappers/details/{id}

Response: "Status:200, JSON : {
    ""name"": {
        ""name"": ""Tanja"",
        ""lname"": ""Sentefol"",
        ""photo"": null
    },
    ""contributions"": {
        ""total"": 0,
        ""WTWcontributions"": ""Pending"",
        ""inprogress"": 1,
        ""averageTime"": null
    },
    ""replies"": {
        ""lastReply"": {
            ""day"": ""11"",
            ""month"": ""05"",
            ""year"": ""2022"",
            ""hour"": ""10:02:40""
        },
        ""lastCompletedArea"": {
            ""Area"": ""building_entrance"",
            ""location"": {
                ""name"": ""Tenbergen Pension"",
                ""location"": {
                    ""city"": ""Windhoek"",
                    ""country"": ""Namibia""
                }
            }
        }
    }
}"

Description: El {id} es reemplazado por el id que tiene un mapper, con esto la API nos regresara la información específica de un mapper, asi como sus contrubuciones, la ultima vez que contesto algo, la ultima área mapeada, y lo más improtante, sus contribuciones pendientes y en procceso.

6. Name: Mapper Contributions
Type: POST

URI Deploy: https://apidash2.herokuapp.com/mappers/contributions/{id}

Body: "{""countries"": [""Mexico"",""France"", ""United States""],
  ""cities"":[""""],
    filter"": ""complete""}"

Body description: Como body recibe los parámetros de los filtros, en country recibe las ciudades a filtrar dentro del arreglo de igual manera en cities un arreglo con todas las ciudades a filtrar, y el filter una palabra clave ya sea complete o non-complete para el filtro de completados o no.

Response: "Status 200, JSON: [
    {
        ""id"": ""CZ3qPFVV7qdlwqTpSSiRINgF14K3_1639426450208"",
        ""placeName"": ""Crowne Plaza Englewood, an IHG Hotel"",
        ""city"": ""undefined, United States"",
        ""progress"": 100
    },
    {
        ""id"": ""CZ3qPFVV7qdlwqTpSSiRINgF14K3_1641149537492"",
        ""placeName"": ""Homewood Suites by Hilton Hamilton Township"",
        ""city"": ""undefined, United States"",
        ""progress"": 100
    }
    ...
]"

Description: Obtiene la información de todos los accomodations que fueron mapeados por el mapper dado el id de un mapper {id} el body que recibe se puede decir que es una form de los filtros aplicados.

7.- Name: Filter countries
Type: GET

URI Deploy: https://apidash2.herokuapp.com/mappers/countries

Response: "Status 200, JSON: {
    ""cities"": [
        ""Aberdeen"",
        ""Alpharetta"",
        ""Altamonte Springs"",
        ""Anaheim"",
        ""Arlin",
        ...
    ],
    ""countries"": [
        ""Afghanistan"",
        ""Andorra"",
        ""Argentina"",
        ""Australia"",
        ""Bahrain"",
        ""Belgium"",
        ""United Kingdom"",
        ""United States"",
        ...
    ]
}

Description: Obtiene las ciudades y los paises que se encuentran en la base de datos, los cuales son utilizados para la información de los filtros.


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
You can also see our demo live! Just click in this link:
[https://wtwdashboard.netlify.app/](url)


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

