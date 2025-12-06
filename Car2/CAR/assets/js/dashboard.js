// assets/js/dashboard.js - Clean JavaScript for Car Owner Dashboard

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard script loaded');
    initializeDashboard();
});

function initializeDashboard() {
    // Initialize tooltips
    initTooltips();
    
    // Initialize modals
    initModals();
    
    // Initialize form validations
    initFormValidations();
    
    // Initialize AJAX handlers
    initAjaxHandlers();
    
    // Initialize charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
        initCharts();
    }
    
    // Initialize calendar if on availability page
    if (document.getElementById('availability-calendar')) {
        initAvailabilityCalendar();
    }
    
    // Auto-hide alerts after 5 seconds
    autoHideAlerts();
}

// Tooltip initialization
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Modal functionality
function initModals() {
    // Modal triggers
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-modal-target]')) {
            const modalId = e.target.getAttribute('data-modal-target');
            showModal(modalId);
        }
        
        if (e.target.matches('[data-modal-close]') || e.target.matches('.modal-close')) {
            hideModal();
        }
        
        if (e.target.matches('.modal')) {
            hideModal();
        }
    });
    
    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideModal();
        }
    });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function hideModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Form validation
function initFormValidations() {
    const forms = document.querySelectorAll('.validate-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Email validation
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    // Number validation
    const numberFields = form.querySelectorAll('input[type="number"]');
    numberFields.forEach(field => {
        if (field.value && isNaN(field.value)) {
            showFieldError(field, 'Please enter a valid number');
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-danger';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// AJAX handlers
function initAjaxHandlers() {
    // Update booking status - using event delegation
    document.addEventListener('click', function(e) {
        if (e.target.closest('.update-booking-status')) {
            const button = e.target.closest('.update-booking-status');
            const bookingId = button.getAttribute('data-booking-id');
            const status = button.getAttribute('data-status');
            
            console.log('Button clicked:', {bookingId, status, button});
            
            if (bookingId && status) {
                updateBookingStatus(bookingId, status, button);
            }
        }
        
        if (e.target.matches('.toggle-availability')) {
            toggleCarAvailability(e.target);
        }
        
        if (e.target.matches('.delete-car-btn')) {
            deleteCar(e.target);
        }
        
        if (e.target.matches('.view-booking-btn')) {
            viewBookingDetails(e.target);
        }
    });
    
    // Review response form
    document.addEventListener('submit', function(e) {
        if (e.target.matches('.review-response-form')) {
            e.preventDefault();
            submitReviewResponse(e.target);
        }
    });
}

function updateBookingStatus(bookingId, status, buttonElement) {
    console.log('updateBookingStatus called:', {bookingId, status});
    
    // Confirm action
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    if (!confirm('Are you sure you want to ' + statusText.toLowerCase() + ' this booking?')) {
        return;
    }
    
    // Disable button and show loading
    buttonElement.disabled = true;
    const originalContent = buttonElement.innerHTML;
    buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    console.log('Sending AJAX request...');
    
    // Send AJAX request
    fetch('controllers/AjaxController.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=update_booking_status&booking_id=' + bookingId + '&status=' + status
    })
    .then(function(response) {
        console.log('Response received:', response);
        return response.json();
    })
    .then(function(data) {
        console.log('Response data:', data);
        
        if (data.success) {
            // Find the row
            const row = buttonElement.closest('tr');
            
            // Update status badge
            const statusCell = row.querySelector('.booking-status');
            const badge = statusCell.querySelector('.badge');
            badge.className = 'badge badge-' + getBookingStatusColor(data.new_status);
            badge.textContent = data.new_status.charAt(0).toUpperCase() + data.new_status.slice(1);
            
            // Update action buttons
            const actionsCell = row.querySelector('.booking-actions');
            actionsCell.innerHTML = generateBookingActions(bookingId, data.new_status);
            
            // Show success message
            showAlert('success', data.message);
        } else {
            showAlert('error', data.message);
            // Restore button
            buttonElement.disabled = false;
            buttonElement.innerHTML = originalContent;
        }
    })
    .catch(function(error) {
        console.error('AJAX Error:', error);
        showAlert('error', 'An error occurred. Please try again.');
        // Restore button
        buttonElement.disabled = false;
        buttonElement.innerHTML = originalContent;
    });
}

function toggleCarAvailability(button) {
    const carId = button.getAttribute('data-car-id');
    const row = button.closest('tr');
    
    button.disabled = true;
    button.textContent = 'Loading...';
    
    fetch('controllers/AjaxController.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=toggle_car_availability&car_id=' + carId
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            const statusCell = row.querySelector('.car-status');
            const badge = statusCell.querySelector('.badge');
            
            if (data.is_available) {
                badge.className = 'badge badge-success';
                badge.textContent = 'Available';
                button.textContent = 'Make Unavailable';
                button.className = 'btn btn-sm btn-warning toggle-availability';
            } else {
                badge.className = 'badge badge-danger';
                badge.textContent = 'Unavailable';
                button.textContent = 'Make Available';
                button.className = 'btn btn-sm btn-success toggle-availability';
            }
            
            showAlert('success', data.message);
        } else {
            showAlert('error', data.message);
            button.textContent = data.is_available ? 'Make Unavailable' : 'Make Available';
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
        showAlert('error', 'An error occurred. Please try again.');
    })
    .finally(function() {
        button.disabled = false;
    });
}

function deleteCar(button) {
    const carId = button.getAttribute('data-car-id');
    const carName = button.getAttribute('data-car-name');
    
    if (!confirm('Are you sure you want to delete ' + carName + '? This action cannot be undone.')) {
        return;
    }
    
    button.disabled = true;
    button.textContent = 'Deleting...';
    
    fetch('controllers/AjaxController.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=delete_car&car_id=' + carId
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            const row = button.closest('tr');
            row.style.transition = 'opacity 0.3s';
            row.style.opacity = '0';
            setTimeout(function() {
                row.remove();
            }, 300);
            
            showAlert('success', data.message);
        } else {
            showAlert('error', data.message);
            button.textContent = 'Delete';
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
        showAlert('error', 'An error occurred. Please try again.');
    })
    .finally(function() {
        button.disabled = false;
    });
}

function viewBookingDetails(bookingId) {
    fetch('controllers/AjaxController.php?action=get_booking_details&booking_id=' + bookingId)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            populateBookingModal(data.booking);
            showModal('booking-details-modal');
        } else {
            showAlert('error', data.message);
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
        showAlert('error', 'An error occurred while fetching booking details.');
    });
}

