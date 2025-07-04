// Show booking page
router.get('/listings/:id/book', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }

  res.render('bookings/new', { listing });
});
