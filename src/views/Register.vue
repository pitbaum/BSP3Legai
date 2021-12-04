<head>
  <title>Register</title>
</head>

<template>
  <main id="main-holder">
    <h1 id="register-header">Register</h1>

    <div id="register-error">
      <p v-if="isValid && isVisible" >successfully registered</p>
      <p v-else-if="isVisible">{{errorMessage}}</p>
    </div>

    <form id="register-form">
      <input type="text" name="email" class="register-form-field" placeholder="Email" v-model="emailField" data-testid="email">
      <input type="password" name="password" class="register-form-field" placeholder="Password" v-model="passwordField" data-testid="password">
      <input type="submit" value="Register" id="register-form-submit" v-on:click="checkRegistration" data-testid="registerBtn">
    </form>
  </main>
</template>

<script>
  import axios from "axios";
  export default {
    data() {
      return {
        emailField:"",
        passwordField:"",
        isVisible: false,
        isValid: false,
        errorMessage: ""
      }
    },
    methods: {
      async checkRegistration(e) {
        e.preventDefault() //prevent page reload on form submit
        // POST request using axios with async/await
        const body = {email: this.emailField, password: this.passwordField}
        let validation = false
        let vaError = "";
        await axios.post("/register", body)
        .then(function(response) {
          if(response.status === 201)
            validation = true
          else 
            validation = false
        })
        .catch(function(error) {//need to catch the error, backend is expected to throw one for the invalid case.
          vaError = error
        });
        this.isVisible = true
        this.isValid = validation
        this.errorMessage = vaError
      },
    }
  }
</script>

<style>
    #register {
    width: 50%;
    height: 70%;
    display: grid;
    justify-items: center;
    align-items: center;
    background-color: white;
    border-radius: 7px;
    box-shadow: 0px 0px 5px 2px black;
    }
    #register-form {
    align-self: flex-start;
    display: grid;
    justify-items: center;
    align-items: center;
    }
    .register-form-field {
    border: none;
    border-bottom: 1px solid #3a3a3a;
    margin-bottom: 10px;
    border-radius: 3px;
    outline: none;
    padding: 0px 0px 5px 5px;
    }
    #register-form-submit {
    width: 10%;
    padding: 7px;
    border: none;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    background-color: #3a3a3a;
    cursor: pointer;
    outline: none;
    }
</style>