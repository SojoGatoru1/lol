

let currentRole = "";
let currentUser = null;
let adminExists = false;

// Simulated Database
let users = [
    {
        id: 1,
        fullName: "Admin User",
        username: "admin",
        password: "admin123",
        role: "Admin",
        approved: true
    },
    {
        id: 2,
        fullName: "Teacher User",
        username: "teacher",
        password: "teacher123",
        role: "Teacher",
        class: "10",
        subject: "Math",
        contactNumber: "9876543210",
        assignedStudents: [3],
        approved: true
    },
    {
        id: 3,
        fullName: "Student User",
        username: "student",
        password: "student123",
        role: "Student",
        class: "10",
        guardianName: "Parent",
        contactNumber: "5555555555",
        address: "123 Main St",
        results: [
            { subject: "Math", grade: "A", date: "2023-05-15" },
            { subject: "Science", grade: "B", date: "2023-05-20" }
        ],
        notices: ["Parent Meeting on Friday", "Holiday on Monday"],
        routine: {
            days: ["Monday", "Wednesday", "Friday"],
            time: "09:00 AM - 11:00 AM"
        },
        assignedTeacher: 2,
        approved: true
    }
];

let notices = [];
let gallery = [
    { id: 1, url: "https://via.placeholder.com/300x200?text=Class+Photo+1", caption: "Annual Day 2023", date: "2023-04-15" },
    { id: 2, url: "https://via.placeholder.com/300x200?text=Class+Photo+2", caption: "Science Fair", date: "2023-03-10" }
];

// Check if admin exists
function checkAdminExists() {
    adminExists = users.some(user => user.role === "Admin" && user.approved);
}

// Initialize
checkAdminExists();

// Helper Functions
function showHome() {
    document.getElementById("home-screen").classList.remove("hidden");
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("signup-screen").classList.add("hidden");
    document.getElementById("dashboard-screen").classList.add("hidden");
    closeAllModals();
    currentUser = null;
    currentRole = "";
}

function showLogin(role) {
    currentRole = role;
    document.getElementById("login-title").innerHTML = `<i class="fas fa-sign-in-alt"></i> ${role} Login`;
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("login-screen").classList.remove("hidden");
    closeAllModals();
}

function handleLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = users.find(u => u.username === username && u.password === password && u.role === currentRole);

    if (user) {
        if (!user.approved) {
            alert("Your account is pending approval by the admin.");
            return;
        }
        currentUser = user;
        showDashboard(currentRole);
    } else {
        alert("Invalid Username or Password");
    }
}

function showDashboard(role) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("dashboard-screen").classList.remove("hidden");
    document.getElementById("dashboard-title").innerHTML = `<i class="fas fa-tachometer-alt"></i> ${role} Dashboard`;
    document.getElementById("welcome-message").textContent = `Welcome, ${currentUser.fullName}!`;

    document.getElementById("admin-dashboard").classList.add("hidden");
    document.getElementById("teacher-dashboard").classList.add("hidden");
    document.getElementById("student-dashboard").classList.add("hidden");

    if (role === "Admin") {
        document.getElementById("admin-dashboard").classList.remove("hidden");
    } else if (role === "Teacher") {
        document.getElementById("teacher-dashboard").classList.remove("hidden");
    } else if (role === "Student") {
        document.getElementById("student-dashboard").classList.remove("hidden");
    }
   
    closeAllModals();
}

function showSignup() {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("signup-screen").classList.remove("hidden");

    document.getElementById("student-fields").classList.add("hidden");
    document.getElementById("teacher-fields").classList.add("hidden");
    document.getElementById("admin-fields").classList.add("hidden");

    if (currentRole === "Student") {
        document.getElementById("student-fields").classList.remove("hidden");
    } else if (currentRole === "Teacher") {
        document.getElementById("teacher-fields").classList.remove("hidden");
    } else if (currentRole === "Admin") {
        if (adminExists) {
            alert("Only one admin account can exist. Please login instead.");
            showLogin("Admin");
            return;
        }
        document.getElementById("admin-fields").classList.remove("hidden");
    }
   
    // Clear all input fields
    document.getElementById("full-name").value = "";
    document.getElementById("signup-username").value = "";
    document.getElementById("signup-password").value = "";
    document.getElementById("confirm-password").value = "";
    document.getElementById("guardian-name").value = "";
    document.getElementById("contact-number").value = "";
    document.getElementById("address").value = "";
    document.getElementById("class").value = "";
    document.getElementById("teacher-class").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("teacher-contact").value = "";
    document.getElementById("admin-contact").value = "";
}