function loadCarDetails(carId) {
    fetch('controllers/AjaxController.php?action=get_car_details&car_id=' + carId)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            populateCarDetailsModal(data.car);
            showModal('car-details-modal');
        } else {
            showAlert('error', data.message);
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
        showAlert('error', 'Failed to load car details');
    });
}

function populateCarDetailsModal(car) {
    const content = document.getElementById('car-details-content');
    const imageHtml = car.car_image ? 
        '<img src="assets/uploads/cars/' + car.car_image + '" alt="' + car.make + ' ' + car.model + '" style="width: 100%; height: 200px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1rem;">' :
        '<div style="width: 100%; height: 200px; background: var(--secondary-color); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;"><i class="fas fa-car" style="font-size: 3rem; color: var(--text-muted);"></i></div>';
    
    content.innerHTML = 
        '<div>' + imageHtml + '</div>' +
        '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">' +
            '<div><strong>Make:</strong> ' + car.make + '</div>' +
            '<div><strong>Model:</strong> ' + car.model + '</div>' +
            '<div><strong>Year:</strong> ' + car.year + '</div>' +
            '<div><strong>Color:</strong> ' + (car.color || 'Not specified') + '</div>' +
            '<div><strong>License Plate:</strong> ' + car.license_plate + '</div>' +
            '<div><strong>Daily Rate:</strong> ' + car.daily_rate + '</div>' +
            '<div><strong>Location:</strong> ' + car.location + '</div>' +
            '<div><strong>Fuel Type:</strong> ' + car.fuel_type + '</div>' +
            '<div><strong>Transmission:</strong> ' + car.transmission + '</div>' +
            '<div><strong>Seats:</strong> ' + car.seats + '</div>' +
            '<div><strong>Status:</strong> <span class="badge badge-' + (car.is_available ? 'success' : 'danger') + '">' + (car.is_available ? 'Available' : 'Unavailable') + '</span></div>' +
            '<div><strong>Added:</strong> ' + car.created_at + '</div>' +
        '</div>' +
        
        '<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: var(--secondary-color); border-radius: 0.5rem;">' +
            '<div class="text-center">' +
                '<div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">' + car.total_bookings + '</div>' +
                '<div style="font-size: 0.875rem; color: var(--text-muted);">Total Bookings</div>' +
            '</div>' +
            '<div class="text-center">' +
                '<div style="font-size: 1.5rem; font-weight: bold; color: var(--success-color);">' + car.total_earnings + '</div>' +
                '<div style="font-size: 0.875rem; color: var(--text-muted);">Total Earnings</div>' +
            '</div>' +
            '<div class="text-center">' +
                '<div style="font-size: 1.5rem; font-weight: bold; color: var(--warning-color);">' + car.average_rating + '</div>' +
                '<div style="font-size: 0.875rem; color: var(--text-muted);">Avg Rating (' + car.total_reviews + ' reviews)</div>' +
            '</div>' +
        '</div>' +
        
        (car.description ? 
            '<div style="margin-bottom: 1rem;">' +
                '<strong>Description:</strong>' +
                '<p style="margin-top: 0.5rem; color: var(--text-muted); line-height: 1.6;">' + car.description + '</p>' +
            '</div>' : '');
}

