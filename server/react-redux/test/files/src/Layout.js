import React from 'react'

export default ({ title, meta, link, html, body, root, scripts }) => (
    <html {...html}>
        <head>
            {title}
            {meta}
            {link}
        </head>
        <body {...body}>
            {root}
            {scripts}
        </body>
    </html>
)
