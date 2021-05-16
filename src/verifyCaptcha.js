import { humankey } from "./App";

require("es6-promise").polyfill()
require("isomorphic-fetch")

function verifyCaptcha(humanKey) {
    const RECAPTCHA_SERVER_KEY = "6LdnItMaAAAAAKypOW3p76B5zyBgR5Ie_rwH1W1f"

    //const humanKey = humankey.onChangeCaptcha();
    // Validate Human
    const isHuman = fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: "post",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
        body: `secret=${RECAPTCHA_SERVER_KEY}&response=${humanKey}`
    })
        .then(res => res.json())
        .then(json => json.success)
        .catch(err => {
            //throw new Error(`Error in Google Siteverify API. ${err.message}`)
        })

    if (humanKey === null || !isHuman) {
        throw new Error(`YOU ARE NOT A HUMAN.`)
    }

    // The code below will run only after the reCAPTCHA is succesfully validated.
    console.log("SUCCESS!")
}
const verify = verifyCaptcha();
export default verify;