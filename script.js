
// Get HTML Elements
const studentForm = document.getElementById("studentForm");
const showFormBtn = document.getElementById("showFormBtn");
const cancelBtn = document.getElementById("cancelBtn");
const studentTable = document.getElementById("studentTable");
const totalStudents = document.getElementById("totalStudents");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");

// Get Form Inputs
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const semesterInput = document.getElementById("semester");

// Student Array
let students = JSON.parse(localStorage.getItem("students")) || [];

let editId = null;

// Show Form
showFormBtn.addEventListener("click", function () {
    studentForm.classList.remove("hidden");
    studentForm.scrollIntoView({ behavior: "smooth" });
});

// Cancel Form
cancelBtn.addEventListener("click", function () {
    studentForm.classList.add("hidden");
    studentForm.reset();
    editId = null;
    document.getElementById("formTitle").textContent = "Add New Student";
});

// Add or Update Student
studentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const student = {
        id: editId || Date.now(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        course: courseInput.value,
        semester: semesterInput.value
    };

    // Check Duplicate Email
    const duplicate = students.some(function (item) {
        return item.email.toLowerCase() === student.email.toLowerCase()
            && item.id !== editId;
    });

    if (duplicate) {
        alert("This email is already registered!");
        return;
    }

    if (editId) {

        // Update Student
        students = students.map(function (item) {
            if (item.id === editId) {
                return student;
            }
            return item;
        });

        editId = null;

    } else {

        // Add New Student
        students.push(student);

    }

    // Save Data
    localStorage.setItem("students", JSON.stringify(students));

    // Reset Form
    studentForm.reset();
    studentForm.classList.add("hidden");
    document.getElementById("formTitle").textContent = "Add New Student";

    // Display Updated Records
    displayStudents(students);

});

// Display Students
function displayStudents(data) {

    studentTable.innerHTML = "";

    totalStudents.textContent = students.length;

    if (data.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    data.forEach(function (student) {

        const row = document.createElement("tr");

        const values = [
            student.id,
            student.name,
            student.email,
            student.course,
            student.semester
        ];

        values.forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // Action Cell
        const actionCell = document.createElement("td");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.dataset.id = student.id;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.id = student.id;

        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);

        row.appendChild(actionCell);

        studentTable.appendChild(row);

    });

}

// Edit and Delete Students
studentTable.addEventListener("click", function (event) {

    const id = Number(event.target.dataset.id);

    if (event.target.classList.contains("edit-btn")) {

        const student = students.find(function (item) {
            return item.id === id;
        });

        if (student) {

            nameInput.value = student.name;
            emailInput.value = student.email;
            courseInput.value = student.course;
            semesterInput.value = student.semester;

            editId = student.id;

            document.getElementById("formTitle").textContent = "Edit Student";

            studentForm.classList.remove("hidden");
            studentForm.scrollIntoView({ behavior: "smooth" });

        }

    }

    if (event.target.classList.contains("delete-btn")) {

        const confirmDelete = confirm("Are you sure you want to delete this student?");

        if (confirmDelete) {

            students = students.filter(function (item) {
                return item.id !== id;
            });

            localStorage.setItem("students", JSON.stringify(students));

            displayStudents(students);

        }

    }

});

// Search Students
searchInput.addEventListener("input", function () {

    const searchValue = searchInput.value.toLowerCase();

    const filteredStudents = students.filter(function (student) {

        return student.name.toLowerCase().includes(searchValue) ||
            student.email.toLowerCase().includes(searchValue) ||
            student.course.toLowerCase().includes(searchValue);

    });

    displayStudents(filteredStudents);

});

// Display Saved Students on Page Load
displayStudents(students);
