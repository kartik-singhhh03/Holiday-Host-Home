const fs = require("fs");
const path = require("path");

function processStyles() {
  let cssPath = "style.css";
  let css = fs.readFileSync(cssPath, "utf8");

  // 1. Add LODGIFY Colors to :root if not present
  if (!css.includes("--ldg-psb-color-primary")) {
    css = css.replace(
      /:root\s*\{/,
      `:root {
  --ldg-psb-color-primary: #7AB8B6;
  --ldg-bnb-color-primary: #7AB8B6;`,
    );
  }

  // 2. Adjust Navbar to be sticky, z-index 1000
  css = css.replace(
    /position:\s*fixed;\s*top:\s*0;\s*left:\s*0;\s*right:\s*0;\s*z-index:\s*9999;/g,
    "position: sticky; top: 0; z-index: 1000;",
  );

  // 3. Ensure Footer is Center aligned with max-width: 1200px and margin: auto;
  // We previously set it up like `.footer .container { }`
  if (!css.includes("max-width: 1200px; margin: 0 auto;")) {
    css = css.replace(
      /\.footer \.container\s*\{/,
      ".footer .container {\n  max-width: 1200px;\n  margin: 0 auto;",
    );
  }

  // 4. Add Lodgify Wrapper Styles
  if (!css.includes(".lodgify-search-wrapper")) {
    css += `\n
/* ============================================================
   LODGIFY WIDGET WRAPPERS
   ============================================================ */
.lodgify-search-wrapper,
.lodgify-booking-wrapper {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 16px;
  width: 100%;
}
@media (max-width: 768px) {
  .lodgify-search-wrapper,
  .lodgify-booking-wrapper {
    padding: 0;
  }
}
`;
  }

  fs.writeFileSync(cssPath, css, "utf8");
}

function processHtmlFiles() {
  const files = fs
    .readdirSync(".")
    .filter((f) => f.endsWith(".html") && !f.startsWith("LODGIFY"));

  const scriptsHtml = `
  <!-- LODGIFY SCRIPTS (LOAD ONCE) -->
  <script src="https://app.lodgify.com/portable-search-bar/stable/renderPortableSearchBar.js" defer></script>
  <script src="https://app.lodgify.com/book-now-box/stable/renderBookNowBox.js" defer></script>
  
  <script src="script.js"></script>`;

  const searchWrapperHtml = `
<!-- LODGIFY SEARCH START -->
<div class="lodgify-search-wrapper" style="margin-top: 2rem;">
  <div id="lodgify-portable-search-bar" data-website-id="397089"></div>
  <a href="https://checkout.lodgify.com/holiday-home-host/en/#/761286" style="display:none; color:white; text-decoration:underline;">
    Check Availability
  </a>
</div>
<!-- LODGIFY SEARCH END -->
`;

  const bookingWrapperHtml = `
              <!-- LODGIFY BOOKING START -->
              <div class="lodgify-booking-wrapper">
                <div id="lodgify-book-now-box" data-website-id="397089"></div>
                <div style="margin-top: 1rem;">
                  <a href="https://checkout.lodgify.com/holiday-home-host/en/#/761286" class="btn-primary-dark" style="display:inline-flex; align-items:center; gap:8px;">
                    <span class="material-symbols-outlined">date_range</span> 
                    Check Availability
                  </a>
                </div>
              </div>
              <!-- LODGIFY BOOKING END -->
`;

  files.forEach((file) => {
    let content = fs.readFileSync(file, "utf8");

    // Add scripts globally (replace the old reference)
    if (!content.includes("renderPortableSearchBar.js")) {
      content = content.replace(
        /<script src="script\.js"><\/script>/,
        scriptsHtml,
      );
    }

    // Only on index.html: Inject wrappers
    if (file === "index.html") {
      // Find Hero section buttons to append search wrapper
      if (!content.includes("<!-- LODGIFY SEARCH START -->")) {
        const searchTarget = `<a href="#owners" class="btn-outline">List Your Property &rarr;</a>
          </div>`;
        content = content.replace(
          searchTarget,
          searchTarget + "\n          " + searchWrapperHtml,
        );
      }

      // Find Property section button to append booking wrapper
      if (!content.includes("<!-- LODGIFY BOOKING START -->")) {
        const bookingTargetRegex =
          /<a href="#contact" class="btn-primary-dark">[\s\S]*?Check Availability[\s\S]*?<\/a>/;
        // replace the exact button entirely with booking wrapper containing the new fallback
        content = content.replace(bookingTargetRegex, bookingWrapperHtml);
      }
    }

    fs.writeFileSync(file, content, "utf8");
  });
}

processStyles();
processHtmlFiles();
console.log("Lodgify setup done.");
