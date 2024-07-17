from flask import Flask, render_template, request, jsonify
import string
import secrets
import nltk
import random
from random import randint

nltk.download('words')  # downloads the words package from nltk
from nltk.corpus import words
english_words = words.words()

app = Flask(__name__)

# home page route
@app.route('/')
def home():
    return render_template('index.html')

# generate_password route
@app.route('/generate_password', methods=['POST'])
def generate_password():
    # just for debugging can remove
    print("Received request to generate password")
    # gets the parameters from JSON request
    password_length = request.json.get('length', 12)
    include_uppercase = request.json.get('uppercase', False)
    include_lowercase = request.json.get('lowercase', False)
    include_symbols = request.json.get('symbols', False)
    include_numbers = request.json.get('numbers', False)
    password_type = request.json.get('type', '1')

    # map for password type
    password_type_map = {'1': 'random', '2': 'memorable', '3': 'pin'}
    password_type = password_type_map.get(password_type, 'random')

    print(f"Parameters: length {password_length}, uppercase {include_uppercase}, lowercase {include_lowercase}, symbols {include_symbols}, numbers {include_numbers}, type {password_type}")

    password_length = int(password_length)
    uppercase_letters = string.ascii_uppercase if include_uppercase else ''
    lowercase_letters = string.ascii_lowercase if include_lowercase else ''
    symbols = string.punctuation if include_symbols else ''
    numbers = string.digits if include_numbers else ''
    all_characters = uppercase_letters + lowercase_letters + symbols + numbers

    password = ''

    if password_type == 'random':
        if include_uppercase and password_length > 0:
            # adds random uppercase letter to password
            password += secrets.choice(uppercase_letters)
            # then reduces passwordsl lenth by 1 
            password_length -= 1
            # generates remaining password by randomly picking characters from all_characters
        password += ''.join(secrets.choice(all_characters) for i in range(password_length))
    elif password_type == 'memorable':
        while len(password) < password_length:
            # appens random word from english_words to the password
            password += english_words[randint(0, len(english_words) - 1)]
        # shortens password to the password length in case the last word is too long
        password = password[:password_length]

        # added this because the chances of a character being uppercase when both options uppercase and lowercase are true were almost nonexistent
        if include_uppercase and include_lowercase:
            # converts password into a list
            password_list = list(password)

            # this randomly capitalizes letters in the pasword
            for _ in range(random.randint(0, len(password_list))):
                index = random.randint(0, len(password_list) - 1)

                password_list[index] = password_list[index].upper()

            # converts the list back to string
            password = ''.join(password_list)

        elif include_uppercase and not include_lowercase:
            password = password.upper()
        elif include_lowercase and not include_uppercase:
            password = password.lower()

    # if password type is pin then generate a random number password with desired length
    elif password_type == 'pin':
        password = ''.join(secrets.choice(numbers) for i in range(password_length))

    print(f"Generated password: {password}")    # also just for debugging
    return jsonify({'password': password})

if __name__ == "__main__":
    app.run(debug=True)
