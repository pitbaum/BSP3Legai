<head>
    <title>Cases FAQ</title>
</head>

<template>
    <p>{{currentQuestion}}</p>
    <div v-for= "(anwser, index) in currentAnwsers" v-bind:key="anwser">
    <input type="radio" id="mark" name="possibleAnwsers" v-model= "selectedAnwser" v-bind:value= "anwser">
    <label for="mark">{{index + 1}}) {{anwser}}</label><br>
    </div>
    <input type="submit" value="Submit" id="anwser-submit" v-on:click="submitTick" data-testid="submitBtn">
    <p></p>
    <p>Previous Results:</p>
    <div v-for= "(value, index) in finsihedQA" v-bind:key="value">
    <label>{{index+1}}) Q: {{value.question}} A: {{value.anwser}}</label><br>
    </div>
</template>

<script>
    import axios from "axios";
    import VueCookies from 'vue-cookies';

    export default{
        async mounted() {
            let env = this;
	  	    await axios.get("/casefaq", {headers: {'Operation': 'gatherFAQ'}}).then((response) => {
                if(response.status >= 200 && response.status <= 209) {
                    env.currentQuestion = response.data.question
                    for(var j = 0; j < response.data.currentAnwsers.length; j++) {
                        env.currentAnwsers.push(response.data.currentAnwsers[j].anwser)
                    } 
                }
      	    })
        },

        data() {
            return {
                currentQuestion: "NULL",
                currentAnwsers: [],
                anwseredAnwer: [],
                anwseredQuestion: [],
                finsihedQA: [],
                selectedAnwser: ""
            }
        },

        methods: {
            addNewFinishedQA() {
                this.finsihedQA.push({question: this.currentQuestion, anwser: this.selectedAnwser})
            },

            async submitTick(e) {
                e.preventDefault()
                if(this.currentQuestion === "All questions anwsered, Please check your anwsers and press submit to finish"){  
                    let body = this.finsihedQA
                    let env = this //actually unnecessary with the syntax below
                    await axios.post("/casefaq", body).then(function(response) {
                        if(response.status === 201)
                            env.$router.push("/dashboard")
                        else 
                            env.currentQuestion = "There was a server error, please try to submit again."
                    })
                }
                else {
                    this.addNewFinishedQA()
                    this.currentAnwsers.splice(0) //empty the array
                    let payload = {currentQuestion: this.currentQuestion, currentAnwser: this.selectedAnwser, token: VueCookies.get('token').token}
                    let env = this; //actually unnecessary with the syntax below
                    let response = await axios.get('/casefaq', payload)
                    if(response.data.question === 'NULL') {
                        //If the last question in the queue was anwsered, the backend will send a NULL string and this verifies the end.
                        env.currentQuestion = 'All questions anwsered, Please check your anwsers and press submit to finish'
                    }
                    else { //Next question and possible anwsers were sent.
                        env.currentQuestion = response.data.question
                        for(var j = 0; j < response.data.currentAnwsers.length; j++) {
                            env.currentAnwsers.push(response.data.currentAnwsers[j].anwser)
                        } 
                    } 
                }
            },
        }
    }
</script>