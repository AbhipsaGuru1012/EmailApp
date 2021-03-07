const express=require("express");
const app=express();
const nodemailer=require("nodemailer");
const bodyParser=require("body-parser");
const cors=require("cors");
const smtpTransport=require("nodemailer-smtp-transport");

require("dotenv").config();

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res)=>{
    res.render("index");
})

const transporter = nodemailer.createTransport(smtpTransport({
  service:'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.pass
  }
}));
transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.post('/',(req, res, next) => {

    var email =req.body.email;
    var name=req.body.name;
    var message=req.body.message;
    var mail = {
        from:email,
        to:process.env.email,
        subject:'New connection message',
        html:`<h4>Name:${name}</h4><br><h5>Email:${req.body.email}</h5><br><p>Message:${message}</p>`,
        
    }
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Sent!");
      }
    })

    res.redirect("/");
  })

const PORT=process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`App is listening at ${PORT}`);
})