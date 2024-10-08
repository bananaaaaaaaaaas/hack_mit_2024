import express, { Request, Response, Express } from "express";
import http from "http";
import path from "path";
import fs from "fs";
import session from "express-session";
import multer, { Multer } from "multer";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:8081",
};

const app = express();
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get("/", express.static(path.join(__dirname, "./public")));

const handleError = (err: Error, res: Response) => {
  res.status(500).contentType("text/plain").end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "temp/images/",
  limits: { fieldSize: 10 * 1024 * 1024 },
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

app.use(
  session({
    // TODO: add a SESSION_SECRET string in your .env file, and replace the secret with process.env.SESSION_SECRET
    secret: process.env.SESSION_SECRET || "session_secret",
    resave: false,
    saveUninitialized: false,
  })
);

declare module "express-session" {
  interface SessionData {
    uploadNumber: number;
  }
}

app.post(
  "/upload_bulk",
  upload.array("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    console.log("got the files");
    console.log(req.body);
    const files = req.files as Express.Multer.File[];
    console.log(req.files);
    let output: string[] = [];
    files.forEach((file) => {
      if (!req.session.uploadNumber) {
        req.session.uploadNumber = 1;
      } else {
        req.session.uploadNumber += 1;
      }
      const tempPath = file.path;
      const targetPath = path.join(
        __dirname,
        "./assets/images/" +
          req.sessionID +
          req.session.uploadNumber.toString() +
          ".png"
      );
      if (true) {
        fs.rename(tempPath, targetPath, (err) => {
          if (err) return handleError(err, res);
          output.push("req.sessionID + req.session.uploadNumber.toString()");
        });
      } else {
        fs.unlink(tempPath, (err) => {
          if (err) return handleError(err, res);

          res
            .status(403)
            .contentType("text/plain")
            .end("Only .png files are allowed!");
        });
      }
    });
    res.status(200).send(output);
  }
);

const uploadOne = multer({
  dest: "temp/snippets/",
  limits: { fieldSize: 10 * 1024 * 1024 },
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

app.post("/upload_individual", uploadOne.single("file"), (req, res) => {
  const file = req.file as Express.Multer.File;
  const tempPath = file.path;
  if (!req.session.uploadNumber) {
    req.session.uploadNumber = 1;
  } else {
    req.session.uploadNumber += 1;
  }
  const targetPath = path.join(
    __dirname,
    "../assets/working_temp/" +
      req.sessionID +
      req.session.uploadNumber?.toString() +
      ".jpg"
  );
  if (true) {
    fs.rename(tempPath, targetPath, (err) => {
      if (err) return handleError(err, res);
    });
    console.log("moved file");
    const intervalId = setInterval(() => {
      // Stop after 10 iterations
      const outputPath = path.join(
        __dirname,
        "../assets/working_out/" +
          req.sessionID +
          req.session.uploadNumber?.toString() +
          ".txt"
      );
      if (fs.existsSync(outputPath)) {
        const data = fs.readFileSync(outputPath, "utf8");
        console.log("sending response");
        res.status(200).send(data);

        clearInterval(intervalId);
      }
    }, 100);
  } else {
    fs.unlink(tempPath, (err) => {
      if (err) return handleError(err, res);

      res
        .status(403)
        .contentType("text/plain")
        .end("Only .jpg files are allowed!");
    });
  }
});
/* manga_ocr -r "../assets/working_temp" --write_to "../assets/working_out/text.txt" */
