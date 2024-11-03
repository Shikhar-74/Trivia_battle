
let player1, player2, selectedQuestions;
let currentplayer = 0;
let player1Score = 0;
let player2Score = 0;
let TotalGameRound = 1
let mainDiv
let index = 0;

let selectedCategory = []


const click = document.getElementById('playerForm');
click.addEventListener('submit', (event) => {
    event.preventDefault()
    let category = document.getElementById('category').value;
    selectedCategory.push(category)
    // console.log(selectedCategory);

    player1 = document.getElementById('player1').value;
    player2 = document.getElementById('player2').value;
    console.log(category);
    document.body.innerHTML = '';

    mainDiv = document.createElement('div');
    mainDiv.id = 'questionDiv';
    const heading = document.createElement('h2');
    heading.textContent = 'Here is your question';
    mainDiv.appendChild(heading);
    document.body.appendChild(mainDiv);


    fetchQuestion(category)
        .then(selectedQuestions => {
            console.log(selectedQuestions);
            displayquestion()

        })
        .catch(err => {
            console.error(err);
        });



});

function fetchQuestion(category) {
    return new Promise((resolve, reject) => {
        fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&limit=1000`)
            .then(response => response.json())
            .then(data => {
                const easyQuestions = data.filter(q => q.difficulty === 'easy');
                const mediumQuestions = data.filter(q => q.difficulty === 'medium');
                const hardQuestions = data.filter(q => q.difficulty === 'hard');

                selectedQuestions = [];

                function randomQuestion(array, count) {
                    const shuffled = array.sort(() => 0.5 - Math.random());
                    return shuffled.slice(0, count);
                }

                selectedQuestions.push(...randomQuestion(easyQuestions, Math.min(2, easyQuestions.length)));
                selectedQuestions.push(...randomQuestion(mediumQuestions, Math.min(2, mediumQuestions.length)));
                selectedQuestions.push(...randomQuestion(hardQuestions, Math.min(2, hardQuestions.length)));

                while (selectedQuestions.length < 6) {
                    if (easyQuestions.length > 0) {
                        selectedQuestions.push(easyQuestions.pop());
                    }
                    if (mediumQuestions.length > 0) {
                        selectedQuestions.push(mediumQuestions.pop());
                    }
                    if (hardQuestions.length > 0) {
                        selectedQuestions.push(hardQuestions.pop());
                    }
                }

                if (selectedQuestions.length < 6) {
                    reject('Not enough questions available');
                } else {
                    resolve(selectedQuestions);
                }
            })
            .catch(err => {
                reject('Error fetching questions: ' + err);
            });
    });
}


function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    }
    return arr;
}
function displayquestion() {


    let playeronescoreEle = document.createElement('h2')
    playeronescoreEle.textContent = `${player1} score :-- ${player1Score}`
    mainDiv.appendChild(playeronescoreEle)


    let playertwoscoreEle = document.createElement('h2')
    playertwoscoreEle.textContent = `${player2} score :-- ${player2Score}`
    mainDiv.appendChild(playertwoscoreEle)


    let PlayerName
    if (currentplayer == 0) {
        PlayerName = player1
    } else if (currentplayer == 1) {
        PlayerName = player2
    }
    let h3 = document.createElement('h3')
    h3.textContent = `its your turn :---${PlayerName}`
    mainDiv.appendChild(h3)

    let question = selectedQuestions[index]
    // console.log(question);

    let correctoptions = question.correctAnswer
    let wrongoptions = question.incorrectAnswers
    let alloptions = [...wrongoptions, correctoptions]
    alloptions = shuffleArray(alloptions)

    let difficultylevel = question.difficulty
    // console.log(alloptions);
    // console.log(shuffleArray(alloptions));

    const myquestion = question.question.text
    // console.log(myquestion);

    const h2 = document.createElement('h2')
    h2.textContent = `Question.${index + 1}:- ${myquestion}`
    mainDiv.appendChild(h2)
    const ol = document.createElement('ol')
    mainDiv.appendChild(ol)

    alloptions.forEach(opt => {
        const li = document.createElement('li')
        li.textContent = opt
        ol.appendChild(li)

        li.addEventListener('click', () => {
            checkoption(opt, correctoptions, difficultylevel,li)
        })

    })
}





function checkoption(option, correctAnswer, difficultyofquestion,optionElement) {
    if (option == correctAnswer) {
      optionElement.style.background = 'green'
        if (currentplayer == 0) {
            if (difficultyofquestion == 'easy') {
                player1Score += 10
            }
            else if (difficultyofquestion == 'medium') {
                player1Score += 15
            }
            else if (difficultyofquestion == 'hard') {
                player1Score += 20
            }
        }


        else if (currentplayer == 1) {
            if (difficultyofquestion == 'easy') {
                player2Score += 10
            }
            else if (difficultyofquestion == 'medium') {
                player2Score += 15
            }
            else if (difficultyofquestion == 'hard') {
                player2Score += 20
            }
        }
    }else {
        optionElement.style.backgroundColor = 'red'; 
    }



    setTimeout(() => {
        currentplayer = currentplayer === 0 ? 1 : 0;
        mainDiv.innerHTML = '';
        if (index < selectedQuestions.length - 1) {
            index++;
            displayquestion();
        } else {
            whatYouWant();
        }
    }, 1000); 

}



function quitGameFunction() {
    mainDiv.innerHTML = ''
    let afterQuitPlayerOneScore = document.createElement('h2')
    afterQuitPlayerOneScore.textContent = `${player1} :-- ${player1Score}`
    let afterQuitPlayerTwoScore = document.createElement('h2')
    afterQuitPlayerTwoScore.textContent = `${player2} :-- ${player2Score}`
    mainDiv.appendChild(afterQuitPlayerOneScore)
    mainDiv.appendChild(afterQuitPlayerTwoScore)
    let yourWinner = document.createElement('h2')
    mainDiv.appendChild(yourWinner)


    if (player1Score > player2Score) {
        yourWinner.textContent = `${player1} is Winner`
    }
    else if (player1Score < player2Score) {
        yourWinner.textContent = `${player2} is Winner`
    }
    else {
        yourWinner.textContent = `Its Tie`
    }
}


function whatYouWant() {
    let countinewButton = document.createElement('button')
    countinewButton.textContent = 'Continue Game'
    let quitButton = document.createElement('button')
    quitButton.textContent = 'Quit Game'
    mainDiv.appendChild(countinewButton)
    mainDiv.appendChild(quitButton)

    quitButton.addEventListener('click', () => {
        quitGameFunction()
    })
    TotalGameRound++
    if (TotalGameRound <= 8) {

        countinewButton.addEventListener('click', () => {
            // Reset for new round, but maintain previous scores and categories
            mainDiv.innerHTML = `
           <form id="playerForm1">
                <select id="category1" required>
                    <option value="music" ${selectedCategory.includes('music') ? 'disabled' : ''}>Music</option>
                    <option value="science" ${selectedCategory.includes('science') ? 'disabled' : ''}>Science</option>
                    <option value="history" ${selectedCategory.includes('history') ? 'disabled' : ''}>History</option>
                    <option value="society_and_culture" ${selectedCategory.includes('society_and_culture') ? 'disabled' : ''}>Society and Culture</option>
                    <option value="sport_and_leisure" ${selectedCategory.includes('sport_and_leisure') ? 'disabled' : ''}>Sport and Leisure</option>
                    <option value="food_and_drink" ${selectedCategory.includes('food_and_drink') ? 'disabled' : ''}>Food and Drink</option>
                    <option value="arts_and_literature" ${selectedCategory.includes('arts_and_literature') ? 'disabled' : ''}>Arts and Literature</option>
                    <option value="general_knowledge" ${selectedCategory.includes('general_knowledge') ? 'disabled' : ''}>General Knowledge</option>
                </select>
                <br>
                <button type="submit">Start Game</button>
            </form>
        `;
            index = 0
            let formdata = document.getElementById('playerForm1')
            formdata.addEventListener('submit', (event) => {
                event.preventDefault()
                let category = document.querySelector('#category1').value
                mainDiv.innerHTML = ''
                selectedCategory.push(category)
                console.log(selectedCategory);
                fetchQuestion(category)
                    .then(selectedQuestions => {
                        console.log(selectedQuestions);
                        displayquestion()

                    })
                    .catch(err => {
                        console.error(err);
                    });
            })
        });
    }



    else {
        countinewButton.addEventListener('click', () => {
            alert('well done you play all the caterogy please now quit the game')
        })
        quitButton.addEventListener('click', () => {
          quitGameFunction()
        })
    }
};