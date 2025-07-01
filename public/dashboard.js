const pages = document.querySelectorAll('.Output-container')
const next_btn = document.getElementById("next");
const prev_btn = document.getElementById("prev")
const tracks = JSON.parse(localStorage.getItem("tracks") || "[]");
const container = document.getElementById("tracks-container");
let curr_page = 0;

function check_btn(curr_page) {
  if(curr_page === 0 && prev_btn){
    prev_btn.style.display = "none";
  } else {
    prev_btn.style.display = "flex";
  }

  if(curr_page === 5 && next_btn){
    next_btn.style.display = "none";
  } else {
    next_btn.style.display = "flex";
  }
}

function next_page(curr_page) {
  pages[curr_page].style.display = "none";
  pages[curr_page + 1].style.display = "flex";
  return curr_page + 1;
}
function prev_page(curr_page) {
  pages[curr_page].style.display = "none";
  pages[curr_page - 1].style.display = "flex";
  return curr_page - 1;
}

next_btn.addEventListener("click",() => {
  curr_page = next_page(curr_page)
  check_btn(curr_page);
})

prev_btn.addEventListener("click",() => {
  curr_page = prev_page(curr_page);
  check_btn(curr_page);
})



if (tracks.length === 0) {
  pages[0].textContent = "No tracks found.";
} else {
  async function getReport(tracks) {
    const response = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tracks })
    });  
    const data = await response.json();
    return data;
  }  

  // Vibe-Psychoanalysis
  getReport(tracks).then(aiResult => {
    const pagesHtml = JSON.parse(aiResult.message)
    pages[0].innerHTML = pagesHtml.page1;
    pages[1].innerHTML = pagesHtml.page2;
    pages[2].innerHTML = pagesHtml.page3;
    pages[3].innerHTML = pagesHtml.page4;
    pages[4].innerHTML = pagesHtml.page5;
    pages[5].innerHTML = pagesHtml.page6;
  }).catch(err => {
    pages[0].textContent = "AI request failed: " + err.message;
  });  
}  
