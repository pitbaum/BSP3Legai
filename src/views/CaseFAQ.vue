<head>
    <title>Cases FAQ</title>
</head>

<template>
    <p>Question: {{currentQuestion}}</p>
    <div v-for= "anwser in currentAnwser" v-bind:key="anwser">
    <input type="radio" id="mark" name="possibleAnwsers">
    <label for="mark">{{anwser}}</label><br>
    </div>
    <input type="submit" value="Submit" id="anwser-submit" v-on:click="submitTick" data-testid="submitBtn">

</template>

<script>
    import axios from "axios";
    import VueCookies from 'vue-cookies';

    export default{
        async mounted() {
            let payload = {token: VueCookies.get('token').token}
            let response = await axios.post('/casefaq', payload)
		    if(response.status >= 200 && response.status <= 209) {
			    this.currentQuestion = response.data.question
                for(var i = 0; i < response.data.anwseredQuestions.length; i++) {
                    var doneQA = (response.data.anwseredQuestions[i])
                    this.anwseredQuestion.push(doneQA.question)
                    this.anwseredAnwser.push(doneQA.anwser)
                }
            }
            else
                window.alert(response.status)
        },

        data() {
            return {
                currentQuestion: "NULL",
                currentAnwsers: [],
                anwseredAnwer: [],
                anwseredQuestion: [],
            }
        },

        methods: {
            async submitTick(e) {
                e.preventDefault();
                this.anwseredQuestion.push(this.currentQuestion)
                this.anwseredAnwer.push(this.anwser)
                let payload = {currentQuestion: this.currentQuestion, currentAnwser: this.anwser, token: VueCookies.get('token').token}
                let response = await axios.post('/casefaq', payload)
                if(response.data.nextQuestion === 'NULL') {
                    //If the last question in the queue was anwsered, the backend will send a NULL string and this verifies the end.
                    window.alert('All questions have been anwsered')
                }
                else { //Next question and possible anwsers were sent.
                    this.currentQuestion = response.data.nextQuestion
                    this.currentAnwsers = response.data.nextAnwsers
                }
            },
        }
    }
</script>