document.addEventListener("DOMContentLoaded", function() {
    const calculateBtn = document.getElementById("calculateBtn");
    const birthdateInput = document.getElementById("birthdate");
    const nameInput = document.getElementById("name");
    const lifePathValue = document.getElementById("lifePathValue");
    const destinyValue = document.getElementById("destinyValue");
    const lifePathInterpretation = document.getElementById("lifePathInterpretation");
    const destinyInterpretation = document.getElementById("destinyInterpretation");
    const lifePathDiv = document.getElementById("lifePathNumber");
    const destinyDiv = document.getElementById("destinyNumber");
    const birthdateError = document.getElementById("birthdateError");
    const nameError = document.getElementById("nameError");
    const generalError = document.getElementById("generalError");
    const lifePathRadio = document.getElementById("lifePathRadio");
    const destinyRadio = document.getElementById("destinyRadio");

    let interpretations = {}; // Initialize interpretations

    // Load interpretations from JSON file
    fetch('interpretations.json')
        .then(response => response.json())
        .then(data => {
            interpretations = data;
        })
        .catch(error => {
            console.error('Error loading interpretations:', error);
            generalError.textContent = "Failed to load interpretations. Please check the interpretations.json file.";
        });

    function clearErrors() {
        birthdateError.textContent = "";
        nameError.textContent = "";
        generalError.textContent = "";
    }

    function isValidDate(dateString) {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
            return false;
        }

        const parts = dateString.split("/");
        const month = parseInt(parts[0], 10);
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        if (month < 1 || month > 12 || year < 1000 || year > 9999) {
            return false;
        }

        const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            daysInMonth[2] = 29; // Leap year
        }

        if (day < 1 || day > daysInMonth[month]) {
            return false;
        }

        return true;
    }

    function calculateLifePath(birthdate) {
        const parts = birthdate.split("/");
        const month = parseInt(parts[0], 10);
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        let sum = month + day + year;
        sum = reduceToSingleDigit(sum);

        return sum;
    }

    function calculateDestiny(name) {
        const nameValue = name.toUpperCase();
        let sum = 0;
        for (let i = 0; i < nameValue.length; i++) {
            const charCode = nameValue.charCodeAt(i);
            if (charCode >= 65 && charCode <= 90) { // A-Z
                sum += letterToNumber(nameValue[i]);
            }
        }

        sum = reduceToSingleDigit(sum);
        return sum;
    }

    function letterToNumber(letter) {
        const charCode = letter.charCodeAt(0);
        const position = charCode - 64;

        const pythagorean = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const letterIndex = (position - 1) % 9;
        return pythagorean[letterIndex];
    }


    function reduceToSingleDigit(number) {
        let sum = number;
        while (sum > 9) {
            let tempSum = 0;
            const numStr = sum.toString();
            for (let i = 0; i < numStr.length; i++) {
                tempSum += parseInt(numStr[i], 10);
            }
            sum = tempSum;
        }

        if (sum === 11 || sum === 22 || sum === 33) {
            return sum;
        }

        return sum;
    }

    calculateBtn.addEventListener("click", function() {
        clearErrors();
        const birthdate = birthdateInput.value;
        const name = nameInput.value;
        let selectedCalculation = document.querySelector('input[name="calculationType"]:checked').value;

        if (!isValidDate(birthdate)) {
            birthdateError.textContent = "Please enter a valid date in MM/DD/YYYY format.";
            return;
        }

        if (!name) {
            nameError.textContent = "Please enter your full name.";
            return;
        }

        if (selectedCalculation === "lifePath") {
            destinyDiv.style.display = "none";
            lifePathDiv.style.display = "block";

            const lifePath = calculateLifePath(birthdate);

            lifePathValue.textContent = lifePath;
            lifePathInterpretation.textContent = interpretations[lifePath] ? interpretations[lifePath] : "Interpretation not available.";
        } else if (selectedCalculation === "destiny") {
            lifePathDiv.style.display = "none";
            destinyDiv.style.display = "block";

            const destiny = calculateDestiny(name);

            destinyValue.textContent = destiny;
            destinyInterpretation.textContent = interpretations[destiny] ? interpretations[destiny] : "Interpretation not available.";
        } else {
            generalError.textContent = "Please select a calculation type.";
            return;
        }
    });
});