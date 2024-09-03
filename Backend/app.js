const express = require("express");
const router = express.Router()
const multer = require("multer");
const Pdf = require('./Models/pdf')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload-files", upload.single("file"), async (req, res) => {
  const { faculty_email, subject, title } = req.body
  // const title = req.body.title;
  const pdf = req.file.filename;
  const data = new Pdf({  
    pdf,
    title,
    subject,
    faculty_email
  })
  try {
    await data.save();
    return res.status(200).json({
      message: "PDF added successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

router.get("/get-files", async (req, res) => {
  const { subject } = req.body;
  try {
    await Pdf.find({ subject }).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) { }
});

module.exports = router
