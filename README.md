## Setup

run `npm install`

create a file `/.env` with following structure:

```
POSTMARK_API_TOKEN=""
```

Add Postmark API token as the value

## Send testing emails

Make sure `SEND_REAL_EMAILS` is set to `false`

run `node santa`

## Send real emails

Set `SEND_REAL_EMAILS` to `true`

Run `node santa`

## Troubleshooting

Sometimes the random pick is so bad that the gifts cannot be assigned properly (eg. someone would be giving a gift to himself or giving two gifts to the same person).

When this happens, the program throws an error and no emails are sent. Just run it again.
