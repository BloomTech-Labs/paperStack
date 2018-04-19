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

const Users = require("./server/invoice/userModel.js");
const Customers = require("./server/invoice/custModel.js");
const Invoices = require("./server/invoice/invModel.js");
const FinTran = require("./server/invoice/finTranModel.js");
const InvLine = require("./server/invoice/invLineItemsModel.js");

const server = express();

server.use(express.static(path.resolve(__dirname, "./client/build")));
server.use(bodyParser.urlencoded({ extended: false })); // added
server.use(bodyParser.json());
server.use(fileUpload({ limits: { fileSize: 400 * 1024 } }));
server.use(cors());
require("dotenv").config();
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI)
  //.connect('mongodb://localhost:27017/users')
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
 * CRUD for Customers - customers belong to users, they are the recipients of the invoices that our app creates
 */
let custName,
  custPhoneNbr,
  custEmail,
  custStreetAddress,
  custCity,
  custState,
  custCountry,
  custZipCode;
/**
 * Post Customers
 */
server.post("/customers", function(req, res) {
  const newCust = new Customers(req.body);
  // do checks here to make sure the customer has all the data
  if (
    newCust.custName === "" ||
    newCust.custPhoneNbr === "" ||
    newCust.custEmail === "" ||
    newCust.custStreetAddress === "" ||
    newCust.custCity === "" ||
    newCust.custState === "" ||
    newCust.custCountry === "" ||
    newCust.custZipCode === ""
  ) {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: "Could not create customer due to missing fields" });
    return;
  } else {
    newCust.save(function(err, customer) {
      if (err) {
        res
          .status(STATUS_SERVER_ERROR)
          .json({ error: "Could not create the customer." });
      } else {
        res.status(201).json(customer);
      }
    });
  }
});
/**
 * Update a Customer
 */
server.put("/customers/:id", function(req, res) {
  const {
    custName,
    custPhoneNbr,
    custEmail,
    custStreetAddress,
    custCity,
    custState,
    custCountry,
    custZipCode
  } = req.body;
  Customers.findByIdAndUpdate(req.params.id, { $set: req.body }, function(
    err,
    customers
  ) {
    if (err) {
      res
        .status(STATUS_USER_ERROR)
        .json({ error: "Could not update customer" });
    } else {
      res.status(200).json({ success: "Customer updated!" });
    }
  });
});
/**
 * Get all Customers
 */
server.get("/customers", function(req, res) {
  Customers.find({}, function(err, customers) {
    if (err) {
      res
        .status(STATUS_SERVER_ERROR)
        .json({ error: "Could not retrieve customers" });
    } else {
      res.status(200).json(customers);
    }
  });
});
/**
 * Get Customers by _id
 */
server.get("/customers/:id", function(req, res) {
  const { id } = req.params;
  Customers.findById(id, function(err, customers) {
    if (err) {
      res
        .status(STATUS_USER_ERROR)
        .json({ error: "Could not retrieve customer" });
    } else {
      res.status(200).json(customers);
    }
  });
});
/**
 * Delete Customers by _id
 */
