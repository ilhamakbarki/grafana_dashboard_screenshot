const puppeteer = require('puppeteer');

exports.capture = async function (req, res) {
    const body = req.body;

    if (body.base_url == null) {
        return res.status(400).send({ 'message': 'base_url is required' });
    }
    if (body.username == null) {
        return res.status(400).send({ 'message': 'username is required' });
    }
    if (body.password == null) {
        return res.status(400).send({ 'message': 'password is required' });
    }
    if (body.urls == null) {
        return res.status(400).send({ 'message': 'urls is required' });
    }
    if (!Array.isArray(body.urls)) {
        return res.status(400).send({ 'message': 'urls must be valid array' });
    }
    const folder = './screenshot';
    const width = parseInt(body.width) || 1800;
    const height = parseInt(body.height) || 750;

    let url = `${body.base_url}/login`, res_data;
    // C:/Program Files/Google/Chrome/Application/chrome.exe
    // /usr/bin/google-chrome
    const browser = await puppeteer.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--ignore-certificate-errors --enable-features=NetworkService', '--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();
    await client.send('Security.setIgnoreCertificateErrors', { ignore: true });

    // Get the "viewport" of the page, as reported by the page.
    await page.setViewport({ width, height })

    try {
        await page.goto(url, { waitUntil: 'networkidle0' }); // wait until page load 
        await page.type('input[name="user"]', body.username);
        await page.type('input[name="password"]', body.password);
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        const now = Date.now();
        const path = [];
        const baseurl = process.env.HOST || `http://127.0.0.1:${global.PORT}`;
        for (const i in body.urls) {
            const name = `${now}_${body.urls[i].name}.jpg`;
            await page.goto(`${body.base_url}/${body.urls[i].url}`, { waitUntil: 'networkidle0' });
            await page.screenshot({ path: `${folder}/${name}`, type: "jpeg", quality: 100, omitBackground: true, fullPage: true });
            path.push({
                'name': body.urls[i].name,
                'url': `${baseurl}/screenshoot/${name}`
            })
        }
        await browser.close();
        res.status(200).send({ "message": "success", 'images': path });
    }
    catch (err) {
        console.log("PPTR Error - handled case", err);
        res_data = [{ "type": "error" }];
        await browser.close();
        res.status(500).send({ "message": `error - ${err}` });
    }

}; // global function closing

