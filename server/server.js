const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");
const stripe = require("stripe")("sk_test_K04zveK9MnFXMgiIxhHv6mIa");
const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;
const STATUS_UNAUTHORIZED_ERROR = 401;

const corsOptions = {
  origin: true,
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  preflightContinue: true,
  optionsSuccessStatus: 204,
  credentials: true // enable set cookie
};

const Users = require("./invoice/userModel.js");
const Invoices = require("./invoice/invModel.js");

const server = express();

server.use(bodyParser.urlencoded({ extended: false })); // added
server.use(bodyParser.json());
server.use(fileUpload({ limits: { fileSize: 400 * 1024 } }));
server.use(cors());
require("dotenv").config();
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI)
  // .connect("mongodb://localhost:27017/users")
  .then(function(db) {
    console.log("All your dbs belong to us!");
    server.listen(3001, function() {
      console.log("server running on port 3001");
    });
  })
  .catch(function(err) {
    console.log("DB connection failed..", err.message);
  });
/**
 * Middleware for token verification
 */

const verifyToken = (req, res, next) => {
  const tkn = req.get("Authorization");
  if (!tkn) {
    return res
      .status(STATUS_UNAUTHORIZED_ERROR)
      .json({ err: "You are not authorized to do this request" });
  }
  jwt.verify(tkn, process.env.SECRET, (err, decoded) => {
    if (err)
      return res
        .status(STATUS_UNAUTHORIZED_ERROR)
        .json({ err: "You are not authorized to do this request" });
    return next();
  });
};
/**
 * CRUD for Users - Users are who we bill for using our app
 */
let userName, email, hashPassword;
/**
 * Update a User
 */
server.put("/users/:id", function(req, res) {
  const { dateAccountOpened, userName, email, hashPassword } = req.body;
  Users.findByIdAndUpdate(req.params.id, { $set: req.body }, function(
    err,
    users
  ) {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ error: "Could not update user" });
    } else {
      res.status(200).json({ success: "User updated!" });
    }
  });
});
/**
 * Get all Users
 */
server.get("/users", function(req, res) {
  Users.find({}, function(err, users) {
    if (err) {
      res
        .status(STATUS_SERVER_ERROR)
        .json({ error: "Could not retrieve users" });
    } else {
      res.status(200).json(users);
    }
  });
});
/**
 * Get Users by _id
 */
server.get("/users/:id", function(req, res) {
  const { id } = req.params;
  Users.findById(id, function(err, users) {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ error: "Could not retrieve user" });
    } else {
      res.status(200).json(users);
    }
  });
});
/**
 * Delete Users by _id
 */
server.delete("/users/:id", function(req, res) {
  const { id } = req.params;
  Users.findByIdAndRemove(id, function(err, users) {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ error: "Could not delete user" });
    } else {
      res.status(200).json({ success: "User deleted!" });
    }
  });
});
/**
 * CRUD for Invoices
 */
let userId,
  invCustomerAddress,
  invNumber,
  invDate,
  invDueDate,
  invBillableItems,
  invDiscount,
  invTax,
  invDeposit,
  invShipping,
  invComment,
  invTerms,
  invPaidFor;
/**
 * Get All Invoices
 */
server.get("/invoices", verifyToken, (req, res) => {
  const userId = req.query.userId;
  Invoices.find({ usersId: userId }, (err, invoices) => {
    if (err) {
      return res
        .status(STATUS_SERVER_ERROR)
        .json({ error: "Could not retrieve invoices" });
    }
    return res.status(200).json(invoices);
  });
});
// /**
//  * Post Invoices
//  */
server.post("/new", (req, res) => {
  const userId = req.query.userId;
  const tkn = req.get("Authorization");
  const {
    invCustomerAddress,
    invNumber,
    invNumberExtension,
    invDate,
    invDueDate,
    invBillableItems,
    invDiscount,
    invTax,
    invDeposit,
    invShipping,
    invComment,
    invTerms,
    invPaidFor
  } = req.body;
  if (!invNumber) {
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "Could not create invoice due to missing fields" });
  }
  const newInv = new Invoices({
    usersId: userId,
    invCustomerAddress,
    invNumber,
    invNumberExtension,
    invDate,
    invDueDate,
    invBillableItems,
    invDiscount,
    invTax,
    invDeposit,
    invShipping,
    invComment,
    invTerms,
    invPaidFor
  });
  newInv.save((err, invoice) => {
    if (err) {
      console.log(err);
      return res
        .status(STATUS_SERVER_ERROR)
        .json({ error: "Could not create the invoice." });
    }
    Users.findById(userId, (err, user) => {
      if (err) {
        return res
          .status(STATUS_SERVER_ERROR)
          .json({ err: "Couldn't find user" });
      }
      user.currentInvoiceNumber += 1;
      user.save((err, updatedUser) => {
        if (err) {
          return res
            .status(STATUS_SERVER_ERROR)
            .json({ err: "Couldn't save current Invoice Number" });
        }
        res.status(201).send({ invoiceId: invoice._id });
      });
    });
  });
});
/**
 * Update an Invoice
 */
