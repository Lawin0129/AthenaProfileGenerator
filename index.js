const axios = require("axios").default;
const fs = require("fs");
var athena = {"created":"","updated":"","rvn":0,"wipeNumber":1,"accountId":"","profileId":"athena","version":"no_version","items":{"loadout1":{"templateId":"CosmeticLocker:cosmeticlocker_athena","attributes":{"locker_slots_data":{"slots":{"MusicPack":{"items":[""]},"Character":{"items":[""],"activeVariants":[null]},"Backpack":{"items":[""],"activeVariants":[null]},"SkyDiveContrail":{"items":[""],"activeVariants":[null]},"Dance":{"items":["","","","","",""]},"LoadingScreen":{"items":[""]},"Pickaxe":{"items":[""],"activeVariants":[null]},"Glider":{"items":[""],"activeVariants":[null]},"ItemWrap":{"items":["","","","","","",""],"activeVariants":[null,null,null,null,null,null,null,null]}}},"use_count":0,"banner_icon_template":"StandardBanner1","banner_color_template":"DefaultColor1","locker_name":"","item_seen":false,"favorite":false},"quantity":1}},"stats":{"attributes":{"past_seasons":[],"season_match_boost":999999999,"loadouts":["loadout1"],"favorite_victorypose":"","mfa_reward_claimed":false,"quest_manager":{"dailyLoginInterval":"","dailyQuestRerolls":1},"book_level":100,"season_num":0,"favorite_consumableemote":"","banner_color":"DefaultColor1","favorite_callingcard":"","favorite_character":"","favorite_spray":[],"book_xp":100,"favorite_loadingscreen":"","book_purchased":true,"lifetime_wins":100,"favorite_hat":"","level":100,"favorite_battlebus":"","favorite_mapmarker":"","favorite_vehicledeco":"","accountLevel":100,"favorite_backpack":"","favorite_dance":["","","","","",""],"inventory_limit_bonus":0,"last_applied_loadout":"","favorite_skydivecontrail":"","favorite_pickaxe":"","favorite_glider":"","daily_rewards":{},"xp":999,"season_friend_match_boost":999999999,"active_loadout_index":0,"favorite_musicpack":"","banner_icon":"StandardBanner1","favorite_itemwraps":["","","","","","",""]}},"commandRevision":0};

console.log("Fortnite Athena Profile Generator by Lawin v1.0.0\n\n[GEN] Starting to generate...");
axios.get("https://fortnite-api.com/v2/cosmetics/br").then(resp => {
    var data = resp.data.data;

    data.forEach(item => {
        // Credits to PRO100KatYT for backendValue fixes
        if (item.type.backendValue == "AthenaEmoji" || item.type.backendValue == "AthenaSpray" || item.type.backendValue == "AthenaToy") item.type.backendValue = "AthenaDance";
        if (item.type.backendValue == "AthenaPetCarrier") item.type.backendValue = "AthenaBackpack";

        var id = item.type.backendValue + ":" + item.id;
        var variants = [];

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