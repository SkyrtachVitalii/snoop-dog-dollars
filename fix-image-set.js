// fix-image-set.js
import fs from "fs";
import postcss from "postcss";
import valueParser from "postcss-value-parser";

const file = process.argv[2] || "./css/style.css"; // можна передати шлях аргументом
const fromPrefix = "/img/";     // що шукаємо
const toPrefix = "../img/";     // на що замінюємо

const css = fs.readFileSync(file, "utf8");

const root = postcss.parse(css);

root.walkDecls(/^(background(-image)?)$/i, (decl) => {
  // пропускаємо, якщо немає image-set
  if (!/(^|-)image-set\(/.test(decl.value)) return;

  const ast = valueParser(decl.value);

  // шукаємо функції image-set / -webkit-image-set
  ast.walk((node) => {
    if (
      node.type === "function" &&
      (node.value === "image-set" || node.value === "-webkit-image-set")
    ) {
      // всередині image-set шукаємо url(...)
      node.nodes.forEach((child) => {
        if (child.type === "function" && child.value === "url") {
          const urlNode = child.nodes[0];
          if (urlNode && (urlNode.type === "string" || urlNode.type === "word")) {
            const val = urlNode.value;
            if (val.startsWith(fromPrefix)) {
              urlNode.value = toPrefix + val.slice(fromPrefix.length);
            }
          }
        }
      });
    }
  });

  decl.value = ast.toString();
});

fs.writeFileSync(file, root.toString(), "utf8");
console.log(`✅ Готово: переписав url("${fromPrefix}...") → url("${toPrefix}...") тільки всередині image-set у ${file}`);
