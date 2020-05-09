const router = require('express').Router({});
const protocol = require('../../utils/connection');
const {createEnvelope} = require("./utils");

router.all("/new", (req, res) => {
    const base = protocol(req) + "://" + req.get('host');

    res.json(createEnvelope(0, "OK", "AccountPayload", {
        "LoginId": 207,
        "RestURL": base + "/powiatwulkanowy/",
        "UserLogin": "jan@fakelog.cf",
        "UserName": "jan@fakelog.cf"
    }));
});

router.all("/hebe", (req, res) => {
    res.json(createEnvelope(0, "OK", "IEnumerable`1", [
        {
            "Capabilities": [
                "REGULAR",
                "AVG_ENABLED",
                "TOPICS_ENABLED",
                "LUCKY_NUMBERS",
                "ADDRESS_BOOK_PUPIL"
            ],
            "ClassDisplay": "8b",
            "ConstituentUnit": {
                "Address": "ul. Wulkanowego 30, 30-300 Fakelog.cf, Polska",
                "Id": 2,
                "Name": "Publiczna szkoła Wulkanowego nr 1 w fakelog.cf",
                "Patron": "Święty Wulkan",
                "SchoolTopic": "12f446f1-1751-1711-10e1-101dd8b71c11",
                "Short": "SPL"
            },
            "Educators": [
                {
                    "Id": "e-222",
                    "Initials": "MK",
                    "LoginId": 222,
                    "Name": "Maria",
                    "Surname": "Kowalska",
                    "Roles": [
                        {
                            "Address": "Kowalska Maria [KM] - wychowawca 8b (SPL)",
                            "AddressHash": "ndghrsawrtb045a0a4cfa7bf6ea0e9d380a6b5sd",
                            "ClassSymbol": "8b (SPL)",
                            "ConstituentUnitSymbol": "SPL",
                            "Initials": "KM",
                            "Name": "Maria",
                            "RoleName": "Wychowawca",
                            "RoleOrder": 0,
                            "Surname": "Kowalsk",
                            "UnitSymbol": null
                        }
                    ]
                }
            ],
            "FullSync": false,
            "InfoDisplay": "123456 - b8",
            "Journal": {
                "Id": 33,
                "YearEnd": {
                    "Date": "2020-08-31",
                    "DateDisplay": "31.08.2020",
                    "Time": "00:00:00",
                    "Timestamp": 1598824800000
                },
                "YearStart": {
                    "Date": "2019-09-01",
                    "DateDisplay": "01.09.2019",
                    "Time": "00:00:00",
                    "Timestamp": 1567288800000
                }
            },
            "Login": {
                "DisplayName": "Jan Kowalski",
                "FirstName": "Jan",
                "Id": 11,
                "LoginRole": "Uczen",
                "SecondName": "",
                "Surname": "Kowalski",
                "Value": "jan@fakelog.cf"
            },
            "Partition": "powiatwulkanowy-123456",
            "Periods": [
                {
                    "Current": false,
                    "End": {
                        "Date": "2018-01-21",
                        "DateDisplay": "21.01.2018",
                        "Time": "00:00:00",
                        "Timestamp": 1516489200000
                    },
                    "Id": 97,
                    "Last": false,
                    "Level": 6,
                    "Number": 1,
                    "Start": {
                        "Date": "2017-09-01",
                        "DateDisplay": "01.09.2017",
                        "Time": "00:00:00",
                        "Timestamp": 1504216800000
                    }
                },
                {
                    "Current": false,
                    "End": {
                        "Date": "2018-08-31",
                        "DateDisplay": "31.08.2018",
                        "Time": "00:00:00",
                        "Timestamp": 1535666400000
                    },
                    "Id": 98,
                    "Last": true,
                    "Level": 6,
                    "Number": 2,
                    "Start": {
                        "Date": "2018-01-22",
                        "DateDisplay": "22.01.2018",
                        "Time": "00:00:00",
                        "Timestamp": 1516575600000
                    }
                },
                {
                    "Current": false,
                    "End": {
                        "Date": "2019-01-27",
                        "DateDisplay": "27.01.2019",
                        "Time": "00:00:00",
                        "Timestamp": 1548543600000
                    },
                    "Id": 99,
                    "Last": false,
                    "Level": 7,
                    "Number": 1,
                    "Start": {
                        "Date": "2018-09-01",
                        "DateDisplay": "01.09.2018",
                        "Time": "00:00:00",
                        "Timestamp": 1535752800000
                    }
                },
                {
                    "Current": false,
                    "End": {
                        "Date": "2019-08-31",
                        "DateDisplay": "31.08.2019",
                        "Time": "00:00:00",
                        "Timestamp": 1567202400000
                    },
                    "Id": 100,
                    "Last": true,
                    "Level": 7,
                    "Number": 2,
                    "Start": {
                        "Date": "2019-01-28",
                        "DateDisplay": "28.01.2019",
                        "Time": "00:00:00",
                        "Timestamp": 1548630000000
                    }
                },
                {
                    "Current": false,
                    "End": {
                        "Date": "2020-02-09",
                        "DateDisplay": "09.02.2020",
                        "Time": "00:00:00",
                        "Timestamp": 1581202800000
                    },
                    "Id": 101,
                    "Last": false,
                    "Level": 8,
                    "Number": 1,
                    "Start": {
                        "Date": "2019-09-01",
                        "DateDisplay": "01.09.2019",
                        "Time": "00:00:00",
                        "Timestamp": 1567288800000
                    }
                },
                {
                    "Current": true,
                    "End": {
                        "Date": "2020-08-31",
                        "DateDisplay": "31.08.2020",
                        "Time": "00:00:00",
                        "Timestamp": 1598824800000
                    },
                    "Id": 102,
                    "Last": true,
                    "Level": 8,
                    "Number": 2,
                    "Start": {
                        "Date": "2020-02-10",
                        "DateDisplay": "10.02.2020",
                        "Time": "00:00:00",
                        "Timestamp": 1581289200000
                    }
                }
            ],
            "Pupil": {
                "FirstName": "Jan",
                "Id": 111,
                "LoginId": 11,
                "LoginValue": "jan@fakelog.cf",
                "SecondName": "",
                "Sex": true,
                "Surname": "Kowalski"
            },
            "SenderEntry": {
                "Address": "Jan Kowalski - uczeń 8b (SPL)",
                "AddressHash": "1234567890e676ea0c01114dc2fb610987654321",
                "Initials": "JK",
                "LoginId": 111
            },
            "TopLevelPartition": "powiatwulkanowy",
            "Unit": {
                "Address": "ul. Wulkanowego 30, 30-300 Fakelog.cf, Polska",
                "DisplayName": "Publiczna szkoła Wulkanowego nr 1 w fakelog.",
                "Id": 2,
                "Name": "Publiczna szkoła Wulkanowego",
                "Patron": "Święty Wulkan",
                "RestURL": "https://api.fakelog.cf/powiatwulkanowy/123456/api",
                "Short": "123456",
                "Symbol": "123456"
            }
        }
    ]));
});

module.exports = router;
