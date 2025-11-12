

// export const registeredCustomerAuth = (req, res, next) => {
//   if (req.customer) {
//     // Authenticated customer
//     req.customerType = 'registered';
//     req.customerId = req.customer.id;
//   } else {
//     // Guest user
//     const guestId = req.headers['x-guest-id'] || uuidv4(); // use header if sent, else generate
//     req.guestId = guestId;

//     req.customerType = 'guest';
//     req.customerId = null; // no id yet
//   }
//   next(); 
// };
