const express = require('express');
const router = express.Router();
const protocol = require('../utils/connection');
const md5 = require('md5');

router.get("/", (req, res) => {
    res.render("messages");
});

router.get("/-endpoints", (req, res) => {
    const base = protocol(req) + "://" + req.get('host') + "/powiatwulkanowy";
    res.json({
        status: "sucess",
        data: {
            endpoints: [
                "/Wiadomosc.mvc/GetWiadomosciOdebrane",
                "/Wiadomosc.mvc/GetWiadomosciWyslane",
                "/Wiadomosc.mvc/GetWiadomosciUsuniete",
                "/Adresaci.mvc/GetAdresaci",
                "/Wiadomosc.mvc/GetAdresaciWiadomosci",
                "/Wiadomosc.mvc/GetRoleUzytkownika",
                "/Wiadomosc.mvc/GetTrescWiadomosci",
                "/Wiadomosc.mvc/GetAdresaciNiePrzeczytaliWiadomosci",
                "/Wiadomosc.mvc/GetAdresaciPrzeczytaliWiadomosc",
                "/Wiadomosc.mvc/UsunWiadomosc",
                "/NowaWiadomosc.mvc/GetJednostkiUzytkownika",
                "/NowaWiadomosc.mvc/InsertWiadomosc"
            ].map(item => {
                return base + item;
            })
        }
    });
});

router.get("/Wiadomosc.mvc/GetWiadomosciOdebrane", (req, res) => {
    res.json({
        "success": true,
        "data": require("../../data/api/messages/WiadomosciOdebrane").map(item => {
            return {
                "Nieprzeczytana": !item.GodzinaPrzeczytania,
                "Data": new Date(item.DataWyslaniaUnixEpoch * 1000).toISOString(),
                "Tresc": null,
                "Temat": item.Tytul,
                "NadawcaNazwa": item.Nadawca,
                "IdWiadomosci": item.WiadomoscId,
                "IdNadawca": item.NadawcaId,
                "HasZalaczniki": true,
                "Id": item.WiadomoscId * 2
            };
        })
    });
});

router.get("/Wiadomosc.mvc/GetWiadomosciWyslane", (req, res) => {
    res.json({
        "success": true,
        "data": require("../../data/api/messages/WiadomosciWyslane").map(item => {
            return {
                "Data": new Date(item.DataWyslaniaUnixEpoch * 1000).toISOString(),
                "Temat": item.Tytul,
                "Adresaci": item.Adresaci[0].Nazwa,
                "Nieprzeczytane": parseInt(item.Nieprzeczytane, 10),
                "Przeczytane": parseInt(item.Przeczytane, 10),
                "HasZalaczniki": false,
                "Id": item.WiadomoscId * 2
            };
        })
    });
});

router.get("/Wiadomosc.mvc/GetWiadomosciUsuniete", (req, res) => {
    res.json({
        "success": true,
        "data": require("../../data/api/messages/WiadomosciUsuniete").map(item => {
            return {
                "FolderWiadomosci": "1",
                "Nieprzeczytana": !item.GodzinaPrzeczytania,
                "Data": new Date(item.DataWyslaniaUnixEpoch * 1000).toISOString(),
                "Tresc": null,
                "Temat": item.Tytul,
                "NadawcaNazwa": item.Nadawca,
                "IdWiadomosci": item.WiadomoscId,
                "IdNadawca": item.NadawcaId,
                "HasZalaczniki": false,
                "Id": item.WiadomoscId * 2
            };
        })
    });
});

router.get("/NowaWiadomosc.mvc/GetJednostkiUzytkownika", (req, res) => {
    const user = require("../../data/api/ListaUczniow")[1];
    res.json({
        "success": true,
        "data": [
            {
                "IdJednostkaSprawozdawcza": user.IdJednostkaSprawozdawcza,
                "Skrot": user.JednostkaSprawozdawczaSkrot,
                "Role": [1],
                "NazwaNadawcy": user.Imie + " " + user.Nazwisko,
                "WychowawcaWOddzialach": [],
                "Id": user.Id
            }
        ]
    });
});

router.get("/Adresaci.mvc/GetAdresaci", (req, res) => {
    const user = require("../../data/api/ListaUczniow")[1];
    res.json({
        "success": true,
        "data": require("../../data/api/dictionaries/Pracownicy").map(item => {
            return {
                "Id": `${item.Id}rPracownik`,
                "Nazwa": `${item.Imie} ${item.Nazwisko} [${item.Kod}] - pracownik (${user.JednostkaSprawozdawczaSkrot})`,
                "IdLogin": item.Id,
                "IdJednostkaSprawozdawcza": user.IdJednostkaSprawozdawcza,
                "Rola": 2,
                "PushWiadomosc": null,
                "Hash": Buffer.from(md5(item.Id)).toString('base64')
            };
        })
    });
});

