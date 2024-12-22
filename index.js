const { default: request } = require("axios");
const fs = require("fs");
let athena = require("./athena_template.json");

const fixedBackendValues = {
    "AthenaEmoji": "AthenaDance",
    "AthenaSpray": "AthenaDance",
    "AthenaToy": "AthenaDance",
    "AthenaPetCarrier": "AthenaBackpack",
    "AthenaPet": "AthenaBackpack",
    "SparksDrum": "SparksDrums",
    "SparksMic": "SparksMicrophone"
}

console.log("Fortnite Athena Profile Generator by Lawin v1.0.3\n");
request.get("https://fortnite-api.com/v2/cosmetics").then(resp => {
    let data = resp.data.br;

    console.log("[GEN] Starting to generate...\n");

    for (var mode in data) {
        if (mode == "lego") continue; // Adding lego characters to the profile is unnecessary

        data[mode].forEach(item => {
            if (item.id.toLowerCase().includes("random")) return;

            if (mode == "tracks") item.type = {"backendValue": "SparksSong"};

            // Credits to PRO100KatYT for backendValue fixes
            if (fixedBackendValues.hasOwnProperty(item.type.backendValue)) item.type.backendValue = fixedBackendValues[item.type.backendValue];

            let id = `${item.type.backendValue}:${item.id}`;
            let variants = [];

            if (item.variants) {
                item.variants.forEach(obj => {
                    variants.push({
                        "channel": obj.channel || "",
                        "active": obj.options[0].tag || "",
                        "owned": obj.options.map(variant => variant.tag || "")
                    })
                })
            }

            athena.items[id] = {
                "templateId": id,
                "attributes": {
                    "max_level_bonus": 0,
                    "level": 1,
                    "item_seen": true,
                    "xp": 0,
                    "variants": variants,
                    "favorite": false
                },
                "quantity": 1
            }
        })
    }

    fs.writeFileSync("./athena.json", JSON.stringify(athena, null, 2));
    const stats = fs.statSync("./athena.json");

    console.log("[GEN] Successfully generated and saved into", `${__dirname}\\athena.json`, `(${size(stats.size)})`);
})

function size(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

    if (bytes == 0) {
        return "N/A"
    }

    const i = Number(Math.floor(Math.log(bytes) / Math.log(1024)))

    if (i == 0) {
        return bytes + " " + sizes[i]
    }

    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
}
