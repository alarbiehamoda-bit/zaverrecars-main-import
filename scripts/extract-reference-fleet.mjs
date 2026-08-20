// استخراج نصي فقط لبيانات الأسطول العامة؛ لا تُقيَّم الشيفرة البعيدة ولا تُنفَّذ.
const url = "https://luxcarrent-fy6ozqfy.manus.space/assets/index-DD4jiv0O.js";
const source = await (await fetch(url)).text();
const start = source.indexOf("const At=[");

if (start < 0) throw new Error("Reference fleet array was not found");

const arrayStart = source.indexOf("[", start);
let depth = 0;
let quote = "";
let escaped = false;
let arrayEnd = -1;
for (let index = arrayStart; index < source.length; index += 1) {
  const char = source[index];
  if (quote) {
    if (escaped) escaped = false;
    else if (char === "\\") escaped = true;
    else if (char === quote) quote = "";
    continue;
  }
  if (char === '"' || char === "'" || char === "`") quote = char;
  else if (char === "[") depth += 1;
  else if (char === "]") {
    depth -= 1;
    if (depth === 0) { arrayEnd = index; break; }
  }
}

const rawArray = source.slice(arrayStart + 1, arrayEnd);
const objects = [];
let objectStart = -1;
depth = 0;
quote = "";
escaped = false;
for (let index = 0; index < rawArray.length; index += 1) {
  const char = rawArray[index];
  if (quote) {
    if (escaped) escaped = false;
    else if (char === "\\") escaped = true;
    else if (char === quote) quote = "";
    continue;
  }
  if (char === '"' || char === "'" || char === "`") quote = char;
  else if (char === "{") { if (depth === 0) objectStart = index; depth += 1; }
  else if (char === "}") { depth -= 1; if (depth === 0 && objectStart >= 0) objects.push(rawArray.slice(objectStart, index + 1)); }
}

const findString = (object, key) => object.match(new RegExp(`${key}:"([^"]*)"`))?.[1] ?? "";
const findNumber = (object, key) => object.match(new RegExp(`${key}:(\\d+(?:e\\d+)?)`))?.[1] ?? "";
const cars = objects.map((object) => ({
  id: findString(object, "id"),
  index: findNumber(object, "index"),
  brand: findString(object, "brand"),
  name: findString(object, "model"),
  type: findString(object, "category"),
  image: findString(object, "image").replace("/manus-storage/", ""),
  price: findNumber(object, "priceAedPerDay"),
})).filter((car) => car.id && car.brand && car.name);

console.log(cars.map((car) => JSON.stringify(car)).join("\n"));