server.put("/invoice/:id", verifyToken, (req, res) => {
  const invoiceId = req.query.invoiceId;
  const invCustomerAddress = req.body.customerAddress;
  const invNumber = req.body.invoiceNumber;
  const invNumberExtension = req.body.invoiceNumberExtension;
  const invDate = req.body.invoiceDate;
  const invDueDate = req.body.dueDate;
  const invBillableItems = req.body.billableItems;
  const invDiscount = req.body.dicsount;
  const invTax = req.body.tax;
  const invDeposit = req.body.deposit;
  const invShipping = req.body.shipping;
  const invComment = req.body.notes;
  const invTerms = req.body.terms;
  const invPaidFor = req.body.paidInvoice;
  Invoices.findByIdAndUpdate(invoiceId, (err, invoice) => {
    if (err) {
      return res
        .status(STATUS_USER_ERROR)
        .json({ error: "Could not update invoice" });
    }
    (invoice.invCustomerAddress = invCustomerAddress),
      (invoice.invNumber = invNumber),
      (invoice.invNumberExtension = invoiceNumberExtension);
    (invoice.invDate = invDate),
      (invoice.invDueDate = invDueDate),
      (invoice.invBillableItems = invBillableItems),
      (invoice.invDiscount = invDiscount),
      (invoice.invTax = invTax),
      (invoice.invDeposit = invDeposit),
      (invoice.invShipping = invShipping),
      (invoice.invComment = invComment),
      (invoice.invTerms = invTerms),
      (invoice.invPaidFor = invPaidFor);
    invoice.save((err, updatedInvoice) => {
      if (err) {
        return res.status(STATUS_SERVER_ERROR);
        json({ err: "couldn't save changes" });
      }
      // res.status(200).json({ success: "Invoice updated!" });
      res.status(200).json(updatedInvoice);
    });
  });
});
/**
 * Get Invoices by _id
 */
server.get("/invoice", verifyToken, (req, res) => {
  const invoiceId = req.query.invoiceId;
  // const tkn = req.get("Authorization");
  Invoices.findById(invoiceId, (err, invoice) => {
    if (err) {
      return res
        .status(STATUS_USER_ERROR)
        .json({ error: "Could not retrieve invoice" });
    }
    res.status(200).json(invoice);
  });
});
/**
 * Delete Invoices by _id
 */
server.delete("/invoices", verifyToken, (req, res) => {
  const invoiceId = req.query.invoiceId;
  Invoices.findByIdAndRemove(invoiceId, (err, invoices) => {
    if (err) {
      return res
        .status(STATUS_SERVER_ERROR)
        .json({ error: "Could not delete invoice" });
    }
    res.status(200).json({ message: "Invoice deleted!" });
  });
});

/**
 * User authentication endpoints
 */
/**
 * Middleware for password hashing
 */
const BCRYPT_COST = 11;
const hashedPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "Password can't be blank" });
  }
  bcrypt
    .hash(password, BCRYPT_COST)
    .then(pw => {
      req.password = pw;
      next();
    })
    .catch(err => {
      throw new Error("The password wasn't hashed");
    });
};
/**
 * Create a new user
 */
server.post("/new-user", hashedPassword, (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(STATUS_USER_ERROR).json({ error: "Email is required" });
  }
  // since our users can disable js on the client
  // and email address serves as a unique username
  // this validation will be enough
  const isEmailValid = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  if (!isEmailValid.test(email)) {
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "The Email Address is in an invalid format." });
  }
  const hashPassword = req.password;
  const newUser = new Users({ email, hashPassword });
  newUser.save((err, savedUser) => {
    if (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "This email is already taken" });
      }
      return res
        .status(STATUS_SERVER_ERROR)
        .json({ error: "User wasn't saved to the database" });
    }
    const token = jwt.sign({ id: savedUser._id }, process.env.SECRET);
    res.status(200).send({ token, userId: savedUser._id });
  });
});
/**
 * User Login
 */
server.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "Email can't be blank" });
  }
  if (!password) {
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "Password can't be blank" });
  }
  Users.findOne({ email }, (err, user) => {
    if (err || user === null) {
      return res
        .status(STATUS_SERVER_ERROR)
        .json({ error: "Incorrect email/password combination" });
    }
    const hashedPw = user.hashPassword;
    bcrypt
      .compare(password, hashedPw)
      .then(response => {
        if (!response) throw new Error("Password hashes weren't compared");
      })
      .then(() => {
        const token = jwt.sign({ id: user._id }, process.env.SECRET);
        res.status(200).send({ token, userId: user._id });
      })
      .catch(error => {
        res
          .status(STATUS_SERVER_ERROR)
          .json({ error: "Incorrect creditentials" });
      });
  });
});
/**
 * Token validation for the front-end
 */