function saveSignup() {
    const fullName = document.getElementById("full-name").value;
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validate inputs
    if (!fullName || !username || !password || !confirmPassword) {
        alert("Please fill in all required fields");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // Check if username already exists
    if (users.some(u => u.username === username)) {
        alert("Username already exists. Please choose another one.");
        return;
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
        id: newId,
        fullName,
        username,
        password,
        approved: currentRole === "Admin" // Auto-approve admin
    };

    if (currentRole === "Student") {
        const guardianName = document.getElementById("guardian-name").value;
        const contactNumber = document.getElementById("contact-number").value;
        const address = document.getElementById("address").value;
        const className = document.getElementById("class").value;

        if (!guardianName || !contactNumber || !address || !className) {
            alert("Please fill in all student fields");
            return;
        }

        Object.assign(newUser, {
            role: "Student",
            class: className,
            guardianName,
            contactNumber,
            address,
            results: [],
            notices: [],
            routine: {
                days: [],
                time: ""
            },
            assignedTeacher: null,
            approved: false
        });
    } else if (currentRole === "Teacher") {
        const className = document.getElementById("teacher-class").value;
        const subject = document.getElementById("subject").value;
        const contactNumber = document.getElementById("teacher-contact").value;

        if (!className || !subject || !contactNumber) {
            alert("Please fill in all teacher fields");
            return;
        }

        Object.assign(newUser, {
            role: "Teacher",
            class: className,
            subject,
            contactNumber,
            assignedStudents: [],
            approved: false
        });
    } else if (currentRole === "Admin") {
        const contactNumber = document.getElementById("admin-contact").value;

        // Contact number is optional for admin
        Object.assign(newUser, {
            role: "Admin",
            contactNumber: contactNumber || "",
            approved: true
        });
        adminExists = true;
    }

    users.push(newUser);
   
    if (currentRole === "Admin") {
        alert("Admin account created successfully!");
        showHome();
    } else {
        alert("Account created successfully! Waiting for admin approval.");
        showHome();
    }
}

function exitApp() {
    if (confirm("Are you sure you want to exit the application?")) {
        alert("Thank you for using AZ Coaching Center Management System");
        // In a real app, you might close the window or redirect
    }
}

// Modal Functions
function openModal(modalType) {
    closeAllModals();
   
    let modalContainer;
    if (currentRole === "Admin") {
        modalContainer = document.getElementById("admin-modal-container");
    } else if (currentRole === "Teacher") {
        modalContainer = document.getElementById("teacher-modal-container");
    } else {
        modalContainer = document.getElementById("student-modal-container");
    }
   
    let modalContent = "";
    let modalTitle = "";
   
    switch(modalType) {
        case 'assign-students-modal':
            modalTitle = "Assign Students to Teachers";
            modalContent = generateAssignStudentsModal();
            break;
        case 'manage-teachers-modal':
            modalTitle = "Manage Teachers";
            modalContent = generateManageTeachersModal();
            break;
        case 'manage-students-modal':
            modalTitle = "Manage Students";
            modalContent = generateManageStudentsModal();
            break;
        case 'update-routine-modal':
            modalTitle = "Update Routine";
            modalContent = generateUpdateRoutineModal();
            break;
        case 'post-notice-modal':
            modalTitle = "Post Notice";
            modalContent = generatePostNoticeModal();
            break;
        case 'manage-gallery-modal':
            modalTitle = "Manage Gallery";
            modalContent = generateManageGalleryModal();
            break;
        case 'view-subjects-modal':
            modalTitle = "My Subjects";
            modalContent = generateViewSubjectsModal();
            break;
        case 'update-results-modal':
            modalTitle = "Update Results";
            modalContent = generateUpdateResultsModal();
            break;
        case 'view-students-modal':
            modalTitle = "My Students";
            modalContent = generateViewStudentsModal();
            break;
        case 'view-results-modal':
            modalTitle = "My Results";
            modalContent = generateViewResultsModal();
            break;
        case 'view-schedule-modal':
            modalTitle = "Class Schedule";
            modalContent = generateViewScheduleModal();
            break;
        case 'view-notices-modal':
            modalTitle = "Notices";
            modalContent = generateViewNoticesModal();
            break;
        case 'view-gallery-modal':
            modalTitle = "Gallery";
            modalContent = generateViewGalleryModal();
            break;
        case 'change-password-modal':
            modalTitle = "Change Password";
            modalContent = generateChangePasswordModal();
            break;
        case 'pending-approvals-modal':
            modalTitle = "Pending Approvals";
            modalContent = generatePendingApprovalsModal();
            break;
    }
   
    modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">${modalTitle}</h3>
                <button class="close-modal" onclick="closeAllModals()">&times;</button>
            </div>
            <div class="modal-content">
                ${modalContent}
            </div>
        </div>
    `;
   
    modalContainer.classList.add("active");
}

function closeAllModals() {
    document.getElementById("admin-modal-container").classList.remove("active");
    document.getElementById("teacher-modal-container").classList.remove("active");
    document.getElementById("student-modal-container").classList.remove("active");
}

// Modal Content Generators
function generateAssignStudentsModal() {
    const teachers = users.filter(u => u.role === "Teacher" && u.approved);
    const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
   
    let classOptions = classes.map(cls =>
        `<option value="${cls}">Class ${cls}</option>`
    ).join('');
   
    return `
        <div class="form-group">
            <label for="class-select">Select Class:</label>
            <select id="class-select" class="form-control" onchange="loadStudentsForAssignment()">
                <option value="">-- Select Class --</option>
                ${classOptions}
            </select>
        </div>
        <div id="student-assignment-container" class="hidden">
            <div class="list-container">
                <div class="list-header">
                    <div class="list-col">Student Name</div>
                    <div class="list-col">Assign Teacher</div>
                </div>
                <div id="student-assignment-list"></div>
            </div>
            <div class="modal-footer">
                <button class="primary-btn" onclick="saveStudentAssignments()">
                    <i class="fas fa-save"></i> Save Assignments
                </button>
            </div>
        </div>
    `;
}

function loadStudentsForAssignment() {
    const classSelected = document.getElementById("class-select").value;
    const container = document.getElementById("student-assignment-container");
    const list = document.getElementById("student-assignment-list");
   
    if (!classSelected) {
        container.classList.add("hidden");
        return;
    }
   
    const students = users.filter(u => u.role === "Student" && u.class === classSelected && u.approved);
    const teachers = users.filter(u => u.role === "Teacher" && u.approved);
   
    if (students.length === 0) {
        list.innerHTML = `<div class="list-item">No students found for this class</div>`;
        container.classList.remove("hidden");
        return;
    }
   
    let teacherOptions = teachers.map(teacher =>
        `<option value="${teacher.id}">${teacher.fullName} (${teacher.subject})</option>`
    ).join('');
   
    let studentList = students.map(student => `
        <div class="list-item">
            <div class="list-col">${student.fullName}</div>
            <div class="list-col">
                <select id="teacher-assign-${student.id}" class="form-select">
                    <option value="">-- Select Teacher --</option>
                    ${teacherOptions}
                </select>
            </div>
        </div>
    `).join('');
   
    list.innerHTML = studentList;
    container.classList.remove("hidden");
}

function generateManageTeachersModal() {
    const teachers = users.filter(u => u.role === "Teacher");
   
    let teacherList = teachers.map(teacher => `
        <div class="list-item">
            <div class="list-col">${teacher.fullName}</div>
            <div class="list-col">${teacher.subject}</div>
            <div class="list-col">Class ${teacher.class}</div>
            <div class="list-col">${teacher.contactNumber}</div>
            <div class="list-col">
                ${teacher.approved ? '<span class="approved">Approved</span>' : '<span class="pending">Pending</span>'}
            </div>
            <div class="list-col">
                <button class="action-btn danger-btn" onclick="deleteUser(${teacher.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
   
    return `
        <div class="list-container">
            <div class="list-header">
                <div class="list-col">Name</div>
                <div class="list-col">Subject</div>
                <div class="list-col">Class</div>
                <div class="list-col">Contact</div>
                <div class="list-col">Status</div>
                <div class="list-col">Actions</div>
            </div>
            ${teacherList}
        </div>
    `;
}

function generateManageStudentsModal() {
    const students = users.filter(u => u.role === "Student");
   
    let studentList = students.map(student => `
        <div class="list-item">
            <div class="list-col">${student.fullName}</div>
            <div class="list-col">Class ${student.class}</div>
            <div class="list-col">${student.guardianName}</div>
            <div class="list-col">${student.contactNumber}</div>
            <div class="list-col">
                ${student.approved ? '<span class="approved">Approved</span>' : '<span class="pending">Pending</span>'}
            </div>
            <div class="list-col">
                <button class="action-btn danger-btn" onclick="deleteUser(${student.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
   
    return `
        <div class="list-container">
            <div class="list-header">
                <div class="list-col">Name</div>
                <div class="list-col">Class</div>
                <div class="list-col">Guardian</div>
                <div class="list-col">Contact</div>
                <div class="list-col">Status</div>
                <div class="list-col">Actions</div>
            </div>
            ${studentList}
        </div>
    `;
}

function generateUpdateRoutineModal() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
   
    return `
        <div class="form-group">
            <label>Select Class Days:</label>
            <div class="days-selection">
                ${days.map(day => `
                    <input type="checkbox" id="day-${day.toLowerCase()}" class="day-checkbox" value="${day}">
                    <label for="day-${day.toLowerCase()}" class="day-label">${day}</label>
                `).join('')}
            </div>
            <div class="input-group">
                <i class="fas fa-clock input-icon"></i>
                <input type="text" id="class-time" placeholder="Enter class time (e.g., 09:00 AM - 11:00 AM)">
            </div>
            <div class="form-group">
                <label for="class-select-routine">Select Class:</label>
                <select id="class-select-routine" class="form-control">
                    <option value="">-- Select Class --</option>
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11-12</option>
                </select>
            </div>
        </div>
        <div class="modal-footer">
            <button class="primary-btn" onclick="saveRoutine()">
                <i class="fas fa-save"></i> Save Routine
            </button>
        </div>
    `;
}

function saveRoutine() {
    const selectedDays = [];
    document.querySelectorAll('.day-checkbox:checked').forEach(checkbox => {
        selectedDays.push(checkbox.value);
    });
   
    const classTime = document.getElementById("class-time").value;
    const className = document.getElementById("class-select-routine").value;
   
    if (selectedDays.length === 0 || !classTime || !className) {
        alert("Please select at least one day, enter class time, and select a class");
        return;
    }
   
    // Update routine for all students in the selected class
    users.forEach(user => {
        if (user.role === "Student" && user.class === className) {
            user.routine = {
                days: selectedDays,
                time: classTime
            };
        }
    });
   
    alert("Routine updated successfully!");
    closeAllModals();
}

function generatePostNoticeModal() {
    return `
        <div class="form-group">
            <label for="notice-text">Notice Content:</label>
            <textarea id="notice-text" class="form-control" rows="5" placeholder="Enter notice content..."></textarea>
        </div>
        <div class="modal-footer">
            <button class="primary-btn" onclick="saveNotice()">
                <i class="fas fa-save"></i> Post Notice
            </button>
        </div>
    `;
}

function generateManageGalleryModal() {
    return `
        <div class="upload-container">
            <h4><i class="fas fa-upload"></i> Upload New Image</h4>
            <input type="file" id="image-upload" class="file-input" accept="image/*">
            <label for="image-upload" class="file-label">
                <i class="fas fa-image"></i> Choose Image
            </label>
            <div class="input-group">
                <i class="fas fa-heading input-icon"></i>
                <input type="text" id="image-caption" placeholder="Image Caption">
            </div>
            <button class="primary-btn upload-btn" onclick="uploadImage()">
                <i class="fas fa-upload"></i> Upload
            </button>
        </div>
        <div class="gallery-container" id="admin-gallery">
            ${gallery.map(image => `
                <div class="gallery-item">
                    <img src="${image.url}" alt="${image.caption}" class="gallery-image">
                    <div class="gallery-caption">${image.caption}</div>
                    <button class="action-btn danger-btn" onclick="deleteImage(${image.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

function uploadImage() {
    const fileInput = document.getElementById("image-upload");
    const caption = document.getElementById("image-caption").value;
   
    if (!fileInput.files[0] || !caption) {
        alert("Please select an image and enter a caption");
        return;
    }
   
    const file = fileInput.files[0];
    const reader = new FileReader();
   
    reader.onload = function(e) {
        const newId = gallery.length > 0 ? Math.max(...gallery.map(img => img.id)) + 1 : 1;
       
        gallery.push({
            id: newId,
            url: e.target.result,
            caption,
            date: new Date().toISOString().split('T')[0]
        });
       
        alert("Image uploaded successfully!");
        openModal('manage-gallery-modal');
    };
   
    reader.readAsDataURL(file);
}

function generateViewSubjectsModal() {
    if (currentUser && currentUser.role === "Teacher") {
        return `
            <div class="info-card">
                <h4><i class="fas fa-book"></i> Assigned Subjects</h4>
                <p><strong>Subject:</strong> ${currentUser.subject}</p>
                <p><strong>Class:</strong> ${currentUser.class}</p>
            </div>
        `;
    } else {
        return `<p>No subjects assigned.</p>`;
    }
}

function generateUpdateResultsModal() {
    if (currentUser && currentUser.role === "Teacher") {
        const classes = [...new Set(users.filter(u => u.role === "Student" && u.assignedTeacher === currentUser.id).map(s => s.class))];
       
        if (classes.length === 0) {
            return `<p>No students assigned to you.</p>`;
        }
       
        let classOptions = classes.map(cls =>
            `<option value="${cls}">Class ${cls}</option>`
        ).join('');
       
        return `
            <div class="form-group">
                <label for="class-select-results">Select Class:</label>
                <select id="class-select-results" class="form-control" onchange="loadStudentsForResults()">
                    <option value="">-- Select Class --</option>
                    ${classOptions}
                </select>
            </div>
            <div id="student-results-container" class="hidden">
                <div class="form-group">
                    <label for="student-select">Select Student:</label>
                    <select id="student-select" class="form-control">
                        <option value="">-- Select Student --</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="result-subject">Subject:</label>
                    <input type="text" id="result-subject" class="form-control" placeholder="Enter subject">
                </div>
                <div class="form-group">
                    <label for="result-grade">Grade:</label>
                    <input type="text" id="result-grade" class="form-control" placeholder="Enter grade (e.g., A, B, C)">
                </div>
                <div class="modal-footer">
                    <button class="primary-btn" onclick="saveResult()">
                        <i class="fas fa-save"></i> Save Result
                    </button>
                </div>
            </div>
        `;
    } else {
        return `<p>You do not have permission to update results.</p>`;
    }
}

function loadStudentsForResults() {
    const classSelected = document.getElementById("class-select-results").value;
    const container = document.getElementById("student-results-container");
    const studentSelect = document.getElementById("student-select");
   
    if (!classSelected) {
        container.classList.add("hidden");
        return;
    }
   
    const students = users.filter(u =>
        u.role === "Student" &&
        u.class === classSelected &&
        u.assignedTeacher === currentUser.id &&
        u.approved
    );
   
    if (students.length === 0) {
        studentSelect.innerHTML = `<option value="">No students found for this class</option>`;
        container.classList.remove("hidden");
        return;
    }
   
    let studentOptions = students.map(student =>
        `<option value="${student.id}">${student.fullName}</option>`
    ).join('');
   
    studentSelect.innerHTML = `<option value="">-- Select Student --</option>` + studentOptions;
    container.classList.remove("hidden");
}

function generateViewStudentsModal() {
    if (currentUser && currentUser.role === "Teacher") {
        const assignedStudents = users.filter(u => u.role === "Student" && u.assignedTeacher === currentUser.id && u.approved);
       
        if (assignedStudents.length === 0) {
            return `<p>No students assigned to you.</p>`;
        }
       
        // Group students by class
        const studentsByClass = {};
        assignedStudents.forEach(student => {
            if (!studentsByClass[student.class]) {
                studentsByClass[student.class] = [];
            }
            studentsByClass[student.class].push(student);
        });
       
        let content = "";
        for (const className in studentsByClass) {
            content += `
                <div class="class-group">
                    <h4><i class="fas fa-graduation-cap"></i> Class ${className}</h4>
                    <div class="student-list">
                        ${studentsByClass[className].map(student => `
                            <div class="student-item">
                                <div class="student-name">${student.fullName}</div>
                                <div class="student-contact">${student.contactNumber}</div>
                                <div class="student-guardian">${student.guardianName}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
       
        return content;
    } else {
        return `<p>You do not have permission to view this.</p>`;
    }
}

function generateViewResultsModal() {
    if (currentUser && currentUser.role === "Student") {
        if (currentUser.results && currentUser.results.length > 0) {
            return `
                <div class="results-container">
                    ${currentUser.results.map(result => `
                        <div class="result-item">
                            <i class="fas fa-poll"></i>
                            <div>
                                <div><strong>${result.subject}:</strong> ${result.grade}</div>
                                <div class="result-date">${formatDate(result.date)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            return `<p>No results available yet.</p>`;
        }
    } else {
        return `<p>You do not have permission to view results.</p>`;
    }
}

function generateViewScheduleModal() {
    if (currentUser && currentUser.role === "Student") {
        if (currentUser.routine && currentUser.routine.days && currentUser.routine.days.length > 0) {
            return `
                <div class="info-card">
                    <h4><i class="fas fa-calendar-alt"></i> Class Schedule</h4>
                    <p><strong>Days:</strong> ${currentUser.routine.days.join(', ')}</p>
                    <p><strong>Time:</strong> ${currentUser.routine.time}</p>
                </div>
            `;
        } else {
            return `<p>No schedule available yet.</p>`;
        }
    } else {
        return `<p>You do not have permission to view the schedule.</p>`;
    }
}

function generateViewNoticesModal() {
    if (currentUser && currentUser.role === "Student") {
        if (currentUser.notices && currentUser.notices.length > 0) {
            return `
                <div class="notices-container">
                    ${currentUser.notices.map((notice, index) => `
                        <div class="notice-item">
                            <div class="notice-number">${index + 1}.</div>
                            <div class="notice-content">${notice}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            return `<p>No notices available yet.</p>`;
        }
    } else {
        return `<p>You do not have permission to view notices.</p>`;
    }
}

function generateViewGalleryModal() {
    return `
        <div class="gallery-container">
            ${gallery.map(image => `
                <div class="gallery-item">
                    <img src="${image.url}" alt="${image.caption}" class="gallery-image">
                    <div class="gallery-caption">${image.caption}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function generateChangePasswordModal() {
    return `
        <div class="form-group">
            <div class="input-group">
                <i class="fas fa-lock input-icon"></i>
                <input type="password" id="current-password" placeholder="Current Password">
            </div>
            <div class="input-group">
                <i class="fas fa-lock input-icon"></i>
                <input type="password" id="new-password" placeholder="New Password">
            </div>
            <div class="input-group">
                <i class="fas fa-lock input-icon"></i>
                <input type="password" id="confirm-new-password" placeholder="Confirm New Password">
            </div>
        </div>
        <div class="modal-footer">
            <button class="primary-btn" onclick="changePassword()">
                <i class="fas fa-save"></i> Change Password
            </button>
        </div>
    `;
}

function generatePendingApprovalsModal() {
    const pendingUsers = users.filter(u => !u.approved && u.role !== "Admin");
   
    if (pendingUsers.length === 0) {
        return `<p>No pending approvals.</p>`;
    }
   
    let userList = pendingUsers.map(user => `
        <div class="list-item">
            <div class="list-col">${user.fullName}</div>
            <div class="list-col">${user.role}</div>
            <div class="list-col">${user.role === "Student" ? `Class ${user.class}` : user.subject || '-'}</div>
            <div class="list-col">
                <button class="action-btn primary-btn" onclick="approveUser(${user.id})">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="action-btn danger-btn" onclick="rejectUser(${user.id})">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>
        </div>
    `).join('');
   
    return `
        <div class="list-container">
            <div class="list-header">
                <div class="list-col">Name</div>
                <div class="list-col">Role</div>
                <div class="list-col">Class/Subject</div>
                <div class="list-col">Actions</div>
            </div>
            ${userList}
        </div>
    `;
}

// Action Functions
function saveStudentAssignments() {
    const classSelected = document.getElementById("class-select").value;
    const students = users.filter(u => u.role === "Student" && u.class === classSelected && u.approved);
    let updated = false;
   
    students.forEach(student => {
        const selectElement = document.getElementById(`teacher-assign-${student.id}`);
        if (selectElement && selectElement.value) {
            const teacherId = parseInt(selectElement.value);
           
            // Remove student from previous teacher's list
            users.forEach(user => {
                if (user.role === "Teacher" && user.assignedStudents && user.assignedStudents.includes(student.id)) {
                    user.assignedStudents = user.assignedStudents.filter(id => id !== student.id);
                }
            });
           
            // Add student to new teacher's list
            const teacher = users.find(u => u.id === teacherId);
            if (teacher) {
                if (!teacher.assignedStudents) {
                    teacher.assignedStudents = [];
                }
                teacher.assignedStudents.push(student.id);
                student.assignedTeacher = teacherId;
                updated = true;
            }
        }
    });
   
    if (updated) {
        alert("Student assignments updated successfully!");
        closeAllModals();
    } else {
        alert("No changes were made.");
    }
}

function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        users = users.filter(u => u.id !== userId);
       
        // If it's a teacher, remove their assignments from students
        users.forEach(user => {
            if (user.role === "Student" && user.assignedTeacher === userId) {
                user.assignedTeacher = null;
            }
        });
       
        // Refresh the current modal
        if (currentRole === "Admin") {
            if (document.getElementById("admin-modal-container").classList.contains("active")) {
                openModal('manage-teachers-modal');
            }
        }
    }
}

function saveNotice() {
    const noticeText = document.getElementById("notice-text").value;
    if (noticeText) {
        notices.push(noticeText);
       
        // Add notice to all students
        users.forEach(user => {
            if (user.role === "Student" && user.approved) {
                if (!user.notices) {
                    user.notices = [];
                }
                user.notices.push(noticeText);
            }
        });
       
        alert("Notice posted successfully!");
        closeAllModals();
    } else {
        alert("Please enter notice content.");
    }
}

function deleteImage(imageId) {
    if (confirm("Are you sure you want to delete this image?")) {
        gallery = gallery.filter(img => img.id !== imageId);
        openModal('manage-gallery-modal');
    }
}

function saveResult() {
    const studentId = parseInt(document.getElementById("student-select").value);
    const subject = document.getElementById("result-subject").value;
    const grade = document.getElementById("result-grade").value;
   
    if (!studentId) {
        alert("Please select a student.");
        return;
    }
   
    if (!subject || !grade) {
        alert("Please enter both subject and grade.");
        return;
    }
   
    const student = users.find(u => u.id === studentId);
    if (student) {
        if (!student.results) {
            student.results = [];
        }
        student.results.push({
            subject,
            grade,
            date: new Date().toISOString().split('T')[0]
        });
        alert("Result saved successfully!");
        closeAllModals();
    } else {
        alert("Student not found.");
    }
}

function changePassword() {
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmNewPassword = document.getElementById("confirm-new-password").value;
   
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        alert("Please fill in all fields");
        return;
    }
   
    if (currentPassword !== currentUser.password) {
        alert("Current password is incorrect");
        return;
    }
   
    if (newPassword !== confirmNewPassword) {
        alert("New passwords do not match");
        return;
    }
   
    currentUser.password = newPassword;
    alert("Password changed successfully!");
    closeAllModals();
}

function approveUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.approved = true;
        alert("User approved successfully!");
        openModal('pending-approvals-modal');
    }
}

function rejectUser(userId) {
    if (confirm("Are you sure you want to reject this user?")) {
        users = users.filter(u => u.id !== userId);
        alert("User rejected successfully!");
        openModal('pending-approvals-modal');
    }
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Initialize the app
showHome();
