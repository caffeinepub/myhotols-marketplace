# Myhotols Marketplace

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Homepage with hero search bar (city, check-in, check-out, guests), featured hotels grid, popular cities section, "why choose us" section, footer
- Hotel Listing Page with filters (price, rating, amenities) and hotel cards
- Hotel Detail Page with images, room types, amenities, reviews, booking button
- Simple Booking Flow: name + phone input, total price display, fake UPI payment, confirmation page
- Role-based access: Customer, Hotel Owner, Admin
- Hotel Owner Dashboard: add hotel, add rooms, view bookings
- Admin Panel: approve/reject hotels, view total bookings
- Reviews System: 1-5 star rating + text review per hotel

### Modify
- N/A

### Remove
- No Stripe integration
- No real payment gateway
- No complex auth

## Implementation Plan
1. Backend: Users (with roles), Hotels, Rooms, Bookings, Reviews data models
2. Backend APIs: CRUD for hotels/rooms, create booking, submit review, admin approve/reject hotel
3. Frontend: Homepage, Hotel Listing, Hotel Detail, Booking Flow, Owner Dashboard, Admin Panel
4. Auth: Simple login/register with role selection (customer/hotel owner)
5. Design: Orange (#E58A1F) primary color, mobile-first, clean modern UI
