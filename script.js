// Initialize seat layout
const totalSeats = 80;
const seatsPerRow = 7;
const lastRowSeats = 3;
const coach = document.getElementById('coach');
const message = document.getElementById('message');
const bookedSeatsMessage = document.getElementById('bookedSeatsMessage');

// Create seat layout (7 seats per row, last row has 3 seats)
const seatLayout = [];
for (let i = 0; i < totalSeats; i++) {
  seatLayout.push({
    seatNumber: i + 1,
    booked: false
  });
}

// Render seats in the coach
function renderSeats() {
  coach.innerHTML = '';
  seatLayout.forEach((seat, index) => {
    const seatDiv = document.createElement('div');
    seatDiv.classList.add('seat');
    seatDiv.innerText = seat.seatNumber;
    if (seat.booked) {
      seatDiv.classList.add('booked');
    }
    coach.appendChild(seatDiv);
  });
}

// Book seats based on the number input by the user
document.getElementById('bookSeats').addEventListener('click', () => {
  const seatNumberInput = document.getElementById('seatNumber').value;
  const seatsToBook = parseInt(seatNumberInput);

  if (isNaN(seatsToBook) || seatsToBook < 1 || seatsToBook > 7) {
    message.textContent = "Please enter a valid number of seats (1-7)";
    bookedSeatsMessage.textContent = "";
    return;
  }

  // Find a row where all seats are available
  const availableRow = findAvailableRow(seatsToBook);

  if (availableRow.length > 0) {
    // Book the seats
    availableRow.forEach(index => seatLayout[index].booked = true);
    renderSeats();
    message.textContent = `${seatsToBook} seat(s) successfully reserved.`;
    bookedSeatsMessage.textContent = `Your booked seats: ${availableRow.map(index => seatLayout[index].seatNumber).join(", ")}`;
  } else {
    // Find nearest available seats
    const nearestSeats = findNearestAvailableSeats(seatsToBook);
    if (nearestSeats.length > 0) {
      nearestSeats.forEach(index => seatLayout[index].booked = true);
      renderSeats();
      message.textContent = `${seatsToBook} seat(s) successfully reserved.`;
      bookedSeatsMessage.textContent = `Your booked seats: ${nearestSeats.map(index => seatLayout[index].seatNumber).join(", ")}`;
    } else {
      message.textContent = "Not enough seats available together.";
      bookedSeatsMessage.textContent = "";
    }
  }
});

// Find available row with enough seats
function findAvailableRow(seatsToBook) {
  for (let i = 0; i < seatLayout.length; i += seatsPerRow) {
    const row = seatLayout.slice(i, i + seatsPerRow);
    if (row.filter(seat => !seat.booked).length >= seatsToBook) {
      return row.filter(seat => !seat.booked).slice(0, seatsToBook).map(seat => seatLayout.indexOf(seat));
    }
  }
  return [];
}

// Find nearest available seats (non-contiguous)
function findNearestAvailableSeats(seatsToBook) {
  return seatLayout
    .filter(seat => !seat.booked)
    .slice(0, seatsToBook)
    .map(seat => seatLayout.indexOf(seat));
}

// Initial render
renderSeats();
