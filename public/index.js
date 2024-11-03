// Select the HTML elements
const practicePage = document.querySelector('.practicePage');
const practiceForm = document.querySelector('form.practiceForm');
const quizForm = document.querySelector('form.quizForm');
const listOfSubjectsElement = document.querySelector('.listOfSubjects');
const yearAvailableWrapper = document.querySelector('.yearAvailableWrapper');
const listOfYearsElement = document.querySelector(
  '.yearAvailableWrapper .yearsAvailable'
);
const subjectSelected = document.querySelector('.listOfSubjects select');
const yearSelected = document.querySelector('.yearsAvailable select');
const examTypes = document.querySelector('.examTypes');
const counterDisplay = document.getElementById('counter');
const questionWrapper = document.querySelector('.questionWrapper');
const getQuestionButton = document.querySelector('.getQuestionButton');
const nextQuestionButton = document.querySelector('.nextQuestionButton');
const showAnswerButton = document.querySelector('.showAnswerButton');
const hideAnswerButton = document.querySelector('.hideAnswerButton');
const loaderSpinner = document.querySelector('.loaderSpinner');
const loadingText = document.querySelector('.loadingText');

document.addEventListener('DOMContentLoaded', async function (e) {
  availableSubject();
});

if (showAnswerButton) showAnswerButton.addEventListener('click', showAnswer);
if (hideAnswerButton) hideAnswerButton.addEventListener('click', hideAnswer);

function showAnswer() {
  document.querySelector('.answer').classList.remove('d-none');
  showAnswerButton.classList.remove('active');
  hideAnswerButton.classList.add('active');
}

function hideAnswer() {
  document.querySelector('.answer').classList.add('d-none');
  showAnswerButton.classList.add('active');
  hideAnswerButton.classList.remove('active');
}
// Initialize the counter value
let intervalId = null;

function startTimer() {
  let count = 0;
  endTimer();

  intervalId = setInterval(async function () {
    counterDisplay.textContent = count++;
    if (count === 30) {
      count = 0;
      // try {
      //   await getAQuestion(formFields());
      // } catch (error) {
      //   console.error('Error fetching question:', error);
      // }
    }
  }, 1000);
}

function endTimer() {
  clearInterval(intervalId);
  intervalId = null;
  counterDisplay.textContent = 0;
}

if (!practicePage) {
  subjectSelected.addEventListener('change', async (event) => {
    yearAvailableWrapper.classList.remove('active');
    resetValues();
    await yearsAvailableForASubject(event.target.value);
    yearAvailableWrapper.classList.add('active');
  });

  yearSelected.addEventListener('change', async (event) => {
    const valueType = Number(event.target.value);
    if (valueType) {
      examTypes.classList.add('active');
    } else {
      resetValues();
    }
  });
} else {
  subjectSelected.addEventListener('change', async (event) => {
    // resetValues();
    examTypes.classList.add('active');
  });
}

let selectedExamType = '';

examTypes.querySelectorAll('input').forEach((examType) => {
  examType.addEventListener('change', (event) => {
    selectedExamType = event.target.value;

    if (!getQuestionButton.classList.contains('active')) {
      getQuestionButton.classList.add('active');
      if (nextQuestionButton) nextQuestionButton.classList.remove('active');
    }
  });
});

if (practiceForm) {
  practiceForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      await getAQuestion(formFields());
      getQuestionButton.classList.remove('active');
      nextQuestionButton.classList.add('active');

      showAnswerButton.classList.add('active');
      hideAnswerButton.classList.remove('active');
    } catch (error) {
      console.error('Error fetching question:', error);
    }

    //start timer
    // startTimer();
  });
}

if (quizForm) {
  quizForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      getQuestionButton.classList.remove('active');
      await getManyQuestions(formFields());
    } catch (error) {
      console.error('Error fetching question:', error);
    }

    //start timer
    // startTimer();
  });
}

if (questionWrapper) {
  questionWrapper.addEventListener('submit', async (event) => {
    event.preventDefault();
    const cards = document.querySelectorAll('.card-body');
    const results = { correctAnswer: 0, wrongAnswer: 0 };

    cards.forEach((card) => {
      card.querySelector('.answer').classList.remove('d-none');
      const selectedOption = card.querySelector('.options input:checked');
      const correctAnswer = card.querySelector('.answerOption span').innerText;

      if (selectedOption.value === correctAnswer) {
        selectedOption.nextElementSibling.classList.add('correctAnswer');
        results.correctAnswer += 1;
      } else {
        selectedOption.nextElementSibling.classList.add('wrongAnswer');
        results.wrongAnswer += 1;
      }
    });

    console.log(results);
  });
}