server.get("/jwt", (req, res) => {
  const tkn = req.get("Authorization");
  if (!tkn)
    return res.status(STATUS_UNAUTHORIZED_ERROR).json({ authenticated: false });
  jwt.verify(tkn, process.env.SECRET, (err, decoded) => {
    if (err)
      return res
        .status(STATUS_UNAUTHORIZED_ERROR)
        .json({ authenticated: false });
    res.status(200).json({ authenticated: true });
  });
});

/**
 * Stripe
 */

server.post("/api/checkout", (req, res) => {
  console.log("checkout starting...");
  const { token, sub, one } = req.body;

  const amount = sub ? "999" : "99";
  if (!token) return res.json({ err: "Payment Failed" });
  stripe.charges.create(
    {
      amount: amount,
      currency: "usd",
      description: "Example charge",
      source: token
    },
    (err, charge) => {
      if (err) return res.json({ err: "Payment Failed", error: err });
      res.send(charge);
    }
  );
});

/**
 * Logo uploading
 */
server.put("/upload", verifyToken, (req, res) => {
  const imageFile = req.files.logo;

  if (imageFile.truncated) {
    return res
      .status(413)
      .json({ err: "Your image size exceeds max limit of 0.4mb" });
  }

  const supportedMimeTypes = ["image/jpeg", "image/png"];
  const contentType = imageFile.mimetype;
  if (supportedMimeTypes.indexOf(contentType) === -1) {
    return res.status(STATUS_USER_ERROR).json({
      err: "You are permitted to upload the following image types jpeg and png"
    });
  }

  const userId = req.query.userId;
  Users.findById(userId, (err, user) => {
    if (err) {
      return res
        .status(STATUS_SERVER_ERROR)
        .json({ err: "Couldn't find user" });
    }
    const binaryData = imageFile.data.toString("base64");
    const logo = { binaryData, contentType };
    user.logo = logo;
    user.save((err, updatedUser) => {
      if (err) {
        return res
          .status(STATUS_SERVER_ERROR)
          .json({ err: "Couldn't save changes" });
      }
      res.status(200).json(updatedUser.logo);
    });
  });
});

/**
 * Get logo and company name
 */

server.get("/logo", verifyToken, (req, res) => {
  const userId = req.query.userId;
  Users.findById(userId, (err, user) => {
    if (err) {
      return res
        .status(STATUS_SERVER_ERROR)
        .json({ err: "Couldn't find user" });
    }
    const userLogo = user.logo;
    if (!userLogo.contentType) {
      return res.status(200).json({ message: "Logo is not selected" });
    }
    const companyName = user.companyName;
    const companyAddress = user.companyAddress;
    const currentInvoiceNumber = user.currentInvoiceNumber;
    res
      .status(200)
      .json({ userLogo, companyName, companyAddress, currentInvoiceNumber });
  });
});

/**
 * Company name update
 */

server.put("/company-name", verifyToken, (req, res) => {
  const userId = req.query.userId;
  const companyName = req.body.companyName;
  Users.findById(userId, (err, user) => {
    if (err) {
      return res
        .status(STATUS_SERVER_ERROR)
        .json({ err: "Couldn't find user" });
    }
    user.companyName = companyName;
    user.save((err, updatedUser) => {
      if (err) {
        return res
          .status(STATUS_SERVER_ERROR)
          .json({ err: "Couldn't save changes" });
      }
      res.status(200).json(updatedUser.companyName);
    });
  });
});

/**
 * Company address update
 */

server.put("/company-address", verifyToken, (req, res) => {
  const userId = req.query.userId;
  const companyAddress = req.body.companyAddress;
  Users.findById(userId, (err, user) => {
    if (err) {
      return res
        .status(STATUS_SERVER_ERROR)
        .json({ err: "Couldn't find user" });
    }
    user.companyAddress = companyAddress;
    user.save((err, updatedUser) => {
      if (err) {
        return res
          .status(STATUS_SERVER_ERROR)
          .json({ err: "Couldn't save changes" });
      }
      res.status(200).json(updatedUser.companyAddress);
    });
  });
});

/**
 * Current invoice number update
 */

server.put("/invoice-number", verifyToken, (req, res) => {
  const userId = req.query.userId;
  const currentInvoiceNumber = req.body.invoiceNumber;
  Users.findById(userId, (err, user) => {
    if (err) {
      return res
        .status(STATUS_SERVER_ERROR)
        .json({ err: "Couldn't find user" });
    }
    user.currentInvoiceNumber = currentInvoiceNumber;
    user.save((err, updatedUser) => {
      if (err) {
        return res
          .status(STATUS_SERVER_ERROR)
          .json({ err: "Couldn't save changes" });
      }
      res.status(200).json(updatedUser.currentInvoiceNumber);
    });
  });
});
