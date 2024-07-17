// When the sync icon is clicked, the event listener will be triggered
document.querySelector('.sync a').addEventListener('click', function(event) {
    event.preventDefault();
    console.log('Sync icon clicked.'); // just found out right now that its not sync but refresh its ok tho its just a console log

    // Gets input values
    let passwordLength = document.querySelector('.length-num').value;
    let includeUppercase = document.querySelector('#uppercase').checked;
    let includeLowercase = document.querySelector('#lowercase').checked;
    let includeSymbols = document.querySelector('#symbols').checked;
    let includeNumbers = document.querySelector('#numbers').checked;
    let passwordType = document.querySelector('.pass-type').value;

    // Alerts user if they don't select any character type for 'random' password option
    if (passwordType === '1' && !(includeUppercase || includeLowercase || includeSymbols || includeNumbers)) {
        alert('Please select at least one character type for a random password');
        return;
    }
    
    // Alerts user if they don't select any character type for 'memorable' password option
    if (passwordType === '2' && !(includeUppercase || includeLowercase)) {
        alert('Please select at least one character type for a memorable password');
        return;
    }

    console.log('Preparing to fetch password.'); // Just for me to check in the console kind of like a pinpoint

    // POST request to generate_password
    fetch('/generate_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // Sends form data in request
        body: JSON.stringify({
            length: passwordLength,
            uppercase: includeUppercase,
            lowercase: includeLowercase,
            symbols: includeSymbols,
            numbers: includeNumbers,
            type: passwordType
        })
    })
    .then(response => {
        console.log('Received response.');
        return response.json(); // Parses the response to JSON
    })
    .then(data => {
        console.log('Received data:', data);
        // If data has 'password' property then update the value of the element with the password received from the server
        if (data.hasOwnProperty('password')) {
            document.querySelector('.generated-password').value = data.password;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Event listener for when the password type is changed
document.querySelector('.pass-type').addEventListener('change', function(event) {
    let includeUppercase = document.querySelector('#uppercase');
    let includeLowercase = document.querySelector('#lowercase');
    let includeSymbols = document.querySelector('#symbols');
    let includeNumbers = document.querySelector('#numbers');

    // password_type_map = {'1': 'random', '2': 'memorable', '3': 'pin'}
    // if its pin, only number option is allowed and everything is disabled
    if (this.value === '3') {
        includeUppercase.checked = false;
        includeLowercase.checked = false;
        includeSymbols.checked = false;
        includeNumbers.checked = true;
        includeUppercase.disabled = true;
        includeLowercase.disabled = true;
        includeSymbols.disabled = true;
        includeNumbers.disabled = true;
    } else if (this.value === '2') { // if its memorable, only uppercase and lowercase are allowed
        includeUppercase.checked = true;
        includeLowercase.checked = true;
        includeSymbols.checked = false;
        includeNumbers.checked = false;
        includeUppercase.disabled = false;
        includeLowercase.disabled = false;
        includeSymbols.disabled = true;
        includeNumbers.disabled = true;
    } else { // this is random password, everything is allowed
        includeUppercase.disabled = false;
        includeLowercase.disabled = false;
        includeSymbols.disabled = false;
        includeNumbers.disabled = false;
    }
});

// Adds event listener for clicking on copy icon
document.querySelector('.copy').addEventListener('click', function(event) {
    event.preventDefault();
    console.log('Copy icon clicked.');

    // Gets password
    let password = document.querySelector('.generated-password').value;

    // tries to copy password to clipboard
    navigator.clipboard.writeText(password)
        .then(() => {
            // if successful, display an alert to the user
            alert('Password has been copied to clipboard');
        })
        .catch(err => {
            // if errors, it logs to the console
            console.error('Could not copy password to clipboard: ', err);
        });
});
