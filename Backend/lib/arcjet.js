// arcjet.js
import arcjet,{tokenBucket,shield,detectBot} from "@arcjet/node";
import "dotenv/config";
// initialize arcjet 
export const aj=arcjet({
    key:process.env.ARCJET_KEY,
    characteristics:["ip.scr"],
    rules:[
        // shield protect my app from comman attcks
        shield({mode:"LIVE"}),
        // detect and block bots
        detectBot({mode:"LIVE",
            // block all bots excepts search engine bots
            allow:[
                "CATEGORY:SEARCH_ENGINE"
                // see the full list at https://arcjet.com/bot-list
            ]
        }),
        // rate limiting
        tokenBucket({
            mode:"LIVE",
            refillRate:5,
            capacity:10,
            interval:10,
        })
    ]
})