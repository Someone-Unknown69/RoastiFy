const pages = document.querySelectorAll('.report-section')
const output_cont = document.querySelector('.Output-container')
const next_btn = document.getElementById("next");
const prev_btn = document.getElementById("prev");
const return_btn = document.getElementById("return");
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
  pages[curr_page + 1].style.display = "block";
  return curr_page + 1;
}
function prev_page(curr_page) {
  pages[curr_page].style.display = "none";
  pages[curr_page - 1].style.display = "block";
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

return_btn.addEventListener("click" ,()=>{
  window.location.href = "/";
});


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

  getReport(tracks)
  .then(aiResult => {
    console.log(aiResult)
    output_cont.innerHTML = Object.values(aiResult).join('')
    pages[0].style.display = "block"
    next_btn.style.display = "flex";
    return_btn.style.display = "flex";
  })
  .catch(err => {
    console.error("AI ERROR:", err);
    pages[0].textContent = "AI request failed: " + err.message;
  });

}  