function populateBookingModal(booking) {
    const modal = document.getElementById('booking-details-modal');
    if (!modal) return;
    
    const fields = [
        'car', 'license_plate', 'customer_name', 'customer_email', 'customer_phone',
        'start_date', 'end_date', 'total_days', 'daily_rate', 'total_amount',
        'status', 'special_requests', 'booking_date'
    ];
    
    fields.forEach(function(field) {
        const element = modal.querySelector('[data-booking-' + field + ']');
        if (element) {
            element.textContent = booking[field] || 'N/A';
        }
    });
}

function submitReviewResponse(form) {
    const formData = new FormData(form);
    formData.append('action', 'respond_to_review');
    
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    fetch('controllers/AjaxController.php', {
        method: 'POST',
        body: formData
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            const reviewCard = form.closest('.review-card');
            const responseSection = reviewCard.querySelector('.review-response');
            
            if (responseSection) {
                responseSection.innerHTML = 
                    '<div class="response-content">' +
                        '<strong>Your Response:</strong>' +
                        '<p>' + data.response + '</p>' +
                        '<small class="text-muted">Responded on ' + data.response_date + '</small>' +
                    '</div>';
            }
            
            form.style.display = 'none';
            showAlert('success', data.message);
        } else {
            showAlert('error', data.message);
        }
    })
    .catch(function(error) {
        console.error('Error:', error);
        showAlert('error', 'An error occurred. Please try again.');
    })
    .finally(function() {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Response';
    });
}

// Charts initialization
function initCharts() {
    // Earnings chart
    const earningsCanvas = document.getElementById('earnings-chart');
    if (earningsCanvas) {
        initEarningsChart(earningsCanvas);
    }
    
    // Bookings chart
    const bookingsCanvas = document.getElementById('bookings-chart');
    if (bookingsCanvas) {
        initBookingsChart(bookingsCanvas);
    }
}

function initEarningsChart(canvas) {
    const period = new URLSearchParams(window.location.search).get('period') || 'month';
    
    fetch('controllers/AjaxController.php?action=get_earnings_chart&period=' + period)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Earnings',
                        data: data.values,
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }
    })
    .catch(function(error) {
        console.error('Error loading earnings chart:', error);
    });
}

