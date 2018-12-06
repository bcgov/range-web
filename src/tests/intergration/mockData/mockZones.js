const mockZones = [
  {
      "id": 62,
      "code": "BELL",
      "description": "Please update contact",
      "districtId": 22,
      "userId": null,
      "district": {
          "id": 22,
          "code": "DNI",
          "description": ""
      },
      "user": null
  },
  {
      "id": 64,
      "code": "ELLY",
      "description": "No description available",
      "districtId": 11,
      "userId": null,
      "district": {
          "id": 11,
          "code": "DMH",
          "description": ""
      },
      "user": null
  },
  {
      "id": 65,
      "code": "WFRA",
      "description": "No description available",
      "districtId": 13,
      "userId": null,
      "district": {
          "id": 13,
          "code": "DQU",
          "description": ""
      },
      "user": null
  },
  {
      "id": 66,
      "code": "1",
      "description": "No description available",
      "districtId": 3,
      "userId": null,
      "district": {
          "id": 3,
          "code": "DRM",
          "description": ""
      },
      "user": null
  },
  {
      "id": 2,
      "code": "HORS",
      "description": "Horsefly Livestock Assoc",
      "districtId": 1,
      "userId": 10,
      "district": {
          "id": 1,
          "code": "DCC",
          "description": ""
      },
      "user": {
          "id": 10,
          "username": "idir\\tnairn",
          "clientId": null,
          "givenName": "Trish",
          "familyName": "Nairn",
          "email": "trish.nairn@gov.bc.ca",
          "phoneNumber": "250-398-4242",
          "active": true,
          "lastLoginAt": "2018-11-22T23:10:58.284Z"
      }
  },
  {
      "id": 3,
      "code": "150M",
      "description": "150 Mile Livestock Assoc",
      "districtId": 1,
      "userId": 10,
      "district": {
          "id": 1,
          "code": "DCC",
          "description": ""
      },
      "user": {
          "id": 10,
          "username": "idir\\tnairn",
          "clientId": null,
          "givenName": "Trish",
          "familyName": "Nairn",
          "email": "trish.nairn@gov.bc.ca",
          "phoneNumber": "250-398-4242",
          "active": true,
          "lastLoginAt": "2018-11-22T23:10:58.284Z"
      }
  },
  {
      "id": 7,
      "code": "BELL",
      "description": "Bella Coola Area",
      "districtId": 1,
      "userId": 11,
      "district": {
          "id": 1,
          "code": "DCC",
          "description": ""
      },
      "user": {
          "id": 11,
          "username": "idir\\lujones",
          "clientId": null,
          "givenName": "Lucy",
          "familyName": "Jones",
          "email": "lucy.jones@gov.bc.ca",
          "phoneNumber": "250-394-4703",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 8,
      "code": "BIGC",
      "description": "Big Creek Livestock Assoc",
      "districtId": 1,
      "userId": 12,
      "district": {
          "id": 1,
          "code": "DCC",
          "description": ""
      },
      "user": {
          "id": 12,
          "username": "idir\\carmes",
          "clientId": null,
          "givenName": "Chris",
          "familyName": "Armes",
          "email": "chris.armes@gov.bc.ca",
          "phoneNumber": "250-398-4362",
          "active": true,
          "lastLoginAt": "2018-11-28T17:12:58.723Z"
      }
  },
  {
      "id": 9,
      "code": "TATL",
      "description": "Tatla Lake Livestock Assoc.",
      "districtId": 1,
      "userId": 11,
      "district": {
          "id": 1,
          "code": "DCC",
          "description": ""
      },
      "user": {
          "id": 11,
          "username": "idir\\lujones",
          "clientId": null,
          "givenName": "Lucy",
          "familyName": "Jones",
          "email": "lucy.jones@gov.bc.ca",
          "phoneNumber": "250-394-4703",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 10,
      "code": "ANAH",
      "description": "Anahim Lake Livestock Assoc.",
      "districtId": 1,
      "userId": 11,
      "district": {
          "id": 1,
          "code": "DCC",
          "description": ""
      },
      "user": {
          "id": 11,
          "username": "idir\\lujones",
          "clientId": null,
          "givenName": "Lucy",
          "familyName": "Jones",
          "email": "lucy.jones@gov.bc.ca",
          "phoneNumber": "250-394-4703",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 11,
      "code": "CHIL",
      "description": "Chilcotin Livestock Assoc",
      "districtId": 1,
      "userId": 11,
      "district": {
          "id": 1,
          "code": "DCC",
          "description": ""
      },
      "user": {
          "id": 11,
          "username": "idir\\lujones",
          "clientId": null,
          "givenName": "Lucy",
          "familyName": "Jones",
          "email": "lucy.jones@gov.bc.ca",
          "phoneNumber": "250-394-4703",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 6,
      "code": "BEAV",
      "description": "Big and Beaver Livestock",
      "districtId": 1,
      "userId": 13,
      "district": {
          "id": 1,
          "code": "DCC",
          "description": ""
      },
      "user": {
          "id": 13,
          "username": "idir\\kjames",
          "clientId": null,
          "givenName": "Kassia",
          "familyName": "James",
          "email": "kassia.james@gov.bc.ca",
          "phoneNumber": "250-398-4364",
          "active": true,
          "lastLoginAt": "2018-11-27T18:24:25.960Z"
      }
  },
  {
      "id": 1,
      "code": "CHIM",
      "description": "Chimney Creek Livestock Assoc",
      "districtId": 1,
      "userId": 13,
      "district": {
          "id": 1,
          "code": "DCC",
          "description": ""
      },
      "user": {
          "id": 13,
          "username": "idir\\kjames",
          "clientId": null,
          "givenName": "Kassia",
          "familyName": "James",
          "email": "kassia.james@gov.bc.ca",
          "phoneNumber": "250-398-4364",
          "active": true,
          "lastLoginAt": "2018-11-27T18:24:25.960Z"
      }
  },
  {
      "id": 12,
      "code": "SODA",
      "description": "Soda Creek Livestock Assoc",
      "districtId": 1,
      "userId": 13,
      "district": {
          "id": 1,
          "code": "DCC",
          "description": ""
      },
      "user": {
          "id": 13,
          "username": "idir\\kjames",
          "clientId": null,
          "givenName": "Kassia",
          "familyName": "James",
          "email": "kassia.james@gov.bc.ca",
          "phoneNumber": "250-398-4364",
          "active": true,
          "lastLoginAt": "2018-11-27T18:24:25.960Z"
      }
  },
  {
      "id": 5,
      "code": "RISK",
      "description": "Riske Creek Livestock Assoc",
      "districtId": 1,
      "userId": 14,
      "district": {
          "id": 1,
          "code": "DCC",
          "description": ""
      },
      "user": {
          "id": 14,
          "username": "idir\\momuelle",
          "clientId": null,
          "givenName": "Morgan",
          "familyName": "Mueller",
          "email": "morgan.mueller@gov.bc.ca",
          "phoneNumber": "250-398-4364",
          "active": true,
          "lastLoginAt": "2018-11-22T18:15:13.515Z"
      }
  },
  {
      "id": 13,
      "code": "BULK",
      "description": "Bulkley",
      "districtId": 2,
      "userId": 15,
      "district": {
          "id": 2,
          "code": "DSS",
          "description": ""
      },
      "user": {
          "id": 15,
          "username": "idir\\maschuff",
          "clientId": null,
          "givenName": "Marc",
          "familyName": "Schuffert",
          "email": "marc.schuffert@gov.bc.ca",
          "phoneNumber": "250-847-6329",
          "active": true,
          "lastLoginAt": "2018-12-03T21:51:24.751Z"
      }
  },
  {
      "id": 14,
      "code": "KISP",
      "description": "Kispiox",
      "districtId": 2,
      "userId": 15,
      "district": {
          "id": 2,
          "code": "DSS",
          "description": ""
      },
      "user": {
          "id": 15,
          "username": "idir\\maschuff",
          "clientId": null,
          "givenName": "Marc",
          "familyName": "Schuffert",
          "email": "marc.schuffert@gov.bc.ca",
          "phoneNumber": "250-847-6329",
          "active": true,
          "lastLoginAt": "2018-12-03T21:51:24.751Z"
      }
  },
  {
      "id": 15,
      "code": "CASS",
      "description": "Cassiar",
      "districtId": 2,
      "userId": 15,
      "district": {
          "id": 2,
          "code": "DSS",
          "description": ""
      },
      "user": {
          "id": 15,
          "username": "idir\\maschuff",
          "clientId": null,
          "givenName": "Marc",
          "familyName": "Schuffert",
          "email": "marc.schuffert@gov.bc.ca",
          "phoneNumber": "250-847-6329",
          "active": true,
          "lastLoginAt": "2018-12-03T21:51:24.751Z"
      }
  },
  {
      "id": 21,
      "code": "GRAS",
      "description": "Grasmere",
      "districtId": 3,
      "userId": 16,
      "district": {
          "id": 3,
          "code": "DRM",
          "description": ""
      },
      "user": {
          "id": 16,
          "username": "idir\\hmcintyr",
          "clientId": null,
          "givenName": "Hanna",
          "familyName": "McIntyre",
          "email": "hanna.mcintyre@gov.bc.ca",
          "phoneNumber": "250-489-8548",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 22,
      "code": "MER1",
      "description": "Merritt Zone",
      "districtId": 4,
      "userId": 17,
      "district": {
          "id": 4,
          "code": "DCS",
          "description": ""
      },
      "user": {
          "id": 17,
          "username": "idir\\cahaywoo",
          "clientId": null,
          "givenName": "Cara",
          "familyName": "Haywood-Farmer",
          "email": "cara.haywood-farmer@gov.bc.ca",
          "phoneNumber": "250-378-8404",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 23,
      "code": "MER2",
      "description": "Merritt Zone",
      "districtId": 4,
      "userId": 18,
      "district": {
          "id": 4,
          "code": "DCS",
          "description": ""
      },
      "user": {
          "id": 18,
          "username": "idir\\pgyug",
          "clientId": null,
          "givenName": "Philip",
          "familyName": "Gyug",
          "email": "philip.gyug@gov.bc.ca",
          "phoneNumber": "250-378-8476",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 24,
      "code": "MER3",
      "description": "Merritt Zone",
      "districtId": 4,
      "userId": 19,
      "district": {
          "id": 4,
          "code": "DCS",
          "description": ""
      },
      "user": {
          "id": 19,
          "username": "idir\\rawhiteh",
          "clientId": null,
          "givenName": "Rachel",
          "familyName": "Whitehouse",
          "email": "rachel.whitehouse@gov.bc.ca",
          "phoneNumber": "250-378-8406",
          "active": true,
          "lastLoginAt": "2018-11-21T20:51:06.127Z"
      }
  },
  {
      "id": 25,
      "code": "PRIN",
      "description": "Princeton Zone",
      "districtId": 4,
      "userId": 18,
      "district": {
          "id": 4,
          "code": "DCS",
          "description": ""
      },
      "user": {
          "id": 18,
          "username": "idir\\pgyug",
          "clientId": null,
          "givenName": "Philip",
          "familyName": "Gyug",
          "email": "philip.gyug@gov.bc.ca",
          "phoneNumber": "250-378-8476",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 26,
      "code": "LILL",
      "description": "Lillooet Zone",
      "districtId": 4,
      "userId": 20,
      "district": {
          "id": 4,
          "code": "DCS",
          "description": ""
      },
      "user": {
          "id": 20,
          "username": "idir\\rmctavis",
          "clientId": null,
          "givenName": "Ried",
          "familyName": "McTavish",
          "email": "ried.mctavish@gov.bc.ca",
          "phoneNumber": "250-378-8487",
          "active": true,
          "lastLoginAt": "2018-12-05T00:02:13.135Z"
      }
  },
  {
      "id": 27,
      "code": "CHWK",
      "description": "Chilliwack",
      "districtId": 5,
      "userId": 21,
      "district": {
          "id": 5,
          "code": "DCK",
          "description": ""
      },
      "user": {
          "id": 21,
          "username": "idir\\rgarciad",
          "clientId": null,
          "givenName": "Rene",
          "familyName": "Garcia-Daguer",
          "email": "rene.garciadaguer@gov.bc.ca",
          "phoneNumber": "250-378-8477",
          "active": true,
          "lastLoginAt": "2018-11-27T21:25:03.790Z"
      }
  },
  {
      "id": 28,
      "code": "SQUA",
      "description": "Squamish",
      "districtId": 6,
      "userId": 21,
      "district": {
          "id": 6,
          "code": "DSQ",
          "description": ""
      },
      "user": {
          "id": 21,
          "username": "idir\\rgarciad",
          "clientId": null,
          "givenName": "Rene",
          "familyName": "Garcia-Daguer",
          "email": "rene.garciadaguer@gov.bc.ca",
          "phoneNumber": "250-378-8477",
          "active": true,
          "lastLoginAt": "2018-11-27T21:25:03.790Z"
      }
  },
  {
      "id": 49,
      "code": "ALL",
      "description": "Selkirk",
      "districtId": 7,
      "userId": 22,
      "district": {
          "id": 7,
          "code": "DSE",
          "description": ""
      },
      "user": {
          "id": 22,
          "username": "idir\\asiemen",
          "clientId": null,
          "givenName": "Alisa",
          "familyName": "Siemens",
          "email": "alisa.siemens@gov.bc.ca",
          "phoneNumber": "250-442-5426",
          "active": true,
          "lastLoginAt": "2018-11-28T17:31:12.827Z"
      }
  },
  {
      "id": 29,
      "code": "PRIN",
      "description": "Prince George",
      "districtId": 8,
      "userId": 23,
      "district": {
          "id": 8,
          "code": "DPG",
          "description": ""
      },
      "user": {
          "id": 23,
          "username": "idir\\tgrafton",
          "clientId": null,
          "givenName": "Taylor",
          "familyName": "Grafton",
          "email": "taylor.grafton@gov.bc.ca",
          "phoneNumber": "250-614-7427",
          "active": true,
          "lastLoginAt": "2018-11-22T00:15:10.036Z"
      }
  },
  {
      "id": 30,
      "code": "HIXN",
      "description": "Hixon",
      "districtId": 8,
      "userId": 23,
      "district": {
          "id": 8,
          "code": "DPG",
          "description": ""
      },
      "user": {
          "id": 23,
          "username": "idir\\tgrafton",
          "clientId": null,
          "givenName": "Taylor",
          "familyName": "Grafton",
          "email": "taylor.grafton@gov.bc.ca",
          "phoneNumber": "250-614-7427",
          "active": true,
          "lastLoginAt": "2018-11-22T00:15:10.036Z"
      }
  },
  {
      "id": 32,
      "code": "NPC",
      "description": "North Peace",
      "districtId": 21,
      "userId": 24,
      "district": {
          "id": 21,
          "code": "DPC",
          "description": ""
      },
      "user": {
          "id": 24,
          "username": "idir\\mkc",
          "clientId": null,
          "givenName": "Mahesh",
          "familyName": "Kc",
          "email": "mahesh.kc@gov.bc.ca",
          "phoneNumber": "250-784-1200",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 33,
      "code": "SPC",
      "description": "South Peace",
      "districtId": 21,
      "userId": 25,
      "district": {
          "id": 21,
          "code": "DPC",
          "description": ""
      },
      "user": {
          "id": 25,
          "username": "idir\\marcamer",
          "clientId": null,
          "givenName": "Marika",
          "familyName": "Cameron",
          "email": "marika.cameron@gov.bc.ca",
          "phoneNumber": "250-784-1293",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 34,
      "code": "FTN",
      "description": "Fort Nelson",
      "districtId": 10,
      "userId": 24,
      "district": {
          "id": 10,
          "code": "DFN",
          "description": ""
      },
      "user": {
          "id": 24,
          "username": "idir\\mkc",
          "clientId": null,
          "givenName": "Mahesh",
          "familyName": "Kc",
          "email": "mahesh.kc@gov.bc.ca",
          "phoneNumber": "250-784-1200",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 35,
      "code": "CLIN",
      "description": "Clinton and District Association",
      "districtId": 11,
      "userId": 26,
      "district": {
          "id": 11,
          "code": "DMH",
          "description": ""
      },
      "user": {
          "id": 26,
          "username": "idir\\ebasset",
          "clientId": null,
          "givenName": "Eleanor",
          "familyName": "Bassett",
          "email": "eleanor.bassett@gov.bc.ca",
          "phoneNumber": "250-395-7874",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 36,
      "code": "LLH",
      "description": "Lac La Hache Livestock Association",
      "districtId": 11,
      "userId": 27,
      "district": {
          "id": 11,
          "code": "DMH",
          "description": ""
      },
      "user": {
          "id": 27,
          "username": "idir\\dilbrown",
          "clientId": null,
          "givenName": "Diane",
          "familyName": "Brown",
          "email": "diane.l.brown@gov.bc.ca",
          "phoneNumber": "250-395-7815",
          "active": true,
          "lastLoginAt": "2018-11-22T19:46:50.420Z"
      }
  },
  {
      "id": 37,
      "code": "LONE",
      "description": "Lone Butte Farmer's Institute",
      "districtId": 11,
      "userId": 27,
      "district": {
          "id": 11,
          "code": "DMH",
          "description": ""
      },
      "user": {
          "id": 27,
          "username": "idir\\dilbrown",
          "clientId": null,
          "givenName": "Diane",
          "familyName": "Brown",
          "email": "diane.l.brown@gov.bc.ca",
          "phoneNumber": "250-395-7815",
          "active": true,
          "lastLoginAt": "2018-11-22T19:46:50.420Z"
      }
  },
  {
      "id": 42,
      "code": "LANO",
      "description": "Lakes TSA North of Francois Lake",
      "districtId": 12,
      "userId": 28,
      "district": {
          "id": 12,
          "code": "DND",
          "description": ""
      },
      "user": {
          "id": 28,
          "username": "idir\\kjchalme",
          "clientId": null,
          "givenName": "Ken",
          "familyName": "Chalmers",
          "email": "ken.chalmers@gov.bc.ca",
          "phoneNumber": "251-692-2238",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 43,
      "code": "LASO",
      "description": "Lakes TSA South of Francois Lake",
      "districtId": 12,
      "userId": 28,
      "district": {
          "id": 12,
          "code": "DND",
          "description": ""
      },
      "user": {
          "id": 28,
          "username": "idir\\kjchalme",
          "clientId": null,
          "givenName": "Ken",
          "familyName": "Chalmers",
          "email": "ken.chalmers@gov.bc.ca",
          "phoneNumber": "251-692-2238",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 45,
      "code": "WFA",
      "description": "West Fraser",
      "districtId": 13,
      "userId": 29,
      "district": {
          "id": 13,
          "code": "DQU",
          "description": ""
      },
      "user": {
          "id": 29,
          "username": "idir\\sllatin",
          "clientId": null,
          "givenName": "Sandra",
          "familyName": "Latin",
          "email": "sandra.latin@gov.bc.ca",
          "phoneNumber": "250-992-4482",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 46,
      "code": "EFA",
      "description": "East Fraser",
      "districtId": 13,
      "userId": 30,
      "district": {
          "id": 13,
          "code": "DQU",
          "description": ""
      },
      "user": {
          "id": 30,
          "username": "idir\\tsinger",
          "clientId": null,
          "givenName": "Tim",
          "familyName": "Singer",
          "email": "tim.singer@gov.bc.ca",
          "phoneNumber": "250-992-4415",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 47,
      "code": "HAID",
      "description": "Haida Gwaii District",
      "districtId": 14,
      "userId": 31,
      "district": {
          "id": 14,
          "code": "DQC",
          "description": ""
      },
      "user": {
          "id": 31,
          "username": "idir\\msalzl",
          "clientId": null,
          "givenName": "Mark",
          "familyName": "Salzl",
          "email": "mark.salzl@gov.bc.ca",
          "phoneNumber": "250-559-6206",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 63,
      "code": "DOS1",
      "description": "Southwest Centralwest",
      "districtId": 15,
      "userId": 32,
      "district": {
          "id": 15,
          "code": "DOS",
          "description": ""
      },
      "user": {
          "id": 32,
          "username": "idir\\kwitt",
          "clientId": null,
          "givenName": "Kyra",
          "familyName": "Witt",
          "email": "kyra.witt@gov.bc.ca",
          "phoneNumber": "250-550-2244",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 58,
      "code": "DOS2",
      "description": "Centraleast",
      "districtId": 15,
      "userId": 33,
      "district": {
          "id": 15,
          "code": "DOS",
          "description": ""
      },
      "user": {
          "id": 33,
          "username": "idir\\smort",
          "clientId": null,
          "givenName": "Sarah",
          "familyName": "Mortenson",
          "email": "sarah.mortenson@gov.bc.ca",
          "phoneNumber": "250-550-2214",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 56,
      "code": "DOS3",
      "description": "Southwest Northeast",
      "districtId": 15,
      "userId": 34,
      "district": {
          "id": 15,
          "code": "DOS",
          "description": ""
      },
      "user": {
          "id": 34,
          "username": "idir\\hhethering",
          "clientId": null,
          "givenName": "Harold",
          "familyName": "Hetherington",
          "email": "harold.hetherington@gov.bc.ca",
          "phoneNumber": "250-260-4605",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 57,
      "code": "DOS4",
      "description": "Southeast Northeast",
      "districtId": 15,
      "userId": 35,
      "district": {
          "id": 15,
          "code": "DOS",
          "description": ""
      },
      "user": {
          "id": 35,
          "username": "idir\\coduro",
          "clientId": null,
          "givenName": "Charles",
          "familyName": "Oduro",
          "email": "charles.oduro@gov.bc.ca",
          "phoneNumber": "250-260-4614",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 48,
      "code": "SAYW",
      "description": "Campbell River",
      "districtId": 16,
      "userId": 36,
      "district": {
          "id": 16,
          "code": "DCR",
          "description": ""
      },
      "user": {
          "id": 36,
          "username": "idir\\amsmeeth",
          "clientId": null,
          "givenName": "Aaron",
          "familyName": "Smeeth",
          "email": "aaron.smeeth@gov.bc.ca",
          "phoneNumber": "778-647-2002",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 55,
      "code": "KAMA",
      "description": "Kamloops Zone A",
      "districtId": 20,
      "userId": 38,
      "district": {
          "id": 20,
          "code": "DKA",
          "description": ""
      },
      "user": {
          "id": 38,
          "username": "idir\\kbarton",
          "clientId": null,
          "givenName": "Krista",
          "familyName": "Barton",
          "email": "krista.barton@gov.bc.ca",
          "phoneNumber": "250-371-6549",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 54,
      "code": "KAMB",
      "description": "Kamloops Zone B",
      "districtId": 20,
      "userId": 39,
      "district": {
          "id": 20,
          "code": "DKA",
          "description": ""
      },
      "user": {
          "id": 39,
          "username": "idir\\bwheatle",
          "clientId": null,
          "givenName": "Barb",
          "familyName": "Wheatley",
          "email": "barb.wheatley@gov.bc.ca",
          "phoneNumber": "250-371-6500",
          "active": true,
          "lastLoginAt": "2018-11-28T22:13:24.387Z"
      }
  },
  {
      "id": 53,
      "code": "KAMC",
      "description": "Kamloops Zone C",
      "districtId": 20,
      "userId": 40,
      "district": {
          "id": 20,
          "code": "DKA",
          "description": ""
      },
      "user": {
          "id": 40,
          "username": "idir\\avolo",
          "clientId": null,
          "givenName": "Andrew",
          "familyName": "Volo",
          "email": "andrew.volo@gov.bc.ca",
          "phoneNumber": "250-371-6222",
          "active": true,
          "lastLoginAt": "2018-11-28T17:51:15.953Z"
      }
  },
  {
      "id": 60,
      "code": "KAMD",
      "description": "Kamloops Zone D",
      "districtId": 20,
      "userId": 41,
      "district": {
          "id": 20,
          "code": "DKA",
          "description": ""
      },
      "user": {
          "id": 41,
          "username": "idir\\zoesimon",
          "clientId": null,
          "givenName": "Zoe",
          "familyName": "Simon",
          "email": "zoe.simon@gov.bc.ca",
          "phoneNumber": "250-371-6500",
          "active": true,
          "lastLoginAt": "2018-11-28T21:48:04.376Z"
      }
  },
  {
      "id": 61,
      "code": "ALLL",
      "description": "Sarah",
      "districtId": 7,
      "userId": 42,
      "district": {
          "id": 7,
          "code": "DSE",
          "description": ""
      },
      "user": {
          "id": 42,
          "username": "idir\\saschwar",
          "clientId": null,
          "givenName": "Sarah",
          "familyName": "Schwarz",
          "email": "sarah.schwarz@gov.bc.ca",
          "phoneNumber": "250-442-4386",
          "active": true,
          "lastLoginAt": "2018-12-04T19:32:29.909Z"
      }
  },
  {
      "id": 19,
      "code": "CONS",
      "description": "Conservation Properties",
      "districtId": 3,
      "userId": 43,
      "district": {
          "id": 3,
          "code": "DRM",
          "description": ""
      },
      "user": {
          "id": 43,
          "username": "idir\\slarade",
          "clientId": null,
          "givenName": "Shawna",
          "familyName": "Larade",
          "email": "shawna.larade@gov.bc.ca",
          "phoneNumber": "250-489-8555",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 20,
      "code": "GOFT",
      "description": "No description available",
      "districtId": 3,
      "userId": 43,
      "district": {
          "id": 3,
          "code": "DRM",
          "description": ""
      },
      "user": {
          "id": 43,
          "username": "idir\\slarade",
          "clientId": null,
          "givenName": "Shawna",
          "familyName": "Larade",
          "email": "shawna.larade@gov.bc.ca",
          "phoneNumber": "250-489-8555",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 16,
      "code": "NORT",
      "description": "North",
      "districtId": 3,
      "userId": 43,
      "district": {
          "id": 3,
          "code": "DRM",
          "description": ""
      },
      "user": {
          "id": 43,
          "username": "idir\\slarade",
          "clientId": null,
          "givenName": "Shawna",
          "familyName": "Larade",
          "email": "shawna.larade@gov.bc.ca",
          "phoneNumber": "250-489-8555",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 40,
      "code": "BRID",
      "description": "Bridge Lake Livestock Association",
      "districtId": 11,
      "userId": 44,
      "district": {
          "id": 11,
          "code": "DMH",
          "description": ""
      },
      "user": {
          "id": 44,
          "username": "idir\\keastwoo",
          "clientId": null,
          "givenName": "Kevin",
          "familyName": "Eastwood",
          "email": "kevin.eastwood@gov.bc.ca",
          "phoneNumber": "250-317-7849",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 38,
      "code": "CANI",
      "description": "Canim Lake Livestock Association",
      "districtId": 11,
      "userId": 44,
      "district": {
          "id": 11,
          "code": "DMH",
          "description": ""
      },
      "user": {
          "id": 44,
          "username": "idir\\keastwoo",
          "clientId": null,
          "givenName": "Kevin",
          "familyName": "Eastwood",
          "email": "kevin.eastwood@gov.bc.ca",
          "phoneNumber": "250-317-7849",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 39,
      "code": "GLNP",
      "description": "Green Lake North Bonaparte Association",
      "districtId": 11,
      "userId": 44,
      "district": {
          "id": 11,
          "code": "DMH",
          "description": ""
      },
      "user": {
          "id": 44,
          "username": "idir\\keastwoo",
          "clientId": null,
          "givenName": "Kevin",
          "familyName": "Eastwood",
          "email": "kevin.eastwood@gov.bc.ca",
          "phoneNumber": "250-317-7849",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 41,
      "code": "MAHO",
      "description": "Mahood Lake Livestock Asssociation",
      "districtId": 11,
      "userId": 44,
      "district": {
          "id": 11,
          "code": "DMH",
          "description": ""
      },
      "user": {
          "id": 44,
          "username": "idir\\keastwoo",
          "clientId": null,
          "givenName": "Kevin",
          "familyName": "Eastwood",
          "email": "kevin.eastwood@gov.bc.ca",
          "phoneNumber": "250-317-7849",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 44,
      "code": "MOR1",
      "description": "Morice TSA",
      "districtId": 12,
      "userId": 45,
      "district": {
          "id": 12,
          "code": "DND",
          "description": ""
      },
      "user": {
          "id": 45,
          "username": "idir\\jawoods",
          "clientId": null,
          "givenName": "Jane",
          "familyName": "Woods",
          "email": "jane.woods@gov.bc.ca",
          "phoneNumber": "250-847-6364",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 18,
      "code": "WEST",
      "description": "West",
      "districtId": 3,
      "userId": 50,
      "district": {
          "id": 3,
          "code": "DRM",
          "description": ""
      },
      "user": {
          "id": 50,
          "username": "idir\\cdumais",
          "clientId": null,
          "givenName": "Cardell",
          "familyName": "Dumais",
          "email": "cardell.dumais@gov.bc.ca",
          "phoneNumber": "250-371-6607",
          "active": true,
          "lastLoginAt": "2018-11-20T21:28:38.412Z"
      }
  },
  {
      "id": 17,
      "code": "EAST",
      "description": "East",
      "districtId": 3,
      "userId": 51,
      "district": {
          "id": 3,
          "code": "DRM",
          "description": ""
      },
      "user": {
          "id": 51,
          "username": "idir\\cfell",
          "clientId": null,
          "givenName": "Cynthia",
          "familyName": "Fell",
          "email": "cynthia.fell@gov.bc.ca",
          "phoneNumber": "250-398-4321",
          "active": true,
          "lastLoginAt": "2018-11-22T22:27:46.912Z"
      }
  },
  {
      "id": 31,
      "code": "MCBR",
      "description": "McBride",
      "districtId": 8,
      "userId": 48,
      "district": {
          "id": 8,
          "code": "DPG",
          "description": ""
      },
      "user": {
          "id": 48,
          "username": "idir\\dmbuis",
          "clientId": null,
          "givenName": "Drew",
          "familyName": "Buis",
          "email": "drew.buis@gov.bc.ca",
          "phoneNumber": "250-395-7895",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 4,
      "code": "ROSE",
      "description": "Rose Lake-Miocene Livestock",
      "districtId": 1,
      "userId": 46,
      "district": {
          "id": 1,
          "code": "DCC",
          "description": ""
      },
      "user": {
          "id": 46,
          "username": "idir\\carussel",
          "clientId": null,
          "givenName": "Caitlin",
          "familyName": "Russell",
          "email": "caitlin.russell@gov.bc.ca",
          "phoneNumber": "250-748-1275",
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 59,
      "code": "GLNB",
      "description": "No description available",
      "districtId": 11,
      "userId": 8,
      "district": {
          "id": 11,
          "code": "DMH",
          "description": ""
      },
      "user": {
          "id": 8,
          "username": "bceid\\myraah1",
          "clientId": null,
          "givenName": "Agreement Holder 1",
          "familyName": "Range",
          "email": "roop@freshworks.io",
          "phoneNumber": null,
          "active": true,
          "lastLoginAt": null
      }
  },
  {
      "id": 50,
      "code": "ALL",
      "description": "Vanderhoof",
      "districtId": 17,
      "userId": 1,
      "district": {
          "id": 17,
          "code": "DVA",
          "description": ""
      },
      "user": {
          "id": 1,
          "username": "rangestaff",
          "clientId": null,
          "givenName": "Range",
          "familyName": "Staff",
          "email": "amir+1@freshworks.io",
          "phoneNumber": null,
          "active": true,
          "lastLoginAt": "2018-12-03T20:18:22.840Z"
      }
  },
  {
      "id": 51,
      "code": "ALL",
      "description": "Fort St James",
      "districtId": 18,
      "userId": 1,
      "district": {
          "id": 18,
          "code": "DJA",
          "description": ""
      },
      "user": {
          "id": 1,
          "username": "rangestaff",
          "clientId": null,
          "givenName": "Range",
          "familyName": "Staff",
          "email": "amir+1@freshworks.io",
          "phoneNumber": null,
          "active": true,
          "lastLoginAt": "2018-12-03T20:18:22.840Z"
      }
  },
  {
      "id": 52,
      "code": "ALL",
      "description": "Mackenzie",
      "districtId": 19,
      "userId": 1,
      "district": {
          "id": 19,
          "code": "DMK",
          "description": ""
      },
      "user": {
          "id": 1,
          "username": "rangestaff",
          "clientId": null,
          "givenName": "Range",
          "familyName": "Staff",
          "email": "amir+1@freshworks.io",
          "phoneNumber": null,
          "active": true,
          "lastLoginAt": "2018-12-03T20:18:22.840Z"
      }
  }
];

export default mockZones;