function formFields() {
  // Get the selected subject value
  const subjectName = subjectSelected.value;
  const examType = selectedExamType;
  const numQuestion = 10;

  if (!practicePage) {
    const questionYear = yearSelected.value;
    return {
      subjectName,
      questionYear,
      examType,
      numQuestion,
    };
  } else {
    return {
      subjectName,
      examType,
      numQuestion,
    };
  }
}

async function yearsAvailableForASubject(subjectName) {
  const url = `https://questions.aloc.com.ng/api/metrics/years-available-for/${subjectName}`;

  listOfYearsElement.querySelector(' select').innerHTML =
    '<option selected>Years available</option>';

  try {
    const response = await axios.get(url);
    const requestStatus = response.data.status;
    const yearsAvailable = response.data.data;
    if (requestStatus === 200) {
      yearsAvailable.forEach((yearAvailable) => {
        const node = document.createElement('option');
        node.value = yearAvailable.examyear;
        node.name = yearAvailable.examyear;
        node.innerText = yearAvailable.examyear;

        listOfYearsElement.querySelector(' select').appendChild(node);
      });
    }
  } catch (error) {
    console.log(error);
    listOfYearsElement.querySelector(' select').innerHTML =
      '<option>Select a subject</option>';
    resetValues();
  }
}

