require("dotenv").config()
const fs = require("fs")
const postmark = require("postmark")

// TODO: Create account at Postmark.com and enter the API token in .env file in root folder (see Readme.md for example)
const postmarkClient = new postmark.Client(process.env.POSTMARK_API_TOKEN)

// TODO: Set email parameters
const TEST_EMAIL_ADDRESS = "" // Your email address for testing
const EMAIL_FROM = "hohoho@secretsanta.cz" // Change to the email address approved in Postmark
const EMAIL_SUBJECT = "🎅 Čí jsi Secret Santa?"

// TODO: Replace the emails with the correct ones
const SANTAS = ["name1@email.com", "name2@email.com"]

// ⚠️ SET THIS TO TRUE TO SEND THE EMAILS TO ALL PEOPLE. DO ONLY AFTER TESTING!
const SEND_REAL_EMAILS = false

const GIFTS_PER_SANTA = 2

let emailTemplate = ""

// TODO: Edit text of the email in email.html
fs.readFile("email.html", "utf8", (err, data) => {
    if (err) {
        throw new Error("Email HTML not loaded")
    }
    emailTemplate = data
    assignGiftsToSantas()
})

function assignGiftsToSantas() {
    let gifts = []
    for (let index = 0; index < GIFTS_PER_SANTA; index++) {
        gifts[index] = SANTAS
    }

    let SantasToGifts = []

    SANTAS.forEach((santa) => {
        SantasToGifts[santa] = []

        for (let index = 0; index < GIFTS_PER_SANTA; index++) {
            let availableGiftsForThisSanta = gifts[index].filter((email) => {
                if (santa === email) {
                    return false
                } else if (SantasToGifts[santa].includes(email)) {
                    return false
                } else {
                    return true
                }
            })
            let randomGift =
                availableGiftsForThisSanta[
                    Math.floor(
                        Math.random() * availableGiftsForThisSanta.length
                    )
                ]

            if (!randomGift) {
                throw new Error(
                    "👿 Bad luck with the random pick. Gifts could not be assigned properly. No emails were sent. Try again."
                )
            }
            SantasToGifts[santa].push(randomGift)
            gifts[index] = gifts[index].filter((gift) => {
                return gift !== randomGift
            })
        }

        const NAMES_HTML = SantasToGifts[santa].join("</li><li>")

        const HTML_BODY = emailTemplate.replace(
            "{{LIST}}",
            `<ol><li>${NAMES_HTML}</li></ol>`
        )

        let toEmail = TEST_EMAIL_ADDRESS
        if (SEND_REAL_EMAILS) {
            toEmail = santa
        }

        if (toEmail) {
            postmarkClient.sendEmail({
                From: EMAIL_FROM,
                To: toEmail,
                Subject: EMAIL_SUBJECT,
                HtmlBody: HTML_BODY,
            })
        }
    })

    console.log(SantasToGifts)
}
