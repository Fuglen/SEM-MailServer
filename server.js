var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var Imap = require("imap");
var inspect = require("util").inspect;
var fs = require("fs");
var fileStream;
const simpleParser = require("mailparser").simpleParser;
var WebSocketServer = require("ws").Server;
wss = new WebSocketServer({ port: 5000 });

// Nodemailer starter herfra, Transporter..
var transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "bilcenterodense@gmail.com",
      pass: "bco123qwe"
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false
    }
  })
);

var mailOptions = {
  from: "bilcenterodense@gmail.com",
  to: "bilcenterodense@gmail.com",
  subject: "Sending Email using Node.js[nodemailer]",
  text: "That was easy!"
};

transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});

// Forbindelse med klienter starter herfra
var imap = new Imap({
  user: "bilcenterodense@gmail.com",
  password: "bco123qwe",
  host: "imap.gmail.com",
  port: 993,
  tls: true
});

wss.on("connection", function(ws) {
  console.log("Websocket Client connected");

  ws.on("message", function(e) {
    var request = JSON.parse(e);

    if (request.type === "test") {
      console.log(request);
    }

    if (request.type === "get") {
      function openInbox(cb) {
        imap.openBox("INBOX", true, cb);
      }
      imap.once("ready", function() {
        openInbox(function(err, box) {
          if (err) throw err;
          imap.search(["UNSEEN", ["SINCE", "June 15, 2018"]], function(
            err,
            results
          ) {
            if (err) throw err;
            var f = imap.fetch(results, { bodies: "" });
            f.on("message", function(msg, seqno) {
              console.log("Message #%d", seqno);
              var prefix = "(#" + seqno + ") ";
              msg.on("body", function(stream, info) {
                // console.log(prefix + "Body");
                // stream.pipe(fs.createWriteStream("msg-" + seqno + "-body.txt"));
              });
              msg.once("attributes", function(attrs) {
                console.log(
                  prefix + "Attributes: %s",
                  inspect(attrs, false, 8)
                );
              });
              msg.once("end", function() {
                console.log(prefix + "Finished");
              });
            });
            f.once("error", function(err) {
              console.log("Fetch error: " + err);
            });
            f.once("end", function() {
              console.log("Done fetching all messages!");
              imap.end();
            });
          });
        });
      });
      imap.once("error", function(err) {
        console.log(err);
      });
      imap.once("end", function() {
        console.log("Connection ended");
      });
      imap.connect();
    }
  });

  ws.on("close", function() {
    ws.close();
  });
});
