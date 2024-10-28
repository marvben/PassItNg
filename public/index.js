// Select the HTML elements
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
const quizButton = document.querySelector('.quizButton');
const showAnswerButton = document.querySelector('.showAnswerButton');

document.addEventListener('DOMContentLoaded', async function (e) {
  availableSubject();
});

showAnswerButton.addEventListener('click', showAnswer);

function showAnswer() {
  document.querySelector('.answer').classList.remove('d-none');
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

subjectSelected.addEventListener('change', async (event) => {
  if (yearAvailableWrapper) {
    yearAvailableWrapper.classList.remove('active');
    resetValues();
    await yearsAvailableForASubject(event.target.value);
    yearAvailableWrapper.classList.add('active');
  }
});

yearSelected.addEventListener('change', async (event) => {
  const valueType = Number(event.target.value);
  if (valueType) {
    examTypes.classList.add('active');
  } else {
    resetValues();
  }
});

examTypes.querySelectorAll('input').forEach((examType) => {
  examType.addEventListener('change', (event) => {
    if (!quizButton.classList.contains('active')) {
      quizButton.classList.add('active');
    }
  });
});

quizForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    await getAQuestion(formFields());
    showAnswerButton.classList.add('active');
  } catch (error) {
    console.error('Error fetching question:', error);
  }

  //start timer
  // startTimer();
});

function formFields() {
  // Get the selected subject value
  const subjectName = subjectSelected.value;
  const questionYear = yearSelected.value;
  const examType = document.querySelector('.examTypes input:checked').value;
  const numberOfQuestions = 10;

  return {
    subjectName,
    questionYear,
    examType,
    numberOfQuestions,
  };
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
    } else {
      listOfSubjectsElement.remove();
    }
  } catch (error) {
    console.log(error);
  }
}

//Getting a single question
async function getAQuestion({ subjectName, questionYear, examType }) {
  const url = `/quizQuestion?subject=${subjectName}&year=${questionYear}&type=${examType}`;
  const response = await axios.get(url);
  questionWrapper.innerHTML = questionTemplate(response.data);
}

function resetValues() {
  //yearAvailableWrapper.classList.remove('active');
  examTypes.classList.remove('active');
  quizButton.classList.remove('active');
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

  console.log(questionObj.data);

  return ` 
      <div class="card-body d-flex flex-column justify-content-between align-items-start">
          <div class="card-title m-2 text-dark question">
              ${question}
          </div>
          <ul class="options">
            ${option.a ? `<li>A. ${option.a}</li>` : ''}
            ${option.b ? `<li>B. ${option.b}</li>` : ''}
            ${option.c ? `<li>C. ${option.c}</li>` : ''}
            ${option.d ? `<li>D. ${option.d}</li>` : ''}
            ${option.e ? `<li>E. ${option.e}</li>` : ''}
          </ul>
    
           ${section ? `<div class="section">${section}</div>` : ''}

           ${
             image
               ? `<div> <img src="${image}" class="" alt="${examtype} ${examyear}"> </div>`
               : ''
           }

          <h2 class="d-none answer">Answer: ${answer}</h2>

          ${solution ? `<div class="solution">Solution: ${solution}</div>` : ''}
          
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

// const examType = document.querySelector('.examType');
// const questionsList = document.querySelector('.questionsList');
// const takeQuizButton = document.querySelector('.takeQuiz');
// const fullQuestionsButton = document.querySelector('.fullQuestionsButton');
// const countryRoot = document.querySelector('.countryRoot');
// const categoryRoot = document.querySelector('.categoryRoot');
// const root = document.querySelector('.newsRoot');
// const loadingSpinner = document.querySelector('.loadingSpinner');

// takeQuizButton.addEventListener('click', async () => {
//   await getQuizQuestion();
// });

// fullQuestionsButton.addEventListener('click', async () => {
//   await getFullQuestions();
// });

// async function getQuizQuestion() {
//   examType.innerHTML = `<div class="d-flex align-items-center">
//     <strong>Loading...</strong>
//     <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
//   </div>`;
//   questionsList.innerText = '';
//   const quote = await axios.get('/motivation');
//   examType.innerHTML = `<span >${quote.data[0].a}</span>`;
//   questionsList.innerText = quote.data[0].q;
// }

// async function getFullQuestions() {
//   examType.innerHTML = `<div class="d-flex align-items-center">
//     <strong>Loading...</strong>
//     <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
//   </div>`;
//   questionsList.innerText = '';
//   const quote = await axios.get('/motivation');
//   examType.innerHTML = `<span >${quote.data[0].a}</span>`;
//   questionsList.innerText = quote.data[0].q;
// }

// const questionParams = {
//   questSubject: 'technology',
//   questYr: 'us',
// };

// categoryRoot.addEventListener('change', async (e) => {
//   questionParams.questSubject = e.target.value;
//   await getNews(questionParams);
// });

// countryRoot.addEventListener('change', async (e) => {
//   questionParams.countryName = e.target.value;
//   await getNews(questionParams);
// });

// const categoryList = () => {
//   const categoryParams = [
//     'business',
//     'entertainment',
//     'general',
//     'health',
//     'science',
//     'sports',
//   ];
//   categoryParams.forEach((category) => {
//     const option = document.createElement('option');
//     option.name = category;
//     option.value = category;
//     option.innerText = category;
//     option.classList = 'text-capitalize';
//     categoryRoot.appendChild(option);
//   });
// };

// const countryList = () => {
//   const countryParams = [];
//   countryParams.forEach((country) => {
//     const option = document.createElement('option');
//     option.name = country;
//     option.value = country;
//     option.innerText = country;
//     option.classList = 'text-capitalize';
//     countryRoot.appendChild(option);
//   });
// };

// async function getNews({ countryName, questSubject } = {}) {
//   root.innerHTML = `<p class="text-center">Current API plan only works on local environment. Upgrade to use on development<p>`;
//   loadingSpinner.classList.add('d-none');

//   //removed news APi calls because I am on free tier.

//   root.innerHTML = ``;
//   loadingSpinner.classList.remove('d-none');
//   const news = await axios.get(
//     `/newsList?country=${countryName}&category=${questSubject}`
//   );
//   console.log(news.data);
//   if (!news.data.articles.length) {
//     root.innerHTML = `<p class="text-center">Current API plan only works on local environment. Upgrade to use on development<p>`;
//   } else {
//     news.data.articles.forEach((questionsArticle) => {
//       const newContainer = document.createElement('div');
//       newContainer.classList =
//         'card col-lg-3 col-md-4 col-12 mb-4 p-0 justify-content-around ';
//       newContainer.innerHTML = questionTemplate(questionsArticle);
//       root.appendChild(newContainer);
//     });
//   }

//   loadingSpinner.classList.add('d-none');
// }

// const questionTemplate = (questionsArticle) => {
//   const { title, description, url, urlToImage, source, author } =
//     questionsArticle;
//   return `<a href="${url}" target="_blank" >
//       <img src="${urlToImage || 'https://picsum.photos/300'}"
//           class="card-img-top" alt="...">
//       <div class="card-body d-flex flex-column justify-content-between align-items-start">
//           <h5 class="card-title m-2 text-dark">
//               ${title}
//           </h5>
//           <p class="card-text m-1 description text-dark">
//               ${description}
//           </p>
//           <a href="${url}" target="_blank" class="btn button btn-lg btn-light m-1 newsSource">From ${
//     source.name
//   }</a>
//           <p class="m-1"><strong>Author:</strong>
//               ${author || 'Unanimous'}
//           </p>
//       </div>
//   </a>
//   `;
// };