async function availableSubject() {
  const url = 'https://questions.aloc.com.ng/api/metrics/list-subjects';

  try {
    const response = await axios.get(url); // Rename to 'response' for clarity
    const requestStatus = response.data.status;
    const subjectNames = response.data.data;
    if (requestStatus === 200) {
      for (let key in subjectNames) {
        let subjectName = subjectNames[key];
        let subjectNameForAttributes = subjectNames[key];
        if (subjectName === 'englishlit') {
          subjectName = 'english literature';
        }
        if (subjectName === 'civiledu') {
          subjectName = 'civil education';
        }
        const node = document.createElement('option');
        node.value = subjectNameForAttributes;
        node.name = subjectNameForAttributes;
        node.innerText = subjectName;

        listOfSubjectsElement.querySelector('select').appendChild(node);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

//Getting a single question for practice
async function getAQuestion({ subjectName, questionYear, examType }) {
  loaderSpinner.classList.remove('d-none');
  loadingText.classList.remove('d-none');
  showAnswerButton.classList.remove('active');
  questionWrapper.innerHTML = '';

  let url = `/practiceQuestion?subject=${subjectName}&type=${examType}`;
  const response = await axios.get(url);
  questionWrapper.innerHTML = questionTemplate(response.data);

  showAnswerButton.classList.add('active');
  loaderSpinner.classList.add('d-none');
  loadingText.classList.add('d-none');
}

//Getting many questions for quiz
async function getManyQuestions({ subjectName, questionYear, examType }) {
  loaderSpinner.classList.remove('d-none');
  loadingText.classList.remove('d-none');

  let url = `/quizQuestions?subject=${subjectName}&year=${questionYear}&type=${examType}`;
  const response = await axios.get(url);

  response.data.data.forEach((question, idx) => {
    const questionInner = document.createElement('div');
    questionInner.classList.add(`question-${idx + 1}`);
    questionInner.innerHTML = quizQuestionTemplate(question, (idx += 1));
    questionWrapper.appendChild(questionInner);
  });

  const submitButtonWrapper = document.createElement('div');
  submitButtonWrapper.classList.add('submitButtonWrapper');
  submitButtonWrapper.innerHTML = `<button type="submit" class="btn btn-light btn-outline-dark submitQuizBtn">Submit Quiz</button>`;
  questionWrapper.appendChild(submitButtonWrapper);

  loaderSpinner.classList.add('d-none');
  loadingText.classList.add('d-none');
}

function resetValues() {
  if (yearAvailableWrapper) yearAvailableWrapper.classList.remove('active');
  if (examTypes) examTypes.classList.remove('active');
  if (getQuestionButton) getQuestionButton.classList.remove('active');
  if (nextQuestionButton) nextQuestionButton.classList.remove('active');
  questionWrapper.innerHTML = '';
}

const questionTemplate = (questionObj) => {
  const {
    id,
    question,
    option,
    section,
    image,
    answer,
    solution,
    examtype,
    examyear,
    questionNub,
    hasPassage,
    category,
  } = questionObj.data;

  return ` 
      <div class="card-body d-flex flex-column justify-content-between align-items-start">
          <div class="card-title m-2 text-dark question fw-medium fs-5 p-0 mx-0 mb-3">
            ${question} 
            <span class="font-italic text-info font-weight-bold text-uppercase fs-6">(${examtype}, ${examyear})</span>
          </div>
          <ul class="options list-unstyled">
            ${option.a ? `<li>A. ${option.a}</li>` : ''}
            ${option.b ? `<li>B. ${option.b}</li>` : ''}
            ${option.c ? `<li>C. ${option.c}</li>` : ''}
            ${option.d ? `<li>D. ${option.d}</li>` : ''}
            ${option.e ? `<li>E. ${option.e}</li>` : ''}
          </ul>
    
           ${section ? `<div class="section">${section}</div>` : ''}

           ${
             image
               ? `<div class="w-100"> <img src="${image}" class="img-fluid" alt="${examtype} ${examyear}"> </div>`
               : ''
           }
           <div class="d-none answer mt-4">
            <h2 class=" answerOption text-uppercase">Answer: ${answer}</h2>
             ${
               solution
                 ? `<div class="solution">Solution: ${solution}</div>`
                 : ''
             }

           </div>
          


          ${
            questionNub
              ? `<div class="questionNub">QuestionNub: ${questionNub}</div>`
              : ''
          }
          ${
            hasPassage
              ? `<div class="hasPassage">Has Passage: ${hasPassage}</div>`
              : ''
          }
          ${
            category ? `<div class="category">Category: ${category}</div>` : ''
          }     
      </div>
  `;
};

const quizQuestionTemplate = (questionObj, questionIdx) => {
  const {
    id,
    question,
    option,
    section,
    image,
    answer,
    solution,
    examtype,
    examyear,
    questionNub,
    hasPassage,
    category,
  } = questionObj;

  return ` 
      <div class="card-body d-flex flex-column justify-content-between align-items-start mb-4">
          <div class="card-title m-2 text-dark question fw-medium fs-5 p-0 mx-0 mb-2">
            <span class="font-italic questionNumber font-weight-bold text-uppercase fs-6">${questionIdx}). </span>
            ${question} 
          </div>
          <div class="options list-unstyled">
            ${
              option.a
                ? `<div class="optionWrapper">          
               <input id="${'optionA-' + id}"  type="radio" class="optionB"  
               name="${'questionID-' + id}"  value="a" required >
              <label for="${'optionA-' + id}" class="questionOption${option.a}">
                A. ${option.a}
              </label></div> `
                : ''
            }


            ${
              option.b
                ? `<div class="optionWrapper">          
               <input id="${'optionB-' + id}"  type="radio" class="optionB"  
               name="${'questionID-' + id}" value="b"required >
              <label for="${'optionB-' + id}" class="questionOption${option.b}">
                B. ${option.b}
              </label></div> `
                : ''
            }


            ${
              option.c
                ? `<div class="optionWrapper">          
               <input  id="${'optionC-' + id}" type="radio" class="optionB"  
               name="${'questionID-' + id}" value="c" required >
              <label for="${'optionC-' + id}" class="questionOption${option.c}">
                C. ${option.c}
              </label></div> `
                : ''
            }
            

            ${
              option.d
                ? `<div class="optionWrapper">        
               <input  id="${'optionD-' + id}" type="radio" class="optionB"  
               name="${'questionID-' + id}" value="d" required >
              <label for="${'optionD-' + id}" class="questionOption${option.d}">
                D. ${option.d}
              </label></div> `
                : ''
            }

            ${
              option.e
                ? `<div class="optionWrapper">          
               <input id="${'optionE-' + id}" type="radio" class="optionB"  
               name="${'questionID-' + id}" value="e" required >
              <label for="${'optionE-' + id}" class="questionOption${option.e}">
                E. ${option.e}
              </label></div> `
                : ''
            }

          </div>
    
           ${section ? `<div class="section">${section}</div>` : ''}

           ${
             image
               ? `<div class="w-100"> <img src="${image}" class="img-fluid" alt="${examtype} ${examyear}"> </div>`
               : ''
           }
           <div class="d-none answer mt-4">
            <h2 class=" answerOption">Answer: <span>${answer}</span> </h2>
             ${
               solution
                 ? `<div class="solution">Solution: ${solution}</div>`
                 : ''
             }
              <p class="font-italic text-info font-weight-bold fs-6">Question Id: ${id}</p>
           </div>
          


          ${
            questionNub
              ? `<div class="questionNub">QuestionNub: ${questionNub}</div>`
              : ''
          }
          ${
            hasPassage
              ? `<div class="hasPassage">Has Passage: ${hasPassage}</div>`
              : ''
          }
          ${
            category ? `<div class="category">Category: ${category}</div>` : ''
          }     
      </div>
  `;
};