router.get(["/Wiadomosc.mvc/GetAdresaciWiadomosci", "/Wiadomosc.mvc/GetRoleUzytkownika"], (req, res) => {
    const user = require("../../data/api/ListaUczniow")[1];
    res.json({
        "success": true,
        "data": require("../../data/api/dictionaries/Pracownicy").slice(0, 2).map(item => {
            return {
                "Id": `${item.Id}rPracownik`,
                "Nazwa": `${item.Imie} ${item.Nazwisko} [${item.Kod}] - pracownik (${user.JednostkaSprawozdawczaSkrot})`,
                "IdLogin": item.Id,
                "IdJednostkaSprawozdawcza": null,
                "Rola": 2,
                "PushWiadomosc": null,
                "Hash": Buffer.from(md5(item.Id)).toString('base64')
            };
        })
    });
});

router.all("/Wiadomosc.mvc/GetTrescWiadomosci", (req, res) => {
    const message = require("../../data/api/messages/WiadomosciOdebrane")[0];
    res.json({
        "success": true,
        "data": {
            "Id": message.WiadomoscId,
            "Tresc": message.Tresc,
            "Zalaczniki": [
                {
                    "Url": "https://1drv.ms/u/s!AmvjLDq5anT2psJ4nujoBUyclWOUhw",
                    "IdOneDrive": "0123456789ABCDEF!123",
                    "IdWiadomosc": message.WiadomoscId,
                    "NazwaPliku": "nazwa_pliku.pptx",
                    "Id": message.WiadomoscId * 3
                },
                {
                    "Url": "https://wulkanowy.github.io/",
                    "IdOneDrive": "0123456789ABCDEF!124",
                    "IdWiadomosc": message.WiadomoscId,
                    "NazwaPliku": "wulkanowy.txt",
                    "Id": message.WiadomoscId * 4
                },
                {
                    "Url": "https://github.com/wulkanowy/wulkanowy",
                    "IdOneDrive": "0123456789ABCDEF!125",
                    "IdWiadomosc": message.WiadomoscId,
                    "NazwaPliku": "wulkanowy(2).txt",
                    "Id": message.WiadomoscId * 5
                }
            ]
        }
    });
});

router.all('/Wiadomosc.mvc/GetAdresaciNiePrzeczytaliWiadomosci', (req, res) => {
    const user = require("../../data/api/ListaUczniow")[1];
    const recipient = require("../../data/api/dictionaries/Pracownicy")[0];
    res.json({
        "success": true,
        "data": [
            {
                "Id": `${recipient.Id * 4}`, // ¯\_(ツ)_/¯
                "Nazwa": `${recipient.Imie} ${recipient.Nazwisko} [${recipient.Kod}] - pracownik (${user.JednostkaSprawozdawczaSkrot})`,
                "IdLogin": recipient.Id,
                "IdJednostkaSprawozdawcza": user.IdJednostkaSprawozdawcza,
                "Rola": 2,
                "PushWiadomosc": null,
                "Hash": Buffer.from(md5(recipient.Id)).toString('base64')
            },
        ]
    });
});

router.all('/Wiadomosc.mvc/GetAdresaciPrzeczytaliWiadomosc', (req, res) => {
    const user = require("../../data/api/ListaUczniow")[1];
    const recipient = require("../../data/api/dictionaries/Pracownicy")[1];
    res.json({
        "success": true,
        "data": [
            {
                "Nazwa": `${recipient.Imie} ${recipient.Nazwisko} [${recipient.Kod}] - pracownik (${user.JednostkaSprawozdawczaSkrot})`,
                "Data": "2020-04-07 19:05:00",
                "Id": recipient.Id * 8 // ¯\_(ツ)_/¯
            }
        ]
    });
});

router.all("/Wiadomosc.mvc/UsunWiadomosc", (req, res) => {
    res.json({
        "success": true
    });
});

router.all("/NowaWiadomosc.mvc/InsertWiadomosc", (req, res) => {
    let data = req.body.incomming;
    res.json({
        "success": true,
        "data": {
            "Adresaci": data.Adresaci.map(item => {
                item.PushWiadomosc = false;
                return item;
            }),
            "Temat": data.Temat,
            "Tresc": data.Tresc,
            "Nadawca": {
                "Id": null,
                "Nazwa": "Kowalski Jan",
                "IdLogin": 0,
                "IdJednostkaSprawozdawcza": null,
                "Rola": 0,
                "PushWiadomosc": null,
                "Hash": "hash"
            },
            "WiadomoscPowitalna": false,
            "Id": data.Id
        }
    });
});

module.exports = router;
