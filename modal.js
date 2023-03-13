const latestRace = document.querySelector(".current-results");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".close");
const latestTable = document.querySelector(".latest");
const raceName = document.querySelector(".race-name");

//REQUEST LATEST RACE RESULTS
const latestResults = async() => {
    const res = await fetch("https://ergast.com/api/f1/current/last/results.json");
    const data = await res.json();
    //show current race name in card
    raceName.innerText = data.MRData.RaceTable.Races[0].Circuit.circuitName;
    //show latest race results
    const currentRaceResults = data.MRData.RaceTable.Races[0].Results;
    currentRaceResults.map(driver => {

      const driverRow = document.createElement("tr");
      const driverName = document.createElement("td");
      const driverPosition = document.createElement("td");
      const driverPoints = document.createElement("td");
      const driverTime = document.createElement("td");
      //GET DRIVER NAME, NUMBER, TIME & POINTS
      driverName.innerText = driver.Driver.familyName
      driverPosition.innerText = driver.position;
      driverPoints.innerText = driver.points;

      if(driver.Time === undefined){
        driverTime.innerText = "DNF"
      } else{
        driverTime.innerText = driver.Time.time;
      }
      driverRow.append(driverPosition, driverName, driverTime, driverPoints);
      latestTable.append(driverRow);
    })
  };


function openModal() {
    modal.classList.add("active");
    overlay.classList.add("active");
  };

function closeModal() {
    modal.classList.remove("active");
    overlay.classList.remove("active");
  };


//CLOSE ON BTN CLICK 
closeBtn.addEventListener("click", () => {
    closeModal()
});

//CLOSE ON CLICK OUTSIDE OF MODAL 
document.addEventListener("click", (e) => {
    if(e.target.className.includes("overlay")){
        closeModal()
    }
})

window.addEventListener("load", latestResults);
latestRace.addEventListener("click", openModal);