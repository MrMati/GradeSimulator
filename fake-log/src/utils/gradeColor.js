exports.getGradeColorByCategoryName = name => {
    switch (true) {
        case name.includes("czarny"): return "000000";
        case name.includes("czerw"): return "F04C4C";
        case name.includes("fiol"): return "B16CF1";
        case name.includes("nieb"): return "20A4F7";
        case name.includes("zielony"): return "6ECD07";
    }
};
