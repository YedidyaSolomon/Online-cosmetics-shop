# TODO: Implement "Make Payment" Logic with Stock Reservation and Restoration

## Steps to Complete

1. **Update StockReservation Model**: Add 'expired' to the status enum in models/stokeReservation.js. ✅

2. **Modify reserveStock Utility**: Change src/utils/stockReservation.js to implement reserveStock(productId, quantity, orderId) that creates a reservation and decrements product quantity. ✅

3. **Modify restoreStock Utility**: Update src/utils/restoreStock.js to implement restoreStock(productId, quantity, orderId) that increments product quantity and sets reservation status to 'released'. ✅

4. **Add isReservationExpired Utility**: In src/utils/stockReservationExpiry.js, add isReservationExpired(orderId) function that returns true if any active reservation for the order is expired. ✅

5. **Update makePaymentController.js**: Modify the checkOut function to loop over orderItems and call reserveStock(productId, quantity, orderId) for each item after creating the order. ✅

6. **Update recieveWebhookController.js**: In webhookResponse, before handling the event, call checkStockReservationExpiry(orderId). On success, set reservations to 'used'. On fail/cancel, call restoreStock for each reservation. ✅

7. **Ensure Async/Await and Error Handling**: Verify all functions use async/await and proper transaction handling. ✅

8. **Test the Implementation**: Run tests for payment initiation, webhook handling, and reservation expiry.
