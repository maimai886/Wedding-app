// README screenshots: run `npm run dev` (port 5173, or BASE=...), then `node scripts/screenshots.mjs`.
// Uses the installed Google Chrome (CHROME overrides the path). Every run starts from the seeded demo data.
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE ?? "http://localhost:5173/";
const OUT = new URL("../docs/screenshots/", import.meta.url).pathname;
const SAMPLES = new URL("../public/demo/", import.meta.url).pathname;
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--lang=zh-TW"] });
const page = await browser.newPage();
page.on("pageerror", (e) => console.error("page error:", e.message));
const desktop = { width: 1440, height: 900, deviceScaleFactor: 1.5 };
const phone = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const go = async (hash) => { await page.goto(`${BASE}#${hash}`, { waitUntil: "networkidle0" }); await wait(700); };
// toasts from the setup steps would sit on top of every picture
const shot = async (name) => {
  await page.addStyleTag({ content: ".toasts { display: none !important; }" }); // hidden, not removed: React owns those nodes
  await page.screenshot({ path: `${OUT}${name}.jpg`, type: "jpeg", quality: 85 });
};

await page.setViewport(desktop);
await go("/");
await shot("welcome");
await page.type(".name-form input", "阿明");
await page.click(".name-form button[type=submit]");
await wait(1200);

// a guest's afternoon: two photos, a few likes, one wish
await page.click(".sidebar .btn.primary");
await wait(400);
await (await page.$(".drop input[type=file]")).uploadFile(`${SAMPLES}garden.jpg`, `${SAMPLES}toast.jpg`);
await wait(1500);
await page.$$eval(".upload-item input", (inputs) => inputs.forEach((el, i) => {
  const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  set.call(el, ["楓葉好紅", "我們這桌乾杯"][i]);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}));
await shot("upload");
await page.click(".modal-foot .btn.primary");
await wait(1200);
await go("/photos");
for (const b of (await page.$$(".tile .like")).slice(0, 3)) { await b.click(); await wait(150); }
await go("/wishes");
await (await page.waitForSelector(".page-head .btn.primary", { timeout: 5000 })).click();
await page.waitForSelector(".modal textarea", { visible: true });
await page.type(".modal textarea", "Ren、Hana 新婚快樂！今天的楓葉跟你們一樣好看 🍁");
await page.click(".modal-foot .btn.primary");
await wait(1000);

await go("/"); await shot("home");
await go("/photos"); await shot("photo-wall");
await (await page.$(".tile-img")).click(); await wait(900); await shot("lightbox"); await page.keyboard.press("Escape");
await go("/schedule"); await shot("schedule");
await go("/mine"); await shot("frame-preview");
await go("/wishes"); await shot("wishes");
await go("/ranking"); await shot("ranking");
await go("/host"); await page.click(".draw-card .btn.primary"); await wait(1500); await shot("host-draw");

await page.setViewport(phone);
await go("/"); await shot("mobile-home");
await go("/photos"); await shot("mobile-photos");
await go("/schedule"); await shot("mobile-schedule");

await browser.close();
console.log("saved to", OUT);
