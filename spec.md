# Myhotols Marketplace

## Current State
- Booking flow: Guest Details → UPI Payment (full amount) → OTP → Confirmed
- Payment is simulated (no real gateway)
- Booking model has: id, userId, hotelId, roomId, guestName, guestPhone, checkIn, checkOut, totalPrice, status (confirmed/cancelled), createdAt
- Admin panel: tabs for pending approvals, all bookings, all users
- Owner dashboard: My Hotels, Add Hotel, Bookings
- No refund system, no partial payment, no payment history/tracking

## Requested Changes (Diff)

### Add
- **Split payment structure for customers**: When booking, customer pays ₹99 per guest as initial/token payment. Remaining balance is due at hotel check-in.
- **Multiple payment methods**: UPI (GPay, PhonePe, Paytm, BHIM), Net Banking, Debit/Credit Card (simulated)
- **Payment record**: Each booking tracks: initialAmountPaid (99 * guests), remainingAmount, paymentMethod, paymentStatus (partial_paid / fully_paid)
- **Refund simulation**: Admin can initiate refund on cancelled bookings. Owner can request refund for a booking. Customer sees refund status on their booking.
- **Customer Payment History page**: `/my-bookings` page showing all bookings with payment breakdown (initial paid, remaining due, refund status)
- **Admin Payments tab**: View all payment transactions, initiate refunds
- **Owner Earnings tab**: View earnings per booking, pending amounts, refund requests

### Modify
- **Booking model**: Add fields: guests (number), initialPaid (number), remainingDue (number), paymentMethod (string), paymentStatus ("partial" | "full" | "refunded")
- **BookingPage**: Add guest count input. Show payment split clearly: ₹99 x guests = initial payment now, remaining due at check-in. Payment method selector (UPI / Net Banking / Card).
- **BookingConfirmationPage**: Show payment breakdown: Initial Paid, Remaining Due at Check-in, Payment Method
- **AdminPage**: Add "Payments" tab with refund action per booking
- **OwnerDashboardPage**: Add "Earnings" tab showing revenue breakdown per booking
- **AppContext**: Update Booking type, addBooking, add refundBooking action

### Remove
- Nothing removed

## Implementation Plan
1. Update `Booking` type in AppContext to include: guests, initialPaid, remainingDue, paymentMethod, paymentStatus
2. Add `refundBooking` function to AppContext
3. Update `BookingPage`: add guest count, payment method selector (UPI/NetBanking/Card), show split payment summary (₹99 x guests initial, rest at check-in)
4. Update `BookingConfirmationPage`: show payment breakdown
5. Add `/my-bookings` page for customers (payment history, refund status)
6. Update `AdminPage`: add Payments tab with refund button
7. Update `OwnerDashboardPage`: add Earnings tab
8. Update seed bookings to include new fields
9. Add route for `/my-bookings` in App.tsx
