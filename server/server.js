const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;

const Users = require("./invoice/userModel.js");
const Customers = require("./invoice/custModel.js");
const Invoices = require("./invoice/invModel.js");
const FinTran = require("./invoice/finTranModel.js");
const InvLine = require("./invoice/invLineItemsModel.js");

const server = express();
server.use(bodyParser.json());
server.use(cors());

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/users")
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
 * CRUD for Users
 */

  let userName, email, hashPassword;

/**
 * Post Users
 */
server.post("/users", function(req, res) {
  const newCust = new Users(req.body);
  // do checks here to make sure the user has all the data
  if (
    newCust.userName === "" ||
    newCust.email === "" ||
    newCust.hashPassword === ""
  ) {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: "Could not create user due to missing fields" });
    return;
  } else {
    newCust.save(function(err, user) {
      if (err) {
        res
          .status(STATUS_SERVER_ERROR)
          .json({ error: "Could not create the user." });
      } else {
        res.status(201).json(user);
      }
    });
  }
});
/**
 * Update a User
 */
server.put('/users/:id', function(req, res) {
  const { dateAccountOpened, userName, email, hashPassword } = req.body;
  Users.findByIdAndUpdate(req.params.id,{$set:req.body}, function(err, users) {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ error: "Could not update user" });
    } else {
      res.status(200).json({ success: "User updated!"});
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
      res.status(200).json({ success: "User deleted!"});
    }
  });
});

/**
 * CRUD for Customers
 */

let custName, custPhoneNbr, custEmail, custStreetAddress, custCity, custState, custCountry, custZipCode;

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
server.put('/customers/:id', function(req, res) {
  const { custName, custPhoneNbr, custEmail, custStreetAddress, custCity, custState, custCountry, custZipCode } = req.body;
  Customers.findByIdAndUpdate(req.params.id,{$set:req.body}, function(err, customers) {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ error: "Could not update customer" });
    } else {
      res.status(200).json({ success: "Customer updated!"});
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
      res.status(STATUS_USER_ERROR).json({ error: "Could not retrieve customer" });
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
      res.status(STATUS_USER_ERROR).json({ error: "Could not delete customer" });
    } else {
      res.status(200).json({ success: "Customer deleted!"});
    }
  });
});

/**
 * CRUD for Invoices
 */

let customerId, usersId, invNumbers, invDate, invDueDate;

/**
 * Post Invoices
 */
server.post("/invoices", function(req, res) {
  const newInv = new Invoices(req.body);
  // do checks here to make sure the invoice has all the data
  if (
    newInv.customerId === "" ||
    newInv.usersId === "" ||
    newInv.invNumber === "" ||
    newInv.invDate === "" ||
    newInv.invDueDate === ""
  ) {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: "Could not create invoice due to missing fields" });
    return;
  } else {
    newInv.save(function(err, invoice) {
      if (err) {
        res
          .status(STATUS_SERVER_ERROR)
          .json({ error: "Could not create the invoice." });
      } else {
        res.status(201).json(invoice);
      }
    });
  }
});
/**
 * Update an Invoice
 */
server.put('/invoices/:id', function(req, res) {
  const { invNumber, invDate, invDueDate, invComments } = req.body
  Invoices.findByIdAndUpdate(req.params.id,{$set:req.body}, function(err, invoices) {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ error: "Could not update invoice" });
    } else {
      res.status(200).json({ success: "Invoice updated!"});
    }
  });
});
/**
 * Get all Invoices
 */
server.get("/invoices", function(req, res) {
  Invoices.find({}, function(err, invoices) {
    if (err) {
      res
        .status(STATUS_SERVER_ERROR)
        .json({ error: "Could not retrieve invoices" });
    } else {
      res.status(200).json(invoices);
    }
  });
});
/**
 * Get Invoices by _id
 */
server.get("/invoices/:id", function(req, res) {
  const { id } = req.params;
  Invoices.findById(id, function(err, invoices) {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ error: "Could not retrieve invoice" });
    } else {
      res.status(200).json(invoices);
    }
  });
});
/**
 * Delete Invoices by _id
 */
server.delete("/invoices/:id", function(req, res) {
  const { id } = req.params;
  Invoices.findByIdAndRemove(id, function(err, invoices) {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ error: "Could not delete invoice" });
    } else {
      res.status(200).json({ success: "Invoice deleted!"});
    }
  });
});

/**
 * CRUD for FinTran
 */

let invId, transDate, transSubtotal, transDisc, transTax, transShipping, transAmountPaid, transComment;

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
server.put('/fintran/:id', function(req, res) {
  const { transDate, transDisc, transTax, transShipping, transAmountPaid, transComment } = req.body;
  FinTran.findByIdAndUpdate(req.params.id,{$set:req.body}, function(err, fintran) {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ error: "Could not update transaction" });
    } else {
      res.status(200).json({ success: "Transaction updated!"});
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
      res.status(STATUS_USER_ERROR).json({ error: "Could not retrieve transaction" });
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
      res.status(STATUS_USER_ERROR).json({ error: "Could not delete transaction" });
    } else {
      res.status(200).json({ success: "Transaction deleted!"});
    }
  });
});

/**
 * CRUD for InvLine
 */

let itemName, itemQuantity, itemRate, invNotes;

/**
 * Post InvLine
 */
server.post("/invline", function(req, res) {
  const newInvLine = new InvLine(req.body);
  // do checks here to make sure the finTran has all the data
  if (
    newInvLine.invId === "" ||
    newInvLine.itemName === "" ||
    newInvLine.itemQuantity === "" ||
    newInvLine.itemRate === "" ||
    newInvLine.invNotes === ""
  ) {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: "Could not create line item due to missing fields" });
    return;
  } else {
    newInvLine.save(function(err, invline) {
      if (err) {
        res
          .status(STATUS_SERVER_ERROR)
          .json({ error: "Could not post line item" });
      } else {
        res.status(201).json(invline);
      }
    });
  }
});
/**
 * Update a InvLine
 */
server.put('/invline/:id', function(req, res) {
  const { itemName, itemQuantity, itemRate, invNotes } = req.body;
  InvLine.findByIdAndUpdate(req.params.id,{$set:req.body}, function(err, invline) {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ error: "Could not update line item" });
    } else {
      res.status(200).json({ success: "Line item updated!"});
    }
  });
});
/**
 * Get all Line items
 */
server.get("/invline", function(req, res) {
  InvLine.find({}, function(err, invline) {
    if (err) {
      res
        .status(STATUS_SERVER_ERROR)
        .json({ error: "Could not retrieve line items" });
    } else {
      res.status(200).json(invline);
    }
  });
});
/**
 * Get line item by _id
 */
server.get("/invline/:id", function(req, res) {
  const { id } = req.params;
  InvLine.findById(id, function(err, invline) {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ error: "Could not retrieve line item" });
    } else {
      res.status(200).json(invline);
    }
  });
});
/**
 * Delete line item by _id
 */
server.delete("/invline/:id", function(req, res) {
  const { id } = req.params;
  InvLine.findByIdAndRemove(id, function(err, invline) {
    if (err) {
      res.status(STATUS_USER_ERROR).json({ error: "Could not delete line item" });
    } else {
      res.status(200).json({ success: "Line item deleted!"});
    }
  });
});