function initBookingsChart(canvas) {
    // This would be populated with booking statistics data
    const bookingStats = window.bookingStats || {};
    
    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
            datasets: [{
                data: [
                    bookingStats.pending_bookings || 0,
                    bookingStats.confirmed_bookings || 0,
                    bookingStats.completed_bookings || 0,
                    bookingStats.cancelled_bookings || 0
                ],
                backgroundColor: [
                    '#f59e0b',
                    '#3b82f6',
                    '#10b981',
                    '#ef4444'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Availability Calendar
function initAvailabilityCalendar() {
    const calendar = document.getElementById('availability-calendar');
    const carSelect = document.getElementById('car-select');
    const currentDate = new Date();
    
    let selectedCar = carSelect ? carSelect.value : null;
    
    if (carSelect) {
        carSelect.addEventListener('change', function() {
            selectedCar = this.value;
            loadAvailabilityData(selectedCar);
        });
    }
    
    if (selectedCar) {
        loadAvailabilityData(selectedCar);
    }
    
    // Calendar navigation
    document.addEventListener('click', function(e) {
        if (e.target.matches('.prev-month')) {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        }
        
        if (e.target.matches('.next-month')) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        }
        
        if (e.target.matches('.calendar-day') && !e.target.classList.contains('booked')) {
            toggleDateAvailability(e.target);
        }
    });
    
    function loadAvailabilityData(carId) {
        if (!carId) return;
        
        fetch('controllers/AjaxController.php?action=get_blocked_dates&car_id=' + carId)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                window.blockedDates = data.blocked_dates || [];
                renderCalendar();
            }
        })
        .catch(function(error) {
            console.error('Error loading availability data:', error);
        });
    }
    
    function renderCalendar() {
        console.log('Rendering calendar for:', currentDate);
    }
    
    function toggleDateAvailability(dayElement) {
        const date = dayElement.getAttribute('data-date');
        const isCurrentlyBlocked = dayElement.classList.contains('blocked');
        const newAvailability = isCurrentlyBlocked;
        
        const reason = !newAvailability ? prompt('Reason for blocking this date (optional):') || 'Manually blocked' : '';
        
        fetch('controllers/AjaxController.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=set_availability&car_id=' + selectedCar + '&date=' + date + '&is_available=' + newAvailability + '&reason=' + encodeURIComponent(reason)
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                if (newAvailability) {
                    dayElement.classList.remove('blocked');
                    dayElement.setAttribute('title', 'Available');
                } else {
                    dayElement.classList.add('blocked');
                    dayElement.setAttribute('title', reason);
                }
                showAlert('success', data.message);
            } else {
                showAlert('error', data.message);
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
            showAlert('error', 'An error occurred. Please try again.');
        });
    }
}

// Utility functions
function showAlert(type, message) {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-' + (type === 'error' ? 'error' : type) + ' fade-in';
    alert.innerHTML = 
        '<span>' + message + '</span>' +
        '<button type="button" class="alert-close" onclick="this.parentElement.remove();">&times;</button>';
    
    alertContainer.appendChild(alert);
    
    // Auto-hide after 5 seconds
    setTimeout(function() {
        if (alert.parentElement) {
            alert.style.opacity = '0';
            setTimeout(function() {
                if (alert.parentElement) {
                    alert.remove();
                }
            }, 300);
        }
    }, 5000);
}

function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.maxWidth = '400px';
    document.body.appendChild(container);
    return container;
}

function autoHideAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        if (!alert.querySelector('.alert-close')) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'alert-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.onclick = function() {
                this.parentElement.remove();
            };
            alert.appendChild(closeBtn);
        }
        
        setTimeout(function() {
            if (alert.parentElement) {
                alert.style.opacity = '0';
                setTimeout(function() {
                    if (alert.parentElement) {
                        alert.remove();
                    }
                }, 300);
            }
        }, 5000);
    });
}

