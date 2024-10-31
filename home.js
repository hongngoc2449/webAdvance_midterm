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



//search
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
        displayRooms(allRooms); // Hiển thị tất cả phòng nếu không chọn gì
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

// Hàm mở popup chi tiết phòng
function openRoomDetailPopup(room) {
    document.getElementById("popupImage").src = room.image;
    document.getElementById("popupRoomType").innerText = room.roomType;
    document.getElementById("popupPrice").innerText = `Price: $${Math.floor(room.price)}/night`;
    document.getElementById("popupRating").innerText = `Rating: ${room.star} ⭐`;
    document.getElementById("popupDescription").innerText = room.description;

    document.getElementById("roomDetailPopup").style.display = "flex";
}

// Hàm đóng popup
function closeRoomDetailPopup() {
    document.getElementById("roomDetailPopup").style.display = "none";
}

// Hiển thị popup booking
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


// Xử lý sự kiện khi form được submit
document.getElementById("bookingForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const roomType = document.getElementById("roomTypeBooking").value;
    const adults = parseInt(document.getElementById("adults").value);
    const children = parseInt(document.getElementById("children").value);
    const checkInDate = document.getElementById("checkinDateBooking").value;
    const checkOutDate = document.getElementById("checkoutDateBooking").value;

    const checkInTimestamp = new Date(checkInDate).getTime() / 1000;
    const checkOutTimestamp = new Date(checkOutDate).getTime() / 1000;

    const bookingData = {
        roomType: roomType,
        adult: adults,
        children: children,
        checkIn: checkInTimestamp,
        checkOut: checkOutTimestamp
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

    // Set billing information here based on previous booking data
    document.getElementById('arrivalDate').innerText = document.getElementById('checkinDateBooking').value;
    document.getElementById('departureDate').innerText = document.getElementById('checkoutDateBooking').value;
    document.getElementById('billingRoomType').innerText = document.getElementById('roomTypeBooking').value;
    document.getElementById('guestCount').innerText = `${document.getElementById('adults').value} Adults, ${document.getElementById('children').value} Children`;
}

// Function to close the guest and billing popup
function closeGuestBillingPopup() {
    document.getElementById('guestBillingPopup').style.display = 'none';
}

// Modify the booking form submission
document.getElementById("bookingForm").addEventListener("submit", function(event) {
    event.preventDefault();
    showGuestBillingPopup();
});


document.querySelector('.submit-btn').addEventListener('click', function(e) {
    e.preventDefault(); 
    
    // Lấy dữ liệu từ các input
    const firstName = document.querySelector('input[name="firstName"]').value;
    const lastName = document.querySelector('input[name="lastName"]').value;
    const number = document.querySelector('input[name="number"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const addressLine1 = document.querySelector('input[name="addressLine1"]').value;
    const addressLine2 = document.querySelector('input[name="addressLine2"]').value;
    const specialRequest = document.querySelector('input[name="specialRequest"]').value;

    // Tạo đối tượng chứa dữ liệu để gửi lên API
    const guestData = {
        firstName: firstName,
        lastName: lastName,
        number: number,
        email: email,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        specialRequest: specialRequest
    };

    // Gửi dữ liệu đến API bằng fetch
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
        
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to save guest information. Please try again.');
    });
});
