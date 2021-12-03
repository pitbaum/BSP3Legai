<head>
    <title>Cases FAQ</title>
</head>

<template>
    <p>Question: {{currentQuestion}}</p>
    <div v-for= "anwser in currentAnwsers" v-bind:key="anwser">
    <input type="radio" id="mark" name="possibleAnwsers">
    <label for="mark">{{anwser}}</label><br>
    </div>
    <input type="submit" value="Submit" id="anwser-submit" v-on:click="submitTick" data-testid="submitBtn">
    
    <div >

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
            /*let response = await axios.post('/casefaq', payload)
		    if(response.status >= 200 && response.status <= 209) {
			    env.currentQuestion = response.data.question
                /*for(var j = 0; j < response.data.currentAnwsers.length; j++) {
                    env.currentAnwsers.push(response.data.currentAnwsers[j].anwser)
                }
                /*  for(var i = 0; i < response.data.anwseredQuestions.length; i++) {
                    var doneQA = (response.data.anwseredQuestions[i])
                    this.anwseredQuestion.push(doneQA.question)
                    this.anwseredAnwser.push(doneQA.anwser)
                }*/ //initialize with already anwsered questions on summary the stack
            //}
            //else
              //  window.alert(response.status)
        },

        data() {
            return {
                currentQuestion: "NULL",
                currentAnwsers: [],
                anwseredAnwer: [],
                anwseredQuestion: [],
                selectedAnwser: ""
            }
        },

        methods: {
            async submitTick(e) {
                e.preventDefault();
                this.anwseredQuestion.push(this.currentQuestion)
                this.anwseredAnwer.push(this.selectedAnwser)
                this.currentAnwsers.splice(0) //empty the array
                let payload = {currentQuestion: this.currentQuestion, currentAnwser: this.selectedAnwser, token: VueCookies.get('token').token}
                let env = this; //actually unnecessary with the syntax below
                let response = await axios.get('/casefaq', payload)
                if(response.data.question === 'NULL') {
                    //If the last question in the queue was anwsered, the backend will send a NULL string and this verifies the end.
                    window.alert('All questions have been anwsered')
                }
                else { //Next question and possible anwsers were sent.
                    env.currentQuestion = response.data.question
                    for(var j = 0; j < response.data.currentAnwsers.length; j++) {
                        env.currentAnwsers.push(response.data.currentAnwsers[j].anwser)
                    } 
                }
            },
        }
    }
</script>