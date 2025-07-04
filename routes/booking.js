// routes/bookings.js
const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// Show booking form
router.get('/listings/:id/book', isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }
  res.render('bookings/new', { listing });
});

// Handle booking submission
router.post('/bookings/:listingId', isLoggedIn, async (req, res) => {
  const { listingId } = req.params;
  const { checkIn, checkOut } = req.body;

  if (new Date(checkIn) >= new Date(checkOut)) {
    req.flash('error', 'Check-out must be after check-in');
    return res.redirect(`/listings/${listingId}/book`);
  }

  const booking = new Booking({
    user: req.user._id,
    listing: listingId,
    checkIn,
    checkOut
  });

  await booking.save();
  req.flash('success', 'Booking request submitted!');
  res.redirect(`/listings/${listingId}`);
});

module.exports = router
