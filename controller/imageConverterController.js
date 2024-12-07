const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const archiver = require("archiver");

// Function to convert uploaded images to the requested format
const convertImages = async (req, res) => {
  const { format } = req.body; 
  const convertedFiles = [];

  try {
    for (let file of req.files) {
      const filePath = path.join(__dirname, "../uploads", file.filename);
      const newFileName = `${Date.now()}_${path.basename(file.originalname, path.extname(file.originalname))}.${format}`;
      const newFilePath = path.join(__dirname, "../converted", newFileName);

      // Convert the image
      await sharp(filePath)
        .toFormat(format)
        .toFile(newFilePath);

      convertedFiles.push({
        originalName: file.originalname,
        convertedPath: `/converted/${newFileName}`,
      });

      // Delete the uploaded file
      fs.unlinkSync(filePath);
    }

    // Serve converted images and send paths to client
    res.status(200).json({ convertedFiles });
  } catch (error) {
    console.error("Conversion Error:", error);
    res.status(500).json({ error: "Error during image conversion" });
  }
};

// Function to handle downloading all converted files as a ZIP

const downloadAll = async (req, res) => {
  try {
    const zipPath = path.join(__dirname, "../converted", "converted-images.zip");
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      res.download(zipPath, "converted-images.zip", (err) => {
        if (err) console.error("Error sending the file:", err);
        fs.unlinkSync(zipPath); // Delete ZIP after download
      });
    });

    archive.on("error", (err) => {
      console.error("Archive Error:", err);
      res.status(500).send({ error: err.message });
    });

    archive.pipe(output);

    // Add each file in `converted` to the ZIP
    const convertedDir = path.join(__dirname, "../converted");
    fs.readdirSync(convertedDir).forEach((file) => {
      archive.file(path.join(convertedDir, file), { name: file });
    });

    await archive.finalize();
  } catch (error) {
    console.error("ZIP Creation Error:", error);
    res.status(500).json({ error: "Error creating ZIP file" });
  }
};



module.exports = { convertImages, downloadAll };
