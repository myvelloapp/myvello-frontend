const fs = require('fs');
const path = require('path');

const iconPath = path.join(__dirname, '..', 'public', 'icons', 'icon-192x192.png');
const b64 = fs.readFileSync(iconPath).toString('base64');

const mobileConfig = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>FullScreen</key>
            <true/>
            <key>Icon</key>
            <data>${b64}</data>
            <key>IsRemovable</key>
            <true/>
            <key>Label</key>
            <string>Myvello</string>
            <key>PayloadDescription</key>
            <string>Installs Myvello app on iOS</string>
            <key>PayloadDisplayName</key>
            <string>Myvello</string>
            <key>PayloadIdentifier</key>
            <string>com.myvello.app.webclip</string>
            <key>PayloadType</key>
            <string>com.apple.webClip.managed</string>
            <key>PayloadUUID</key>
            <string>4A9F6B5C-3B47-4E28-8608-F4F434AC30D1</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>Precomposed</key>
            <true/>
            <key>URL</key>
            <string>https://myvello.app/login</string>
        </dict>
    </array>
    <key>PayloadDisplayName</key>
    <string>Myvello iOS App</string>
    <key>PayloadIdentifier</key>
    <string>com.myvello.app</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>9C3A648F-5DF9-4B5D-916A-191B9B53E471</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'myvello.mobileconfig'), mobileConfig, 'utf8');
console.log('myvello.mobileconfig generated successfully');
