
# Auto Translator

Simple backend application to translate phrases. I used Google Translation APi and cache system.


## Authors

- [@adam-devpl](https://github.com/Adam-DevPL)


## Tech Stack

- Node, Express
- Javascript

## Run Locally

Clone the project

```bash
  git clone https://github.com/Adam-DevPL/auto-translator
```

Go to the project directory

```bash
  cd auto-translator
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## Usage/Examples

```javascript
const pl = {
    attention:{
        title:'Dobrze, że jesteś, sprawdź to zadanie',
        subtitle:'Pomoże Ci ogarnąć jak zmieniać język w apkach reacta',
        ctaButton:'Dowiedź się więcej',
    },
    newsletter:{
        title:'Bądź na bieżąco',
        ctaButton:'Idź do repo ->',
        action:'/new-subscriber?lang=pl'
    }
}

// do endpointa leci sobie takie requestBody
const requestBody = {
    lang:'en'
}

class Translator {
  async translate() {}
}
```

