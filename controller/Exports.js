const PDFDocument = require("pdfkit");
const { createCanvas } = require("canvas");
exports.shareURL = async (req, res) => {
  const colors = req.query.colors;
  console.log("colors", colors);
  if (colors) {
    try {
      const colorArray = colors.split(",");
      res.send(`
                <html>
                    <body>
                        <h1>Shared Color Palette</h1>
                        <div style="display: flex;  width:100%;">
                            ${colorArray
                              .map(
                                (color) => `
                                <div style="width: 50vh; height: 88vh; background-color: ${color}; display: flex; justify-content:center; align-items:center">
                                <span style="font-size:4rem; font-weight:700">${color
                                  .split("#")
                                  .pop()
                                  .toUpperCase()}<span/>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </body>
                </html>
            `);
    } catch (error) {
      res.status(400).send("Invalid palette data");
    }
  } else {
    res.status(400).send("No palette data provided");
  }
};

exports.sharePDF = async (req, res) => {
  const colors = req.query.colors;
  console.log("colors", colors);
  if (colors) {
    try {
      const colorArray = colors.split(",");
      const doc = new PDFDocument({ size: "A3" });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="color_palette.pdf"'
      );
      doc.pipe(res);

      doc
        .fontSize(20)
        .text("Your Color Palette", { align: "center" })
        .moveDown();

      let x = 15;
      let y = 100;

      colorArray.forEach((color) => {
        doc.roundedRect(x, y, 260, 240, 10).fill(color);
        doc
          .fillColor("white")
          .fontSize(12)
          .text(color, x + 10, y + 190, { align: "left" });

        x += 275;
        if (x + 200 > doc.page.width) {
          x = 15;
          y += 255;
        }
      });

      doc.end();
    } catch (error) {
      res.status(400).send("Invalid palette data");
    }
  } else {
    res.status(400).send("No palette data provided");
  }
};

exports.sharePNG = async (req, res) => {
  const colors = req.query.colors;
  console.log("colors", colors);
  if (colors) {
    try {
      const colorArray = colors.split(",");
      const viewportHeight = 800;
      const blockHeight = 0.8 * viewportHeight;
      const blockWidth = 200;
      const padding = 20;

      const canvasWidth = blockWidth * colorArray.length;
      const canvasHeight = blockHeight + padding;

      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext("2d");

      colorArray.forEach((color, index) => {
        const x = index * blockWidth;
        const y = 0;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x + 20, y);
        ctx.arcTo(x + blockWidth, y, x + blockWidth, y + blockHeight, 20);
        ctx.arcTo(x + blockWidth, y + blockHeight, x, y + blockHeight, 20);
        ctx.arcTo(x, y + blockHeight, x, y, 20);
        ctx.arcTo(x, y, x + blockWidth, y, 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(color, x + 10, y + blockHeight - 10);
      });

      const buffer = canvas.toBuffer();

      res.setHeader("Content-Type", "image/png");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="color_palette.png"'
      );
      res.send(buffer);
    } catch (error) {
      res.status(400).send("Invalid palette data");
    }
  } else {
    res.status(400).send("No palette data provided");
  }
};

exports.shareSVG = async (req, res) => {
  const colors = req.query.colors;
  console.log("colors", colors);
  if (colors) {
    try {
      const colorArray = colors.split(",");
      const blockHeight = 0.6 * 1000;
      const blockWidth = 200;
      const padding = 20;

      const svgWidth = blockWidth * colorArray.length;
      const svgHeight = blockHeight + padding;

      let svgContent = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

      colorArray.forEach((color, index) => {
        const x = index * blockWidth;
        const y = 0;
        svgContent += `
                    <rect x="${x}" y="${y}" width="${blockWidth}" height="${blockHeight}" fill="${color}" rx="20" ry="20"/>
                    <text x="${x + 10}" y="${
          y + blockHeight - 10
        }" font-family="Arial" font-size="20" fill="white">${color}</text>
                `;
      });

      svgContent += `</svg>`;

      res.set("Content-Type", "image/svg+xml");
      res.set(
        "Content-Disposition",
        'attachment; filename="color_palette.svg"'
      );
      res.send(svgContent);
    } catch (error) {
      res.status(400).send("Invalid palette data");
    }
  } else {
    res.status(400).send("No palette data provided");
  }
};

exports.shareEmbeddedSVG = async (req, res) => {
  const colors = req.query.colors;
  console.log("colors", colors);
  if (colors) {
    try {
      const colorArray = colors.split(",");
      const blockHeight = 0.6 * 1000;
      const blockWidth = 200;
      const padding = 20;

      const svgWidth = blockWidth * colorArray.length;
      const svgHeight = blockHeight + padding;

      const totalColorWidth = colorArray.length * blockWidth;

      const xOffset = (svgWidth - totalColorWidth) / 2;

      let svgContent = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

      colorArray.forEach((color, index) => {
        const x = index * blockWidth + xOffset;
        const y = 0;
        svgContent += `
                    <rect x="${x}" y="${y}" width="${blockWidth}" height="${blockHeight}" fill="${color}" rx="20" ry="20"/>
                    <text x="${x + 10}" y="${
          y + blockHeight + 20
        }" font-family="Arial" font-size="20" fill="black">${color}</text>
                `;
      });

      svgContent += `</svg>`;

      res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Embedded Color Palette</title>
                </head>
                <body>
                    <h1>Your Embedded Color Palette</h1>
                    <div>
                        ${svgContent}
                    </div>
                </body>
                </html>
            `);
    } catch (error) {
      res.status(400).send("Invalid palette data");
    }
  } else {
    res.status(400).send("No palette data provided");
  }
};