function getBookingStatusColor(status) {
    const colors = {
        'pending': 'warning',
        'confirmed': 'info',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateBookingActions(bookingId, status) {
    let actions = '<div class="d-flex gap-1">';
    
    // View button (always available)
    actions += 
        '<button class="btn btn-sm btn-info view-booking-btn" ' +
                'data-booking-id="' + bookingId + '"' +
                'data-tooltip="View Details">' +
            '<i class="fas fa-eye"></i>' +
        '</button>';
    
    // Status-specific actions
    switch (status) {
        case 'pending':
            actions += 
                '<button class="btn btn-sm btn-success update-booking-status" ' +
                        'data-booking-id="' + bookingId + '"' +
                        'data-status="confirmed"' +
                        'data-tooltip="Confirm Booking">' +
                    '<i class="fas fa-check"></i>' +
                '</button>' +
                '<button class="btn btn-sm btn-danger update-booking-status" ' +
                        'data-booking-id="' + bookingId + '"' +
                        'data-status="cancelled"' +
                        'data-tooltip="Cancel Booking">' +
                    '<i class="fas fa-times"></i>' +
                '</button>';
            break;
        case 'confirmed':
            actions += 
                '<button class="btn btn-sm btn-success update-booking-status" ' +
                        'data-booking-id="' + bookingId + '"' +
                        'data-status="completed"' +
                        'data-tooltip="Mark as Completed">' +
                    '<i class="fas fa-check-double"></i>' +
                '</button>' +
                '<button class="btn btn-sm btn-danger update-booking-status" ' +
                        'data-booking-id="' + bookingId + '"' +
                        'data-status="cancelled"' +
                        'data-tooltip="Cancel Booking">' +
                    '<i class="fas fa-times"></i>' +
                '</button>';
            break;
        default:
            actions += '<span class="text-muted" style="font-size: 0.75rem;">No actions</span>';
    }
    
    actions += '</div>';
    return actions;
}

// Image preview for file uploads
document.addEventListener('change', function(e) {
    if (e.target.matches('input[type="file"][accept*="image"]')) {
        const file = e.target.files[0];
        const preview = document.getElementById(e.target.getAttribute('data-preview'));
        
        if (file && preview) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }
});

// Search and filter functionality
function initSearchAndFilter() {
    const searchInputs = document.querySelectorAll('.search-input');
    const filterSelects = document.querySelectorAll('.filter-select');
    
    searchInputs.forEach(function(input) {
        input.addEventListener('input', debounce(function() {
            filterTable(input);
        }, 300));
    });
    
    filterSelects.forEach(function(select) {
        select.addEventListener('change', function() {
            filterTable(select);
        });
    });
}

function filterTable(element) {
    const table = document.getElementById(element.getAttribute('data-table'));
    if (!table) return;
    
    const searchTerm = element.value.toLowerCase();
    const filterColumn = element.getAttribute('data-column');
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(function(row) {
        const cells = row.querySelectorAll('td');
        let showRow = false;
        
        if (filterColumn) {
            const columnIndex = parseInt(filterColumn);
            const cellText = cells[columnIndex] ? cells[columnIndex].textContent.toLowerCase() : '';
            showRow = cellText.includes(searchTerm);
        } else {
            // Search all columns
            cells.forEach(function(cell) {
                if (cell.textContent.toLowerCase().includes(searchTerm)) {
                    showRow = true;
                }
            });
        }
        
        row.style.display = showRow ? '' : 'none';
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
        const later = function() {
            clearTimeout(timeout);
            func();
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Data export functionality
function exportTableToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.querySelectorAll('tr');
    const csv = [];
    
    rows.forEach(function(row) {
        const cols = row.querySelectorAll('td, th');
        const rowData = [];
        cols.forEach(function(col) {
            rowData.push('"' + col.textContent.replace(/"/g, '""') + '"');
        });
        csv.push(rowData.join(','));
    });
    
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initSearchAndFilter();
    
    // Add click handlers for export buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('.export-csv')) {
            const tableId = e.target.getAttribute('data-table');
            const filename = e.target.getAttribute('data-filename') || 'export.csv';
            exportTableToCSV(tableId, filename);
        }
    });
});

// Add CSS for alerts dynamically
const alertStyles = document.createElement('style');
alertStyles.textContent = `
.alert-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    float: right;
    margin-left: 10px;
    padding: 0;
    line-height: 1;
}

.alert {
    position: relative;
    margin-bottom: 10px;
    animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.tooltip {
    position: absolute;
    background: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    pointer-events: none;
}

.field-error {
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.form-control.error {
    border-color: var(--danger-color);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
`;

document.head.appendChild(alertStyles);