const parsedUrl = new URL(window.location.href);
const bani = parsedUrl.searchParams.get('b') || 'sukhmani';
const section = Number(parsedUrl.searchParams.get('s')) || 1;
const validGurbani = ['sukhmani'];

(function ready(fn) {
  if (document.readyState != 'loading') {
    initialize();
  } else {
    document.addEventListener('DOMContentLoaded', initialize);
  }
})();

/**
 * setup the page and grab the next json
 */
function initialize() {
  if (!validGurbani.includes(bani)) {
    renderError('error', `we don\'t have ${bani}`);
    return false;
  }

  // load gurmukhi from relevant text file
  return fetch(`js/${bani}/${section}.txt`)
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.text();
    })
    .then(body => {
      let state = {
        content: body,
        bani,
        section,
      };
      render(state);
    })
    .catch(err => {
      renderError('error', JSON.stringify(err));
    });
}

/**
 * render the Gurbani
 * @param {} state 
 */
function render(state) {
  console.log(state);
  document.getElementById('section-number').innerText = state.section;
  document.getElementById('bani').innerText = state.content;
}

/**
 * button handlers
 */
const nextButtons = Array.from(document.getElementsByClassName('next-button'));
nextButtons.forEach(el => {
  el.addEventListener("click", () => {
    let nextSection = section + 1;
    window.location.replace(`?b=${bani}&s=${nextSection}`);
  });
});
const prevButtons = Array.from(document.getElementsByClassName("prev-button"));
prevButtons.forEach(el => {
  el.addEventListener("click", () => {
    let prevSection = section - 1;
    if (prevSection < 1) {
      prevSection = 1;
    }
    window.location.replace(`?b=${bani}&s=${prevSection}`);
  });
});




/**
 * render out errors
 *
 * @param {string} level
 * @param {string} msg
 */
function renderError(level, msg) {
  console.error(msg);
  document.getElementById('debug').innerText = msg;
}
