/* =========================================================
   LIFE DROP - PROFESSIONAL WEBSITE JAVASCRIPT
   ========================================================= */


/* ================= MOBILE MENU ================= */

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            navLinks.classList.toggle("show");

            if (navLinks.classList.contains("show")) {
                menuToggle.innerHTML = "✕";
                menuToggle.setAttribute("aria-label", "Close menu");
            } else {
                menuToggle.innerHTML = "☰";
                menuToggle.setAttribute("aria-label", "Open menu");
            }

        });


        /* Close mobile menu after clicking a link */

        const links = navLinks.querySelectorAll("a");

        links.forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("show");

                menuToggle.innerHTML = "☰";
                menuToggle.setAttribute("aria-label", "Open menu");

            });

        });

    }


    /* ================= ACTIVE NAV LINK ================= */

    const navItems = document.querySelectorAll(
        ".nav-links > a:not(.nav-donor-btn)"
    );

    navItems.forEach(function (link) {

        link.addEventListener("click", function () {

            navItems.forEach(function (item) {
                item.classList.remove("active");
            });

            this.classList.add("active");

        });

    });


    /* ================= CITY ENTER KEY ================= */

    const cityInput = document.getElementById("city");

    if (cityInput) {

        cityInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                findBlood();

            }

        });

    }


    console.log("LifeDrop website loaded successfully.");

});


/* ================= BLOOD GROUP SELECTION ================= */

function selectBloodGroup(group) {

    const bloodGroup = document.getElementById("bloodGroup");

    if (!bloodGroup) {
        return;
    }

    bloodGroup.value = group;

    const findSection = document.getElementById("find-blood");

    if (findSection) {

        findSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* ================= FIND BLOOD ================= */

function findBlood() {

    const bloodGroupElement =
        document.getElementById("bloodGroup");

    const cityElement =
        document.getElementById("city");

    const resultElement =
        document.getElementById("searchResult");


    if (
        !bloodGroupElement ||
        !cityElement ||
        !resultElement
    ) {

        console.error(
            "Blood search elements were not found."
        );

        return;

    }


    const bloodGroup =
        bloodGroupElement.value;

    const city =
        cityElement.value.trim();


    /* ================= VALIDATION ================= */

    if (bloodGroup === "") {

        resultElement.innerHTML = `
            <div class="result-message">
                ⚠️ Please select a blood group.
            </div>
        `;

        bloodGroupElement.focus();

        return;

    }


    if (city === "") {

        resultElement.innerHTML = `
            <div class="result-message">
                ⚠️ Please enter your city.
            </div>
        `;

        cityElement.focus();

        return;

    }


    /* ================= LOADING ================= */

    resultElement.innerHTML = `
        <div class="result-message">
            🔎 Searching for
            <strong>${escapeHTML(bloodGroup)}</strong>
            donors in
            <strong>${escapeHTML(city)}</strong>...
        </div>
    `;


    /* ================= DEMO RESULT ================= */

    setTimeout(function () {

        resultElement.innerHTML = `
            <div class="result-message">
                🩸 Search completed for
                <strong>${escapeHTML(bloodGroup)}</strong>
                blood group in
                <strong>${escapeHTML(city)}</strong>.

                <br><br>

                <strong>Backend connection pending.</strong>

                <br>

                Real donor results will appear here
                after the Node.js backend and database
                are connected.
            </div>
        `;

    }, 1000);

}


/* ================= HTML SECURITY ================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* ================= HEADER SCROLL EFFECT ================= */

window.addEventListener("scroll", function () {

    const header =
        document.getElementById("header");

    if (!header) {
        return;
    }


    if (window.scrollY > 30) {

        header.style.boxShadow =
            "0 8px 30px rgba(20, 25, 35, 0.08)";

    } else {

        header.style.boxShadow = "none";

    }

});


/* ================= SMOOTH SCROLL ================= */

document.addEventListener("click", function (event) {

    const link =
        event.target.closest('a[href^="#"]');

    if (!link) {
        return;
    }


    const targetId =
        link.getAttribute("href");


    if (
        !targetId ||
        targetId === "#"
    ) {
        return;
    }


    const target =
        document.querySelector(targetId);


    if (!target) {
        return;
    }


    event.preventDefault();


    target.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});


/* ================= PREVENT EMPTY SOCIAL LINKS ================= */

document.addEventListener("DOMContentLoaded", function () {

    const emptyLinks =
        document.querySelectorAll('a[href="#"]');

    emptyLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

        });

    });

});