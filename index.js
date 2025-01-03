const { default: request } = require("axios");
const fs = require("fs");
const path = require("path");
let athena = require("./athena_template.json");

const fixedBackendValues = {
    "AthenaEmoji": "AthenaDance",
    "AthenaSpray": "AthenaDance",
    "AthenaToy": "AthenaDance",
    "AthenaPetCarrier": "AthenaBackpack",
    "AthenaPet": "AthenaBackpack",
    "SparksDrum": "SparksDrums",
    "SparksMic": "SparksMicrophone"
};

console.log("Fortnite Athena Profile Generator by Lawin v1.0.4\n");
request.get("https://fortnite-api.com/v2/cosmetics").then(resp => {
    let data = resp.data.data;

    console.log("[GEN] Starting to generate...");

    for (let mode of Object.keys(data)) {
        if ((mode == "lego") || (mode == "beans")) continue;

        for (let item of data[mode]) {
            if (item.id.toLowerCase().includes("random")) continue;

            if (mode == "tracks") item.type = { "backendValue": "SparksSong" };

            // Credits to PRO100KatYT for backendValue fixes
            if (Object.keys(fixedBackendValues).includes(item.type.backendValue)) item.type.backendValue = fixedBackendValues[item.type.backendValue];

            let id = `${item.type.backendValue}:${item.id}`;
            let variants = [];

            if (item.variants) {
                for (let obj of item.variants) {
                    variants.push({
                        channel: (obj.channel) || "",
                        active: (obj.options?.[0]?.tag) || "",
                        owned: (obj.options?.map?.(variant => (variant?.tag || ""))) || ""
                    });
                }
            }

            athena.items[id] = {
                templateId: id,
                attributes: {
                    max_level_bonus: 0,
                    level: 1,
                    item_seen: true,
                    xp: 0,
                    variants: variants,
                    favorite: false
                },
                quantity: 1
            };
        }
    }

    const athenaPath = path.join(__dirname, "athena.json");

    fs.writeFileSync(athenaPath, JSON.stringify(athena, null, 2));
    const stats = fs.statSync(athenaPath);

    console.log(`[GEN] Successfully generated and saved into ${athenaPath} (${size(stats.size)})`);
});

function size(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes == 0) {
        return "N/A";
    }

    const i = Number(Math.floor(Math.log(bytes) / Math.log(1024)));

    if (i == 0) {
        return bytes + " " + sizes[i];
    }

    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}