server.delete("/customers/:id", function(req, res) {
  const { id } = req.params;
  Customers.findByIdAndRemove(id, function(err, customers) {
    if (err) {
      res
        .status(STATUS_USER_ERROR)
        .json({ error: "Could not delete customer" });
    } else {
      res.status(200).json({ success: "Customer deleted!" });
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
  invTerms;

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
    invDate,
    invDueDate,
    invBillableItems,
    invDiscount,
    invTax,
    invDeposit,
    invShipping,
    invComment,
    invTerms
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
    invDate,
    invDueDate,
    invBillableItems,
    invDiscount,
    invTax,
    invDeposit,
    invShipping,
    invComment,
    invTerms
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
server.put("/invoices/:id", function(req, res) {
  const {
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
    invTerms
  } = req.body;
  Invoices.findByIdAndUpdate(req.params.id, { $set: req.body }, function(
    err,
    invoices
  ) {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ error: "Could not update invoice" });
    } else {
      res.status(200).json({ success: "Invoice updated!" });
    }
  });
});
/**
 * Get Invoices by _id
 */
server.get("/invoices/:id", function(req, res) {
  const id = req.query.id;
  Invoices.findById(id, function(err, invoices) {
    if (err) {
      res
        .status(STATUS_USER_ERROR)
        .json({ error: "Could not retrieve invoice" });
    } else {
      res.status(200).json(invoices);
    }
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
 * CRUD for FinTran
 */
let invId,
  transDate,
  transSubtotal,
  transDisc,
  transTax,
  transShipping,
  transAmountPaid,
  transComment;
/**
 * Post FinTran
 */
server.post("/fintran", function(req, res) {
  const newFinTran = new FinTran(req.body);
  // do checks here to make sure the finTran has all the data
  if (
    newFinTran.usersId === "" ||
    newFinTran.invId === "" ||
    newFinTran.transDate === "" ||
    newFinTran.transSubtotal === "" ||
    newFinTran.transDisc === "" ||
    newFinTran.transTax === "" ||
    newFinTran.transShipping === "" ||
    newFinTran.transAmountPaid === "" ||
    newFinTran.transComment === ""
  ) {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: "Could not create transaction due to missing fields" });
    return;
  } else {
    newFinTran.save(function(err, fintran) {
      if (err) {
        res
          .status(STATUS_SERVER_ERROR)
          .json({ error: "Could not finalize transaction" });
      } else {
        res.status(201).json(fintran);
      }
    });
  }
});
/**
 * Update a FinTran
 */
server.put("/fintran/:id", function(req, res) {
  const {
    transDate,
    transDisc,
    transTax,
    transShipping,
    transAmountPaid,
    transComment
  } = req.body;
  FinTran.findByIdAndUpdate(req.params.id, { $set: req.body }, function(
    err,
    fintran
  ) {
    if (err) {
      res
        .status(STATUS_USER_ERROR)
        .json({ error: "Could not update transaction" });
    } else {
      res.status(200).json({ success: "Transaction updated!" });
    }
  });
});
/**
 * Get all FinTran
 */
server.get("/fintran", function(req, res) {
  FinTran.find({}, function(err, fintran) {
    if (err) {
      res
        .status(STATUS_SERVER_ERROR)
        .json({ error: "Could not retrieve transactions" });
    } else {
      res.status(200).json(fintran);
    }
  });
});
/**
 * Get FinTran by _id
 */
server.get("/fintran/:id", function(req, res) {
  const { id } = req.params;
  FinTran.findById(id, function(err, fintran) {
    if (err) {
      res
        .status(STATUS_USER_ERROR)
        .json({ error: "Could not retrieve transaction" });
    } else {
      res.status(200).json(fintran);
    }
  });
});
/**
 * Delete FinTran by _id
 */
server.delete("/fintran/:id", function(req, res) {
  const { id } = req.params;
  FinTran.findByIdAndRemove(id, function(err, fintran) {
    if (err) {
      res
        .status(STATUS_USER_ERROR)
        .json({ error: "Could not delete transaction" });
    } else {
      res.status(200).json({ success: "Transaction deleted!" });
    }
  });
});
// /**
//  * CRUD for InvLine
//  */
// let itemName, itemQuantity, itemRate, invNotes;
// /**
//  * Post InvLine
//  */
// server.post("/invline", function(req, res) {
//   const newInvLine = new InvLine(req.body);
//   // do checks here to make sure the finTran has all the data
//   if (
//     newInvLine.invId === "" ||
//     newInvLine.itemName === "" ||
//     newInvLine.itemQuantity === "" ||
//     newInvLine.itemRate === "" ||
//     newInvLine.invNotes === ""
//   ) {
//     res
//       .status(STATUS_USER_ERROR)
//       .json({ error: "Could not create line item due to missing fields" });
//     return;
//   } else {
//     newInvLine.save(function(err, invline) {
//       if (err) {
//         res
//           .status(STATUS_SERVER_ERROR)
//           .json({ error: "Could not post line item" });
//       } else {
//         res.status(201).json(invline);
//       }
//     });
//   }
// });
// /**
//  * Update a InvLine
//  */
// server.put("/invline/:id", function(req, res) {
//   const { itemName, itemQuantity, itemRate, invNotes } = req.body;
//   InvLine.findByIdAndUpdate(req.params.id, { $set: req.body }, function(
//     err,
//     invline
//   ) {
//     if (err) {
//       res
//         .status(STATUS_USER_ERROR)
//         .json({ error: "Could not update line item" });
//     } else {
//       res.status(200).json({ success: "Line item updated!" });
//     }
//   });
// });
// /**
//  * Get all Line items
//  */
// server.get("/invline", function(req, res) {
//   InvLine.find({}, function(err, invline) {
//     if (err) {
//       res
//         .status(STATUS_SERVER_ERROR)
//         .json({ error: "Could not retrieve line items" });
//     } else {
//       res.status(200).json(invline);
//     }
//   });
// });
// /**
//  * Get line item by _id
//  */
// server.get("/invline/:id", function(req, res) {
//   const { id } = req.params;
//   InvLine.findById(id, function(err, invline) {
//     if (err) {
//       res
//         .status(STATUS_USER_ERROR)
//         .json({ error: "Could not retrieve line item" });
//     } else {
//       res.status(200).json(invline);
//     }
//   });
// });
// /**
//  * Delete line item by _id
//  */
// server.delete("/invline/:id", function(req, res) {
//   const { id } = req.params;
//   InvLine.findByIdAndRemove(id, function(err, invline) {
//     if (err) {
//       res
//         .status(STATUS_USER_ERROR)
//         .json({ error: "Could not delete line item" });
//     } else {
//       res.status(200).json({ success: "Line item deleted!" });
//     }
//   });
// });
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
  const { token, sub, one, email } = req.body;

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

/**
 * Change User Password
 */

server.put("/new-password", verifyToken, (req, res) => {
  const userId = req.query.userId;
  const { oldpassword, newpassword } = req.body;
  Users.findById(userId, (err, user) => {
    if (err) {
      return res
        .status(STATUS_SERVER_ERROR)
        .json({ err: "Couldn't find user" });
    }
    const hashedPw = user.hashPassword;
    bcrypt
      .compare(oldpassword, hashedPw)
      .then(response => {
        if (!response) throw new Error("Password hashes weren't compared");
      })
      .then(() => {
        bcrypt
          .hash(newpassword, BCRYPT_COST)
          .then(pw => {
            user.hashPassword = pw;
            user.save((err, updatedUser) => {
              if (err) {
                return res
                  .status(STATUS_SERVER_ERROR)
                  .json({ err: "Couldn't save changes" });
              }
              res.status(200).json({ message: "The password was changed" });
            });
          })
          .catch(err => {
            throw new Error("The password wasn't hashed");
          });
      })
      .catch(error => {
        res
          .status(STATUS_SERVER_ERROR)
          .json({ error: "Incorrect creditentials" });
      });
  });
});
