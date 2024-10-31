let allRooms = [];
function fetchData(callback) {
    fetch("https://6720c26d98bbb4d93ca5d871.mockapi.io/midterm/t_room")
        .then(response => response.json())
        .then(data => {
            allRooms = data;
            callback(data);
        })
        .catch(error => console.error("Error fetching room data:", error));
}

function displayRooms(data) {
    const roomContainer = document.getElementById("room-container");
    roomContainer.innerHTML = '';

    data.forEach(room => {
        const roomElement = document.createElement("div");
        roomElement.classList.add("room-card");

        roomElement.innerHTML = `
            <img src="${room.image}" alt="${room.roomType}">
            <div class="room-info">
                <h3>${room.roomType}</h3>
                <p>Price: $${Math.floor(room.price)}/night</p>
                <p>Rating: ${room.star} ⭐</p>
                <p>${room.description}</p>

                <button class="booking-btn">Book Now</button>
            </div>
        `;
        roomElement.addEventListener("click", () => openRoomDetailPopup(room));
        
        const bookingButton = roomElement.querySelector(".booking-btn");
        bookingButton.addEventListener("click", (event) => {
            event.stopPropagation(); 
            showBookingPopup(room); 
        });
        
        roomContainer.appendChild(roomElement);
    });
}

fetchData(displayRooms);



//Filter rooms by type
function searchRoomByType(roomType) {
    const filteredRooms = allRooms.filter(room => 
        room.roomType.toLowerCase() === roomType.toLowerCase()
    );
    displayRooms(filteredRooms);
}

document.getElementById('searchButton').addEventListener('click', function() {
    const selectedRoomType = document.getElementById('roomTypeSelect').value;

    if (selectedRoomType) {
        searchRoomByType(selectedRoomType);
    } else {
        displayRooms(allRooms); 
    }
});

//Clear filter
document.getElementById('clearFilterButton').addEventListener('click', function() {
    // Xóa giá trị lựa chọn trong phần roomType
    document.getElementById('roomTypeSelect').value = '';
    
    // Hiển thị lại tất cả các phòng
    displayRooms(allRooms);
});



//slide banner
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

showSlide(currentSlide);
setInterval(nextSlide, 3000);

//Display detail popup
function openRoomDetailPopup(room) {
    document.getElementById("popupImage").src = room.image;
    document.getElementById("popupRoomType").innerText = room.roomType;
    document.getElementById("popupPrice").innerText = `Price: $${Math.floor(room.price)}/night`;
    document.getElementById("popupRating").innerText = `Rating: ${room.star} ⭐`;
    document.getElementById("popupDescription").innerText = room.description;

    document.getElementById("roomDetailPopup").style.display = "flex";
}

function closeRoomDetailPopup() {
    document.getElementById("roomDetailPopup").style.display = "none";
}

// Display booking popup
function showBookingPopup(room) {
    document.getElementById("roomTypeBooking").value = room.roomType; 
    document.getElementById("checkinDateBooking").value = ""; 
    document.getElementById("checkoutDateBooking").value = ""; 
    document.getElementById("adults").value = 1;
    document.getElementById("children").value = 0;

    document.getElementById('roomDetailPopup').style.display = 'none';
    document.getElementById('bookingPopup').style.display = 'flex';
}

document.querySelector('.booking-btn').addEventListener('click', function() {
    const roomType = document.getElementById("popupRoomType").innerText; 
    showBookingPopup({ roomType }); 
});

function closeBookingPopup() {
    document.getElementById('bookingPopup').style.display = 'none';
}


// submit booking form
document.getElementById("bookingForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const roomType = document.getElementById("roomTypeBooking").value;
    const adults = parseInt(document.getElementById("adults").value);
    const children = parseInt(document.getElementById("children").value);
    const checkInDate = document.getElementById("checkinDateBooking").value;
    const checkOutDate = document.getElementById("checkoutDateBooking").value;

    const bookingData = {
        roomType: roomType,
        adult: adults,
        children: children,
        checkIn: checkInDate,
        checkOut: checkOutDate
    };

    fetch("https://6720ca8c98bbb4d93ca60b37.mockapi.io/midterm/t_booking", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Booking successfully saved:", data);
        alert("Booking has been successfully saved!");
        closeBookingPopup(); 
    })
    .catch(error => {
        console.error("Error saving booking:", error);
        alert("An error occurred while saving the booking. Please try again.");
    });
});

// Function to show the guest and billing popup
function showGuestBillingPopup() {
    document.getElementById('bookingPopup').style.display = 'none';
    document.getElementById('guestBillingPopup').style.display = 'flex';

    document.getElementById('arrivalDate').innerText = document.getElementById('checkinDateBooking').value;
    document.getElementById('departureDate').innerText = document.getElementById('checkoutDateBooking').value;
    document.getElementById('billingRoomType').innerText = document.getElementById('roomTypeBooking').value;
    document.getElementById('guestCount').innerText = `${document.getElementById('adults').value} Adults, ${document.getElementById('children').value} Children`;
    document.getElementById('totalCost').innerText = '$1000'; 
}

function closeGuestBillingPopup() {
    document.getElementById('guestBillingPopup').style.display = 'none';
}

document.getElementById("bookingForm").addEventListener("submit", function(event) {
    event.preventDefault();
    showGuestBillingPopup();
});

//submit guest and billing information
document.querySelector('.submit-btn').addEventListener('click', function(e) {
    e.preventDefault(); 
    
    const firstName = document.querySelector('input[name="firstName"]').value;
    const lastName = document.querySelector('input[name="lastName"]').value;
    const number = document.querySelector('input[name="number"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const addressLine1 = document.querySelector('input[name="addressLine1"]').value;
    const addressLine2 = document.querySelector('input[name="addressLine2"]').value;
    const specialRequest = document.querySelector('input[name="specialRequest"]').value;

    const guestData = {
        firstName: firstName,
        lastName: lastName,
        number: number,
        email: email,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        specialRequest: specialRequest
    };

    fetch('https://6720c26d98bbb4d93ca5d871.mockapi.io/midterm/t_guest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(guestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Guest information saved successfully!');
        closeGuestBillingPopup()
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to save guest information. Please try again.');
    });
});


document.querySelector('.submit-btn').addEventListener('click', function(e) {
    e.preventDefault(); 
    
    const arrival = document.getElementById('arrivalDate').innerText;
    const departure = document.getElementById('departureDate').innerText;
    const roomType = document.getElementById('billingRoomType').innerText;
    const guest = document.getElementById('guestCount').innerText;
    const total = document.getElementById('totalCost').innerText.replace('$', ''); 

    const billingData = {
        arrival: arrival,
        departure: departure,
        roomType: roomType,
        guest: guest,
        total: parseFloat(total)
    };

    fetch('https://6720ca8c98bbb4d93ca60b37.mockapi.io/midterm/t_billing', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(billingData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save billing information');
        }
        return response.json();
    })
    .then(data => {
        console.log('Billing information saved successfully:', data);
        alert('Billing information saved successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to save billing information. Please try again.');
    });
});
