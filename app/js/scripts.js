let state = { pageNumber: false };
const urlParams = new URLSearchParams(window.location.search);
let baniBlob = false;

(function ready(fn) {
  if (document.readyState != 'loading') {
    initialize();
  } else {
    document.addEventListener('DOMContentLoaded', initialize);
  }
})();

/**
 * setup the page and state
 */
function initialize() {
  let bani = urlParams.get('b') || 'sukhmani';
  state.bani = bani;
  console.log(state);

  return fetch(`js/${bani}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then(body => {
      baniBlob = body;
      window.history.replaceState(state, null, "");
      render(state);
    })
    .catch(err => {
      console.error(err);
    });
}

function render(state) {
  console.log(state);
  console.log(baniBlob);
  document.getElementById('pageNumber').innerText = state.pageNumber;

  document.getElementById('bani').innerText = baniBlob.content[state.pageNumber];
}



function handleNextButtonClick() {
  /* mutate state */
  if (state.pageNumber === false) {
    state.pageNumber = 1;
  }
  else {
    state.pageNumber++;
  }
  window.history.pushState(state, null, "");
  render(state);
}

document.getElementById('next').addEventListener("click", handleNextButtonClick);
window.onpopstate = function (event) {
  if (event.state) { state = event.state; }
  render(state);
};  
