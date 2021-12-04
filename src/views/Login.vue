<head>
  <title>Login</title>
</head>

<template>
  <main id="main-holder">
    <h1 id="login-header">Login</h1>

    <div id="login-error">
      <p v-if="isValid && isVisible" >Successfully Logged In</p>
      <p v-else-if="isVisible">{{errorMessage}}</p>
    </div>

    <form id="login-form">
      <input type="text" name="email" class="login-form-field" placeholder="Email" v-model="emailField" data-testid="email">
      <input type="password" name="password" class="login-form-field" placeholder="Password" v-model="passwordField" data-testid="password">
      <input type="submit" value="Login" id="login-form-submit" v-on:click="checkLogin" data-testid="loginBtn">
    </form>
  </main>
</template>

<script>
  import axios from "axios";
  import VueCookies from 'vue-cookies';
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
      async checkLogin(e) {
        e.preventDefault() //prevent page reload on form submit
        // POST request using axios with async/await
        const body = {email: this.emailField, password: this.passwordField}
        let validation = false
        let vaError = ""
        await axios.post("/login", body)
        .then(function(response) {
          if(response.status === 201) {
            validation = true
            VueCookies.set('token', response.data, {expire: '1h', path: '/dashboard', domain: '', secure: '', sameSite: '',})//VueCookies.set('token' , response.data, "1h");
          }
          else 
            validation = false //wrong email or password
        })
        .catch(function(error) {
          vaError = error
          window.alert("Looks like there was an error with your request.")
        })
        this.isVisible = true
        this.isValid = validation
        this.errorMessage = vaError
      },
    }
  }
</script>

<style>
  #login {
  width: 50%;
  height: 70%;
  display: grid;
  justify-items: center;
  align-items: center;
  background-color: white;
  border-radius: 7px;
  box-shadow: 0px 0px 5px 2px black;
  }
  #login-form {
  align-self: flex-start;
  display: grid;
  justify-items: center;
  align-items: center;
  }
  .login-form-field {
  border: none;
  border-bottom: 1px solid #3a3a3a;
  margin-bottom: 10px;
  border-radius: 3px;
  outline: none;
  padding: 0px 0px 5px 5px;
  }
  #login-form-submit {
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
