const table = document.querySelector("tbody");
const select = document.querySelector(".select");
const showBtn = document.querySelector(".show-more");
const latestRace = document.querySelector(".current-results");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".close");
const latestTable = document.querySelector(".latest");
const raceName = document.querySelector(".race-name");

//setup date for select options from current year to 1950
let currentYear = (new Date()).getFullYear();
for(i = currentYear; i>=1950 && i<=currentYear; i--){
  let option = document.createElement("option");
  option.innerHTML = i;
  select.append(option);
}

//MAKE FIRST REQUEST TO GET ALL RACES WITHIN SELECTED YEAR
const loadData = async() => {
  try{
    const res = await fetch(`https://ergast.com/api/f1/${select.value}.json`);
    const data = await res.json();
    return data;
  } catch (e) {
      console.log("Error Requesting Data", e)
  }
};


//RUN FUNCTION FOR DATA AND BUILD TABLE
const loadTable = async () => {
  const raceStats = await loadData();
   const season = raceStats.MRData.RaceTable.Races;

   season.forEach(race => {
     const round = race.round;
     //CREATE NEW TABLE ROW FOR EACH ITERATION
     const newTr = document.createElement("tr");
     const roundNo = document.createElement("td");
     roundNo.innerText = race.round;
     const raceName = document.createElement("td");
     raceName.innerText = race.raceName;
     const circuitName = document.createElement("td");
     circuitName.innerText = race.Circuit.circuitName;
     const raceDate = document.createElement("td");
     raceDate.innerText = race.date.split("-").reverse().join("-").replaceAll("-", "/");

      newTr.append(roundNo, raceName, circuitName, raceDate);
      table.append(newTr);
    });
  //CALL FUNCTION TO SHOW MORE BUTTON
  showMore(table);
};

//HIDE ROWS IF GREATER THAN 10 AND SHOW MORE BUTTON
function showMore(table){
  const tableCount = table.children;
  const rows = tableCount.length;
  if(rows >= 10){
      showBtn.classList.add("active")
  for(let i = 10; i<rows; i++){
    tableCount[i].classList.add("hide");
  }
  } else{
    showBtn.classList.remove("active")
  }
};

//SHOW HIDDEN ELEMENTS WHEN BUTTON CLICKED
function showHidden(){
  const tableCount = table.children;
  const rows = tableCount.length;
  for(let i = 0; i<rows; i++){
    tableCount[i].classList.remove("hide")
  }
    showBtn.classList.remove("active")
};

//MAKE REQUEST TO SHOW CURRENT DRIVER STANDINGS
const showStandings = async () => {
  const res3 = await fetch("https://ergast.com/api/f1/current/driverStandings.json");
  const data3 = await res3.json();
  const driverStandings = data3.MRData.StandingsTable.StandingsLists[0].DriverStandings;
  const standingsTable = document.querySelector(".standings");
  //ITERATE THROUGH LIST OF DRIVERS SELECTING NAMES, POSIITON & POINTS
  driverStandings.forEach(driver => {
    const surName = driver.Driver.familyName;
    const firstName = driver.Driver.givenName;

//CREATE NEW TABLE DATA FOR EACH PIECE OF DATA I WANT TO DISPLAY
    const newRow = document.createElement("tr");
    const driverPosition = document.createElement("td");
    const driverName = document.createElement("td");
    const driverPoints = document.createElement("td");
    const driverWins = document.createElement("td");
//INSERT THE DATA INTO EACH ONE OF THOSE ROWS
    driverPosition.innerText = driver.position
    driverName.innerText = `${firstName} ${surName}`;
    driverPoints.innerText = driver.points;
    driverWins.innerText = driver.wins;
//APPEND THE DATA TO THE ROW THEN APPEND TO THE TABLE
    newRow.append(driverPosition, driverName, driverPoints, driverWins);
    standingsTable.append(newRow);
  })
};

//REQUEST LATEST RACE RESULTS
const latestResults = async() => {
  const res4 = await fetch("https://ergast.com/api/f1/current/last/results.json");
  const data4 = await res4.json();
  //show current race name in card
  raceName.innerText = data4.MRData.RaceTable.Races[0].Circuit.circuitName;
  //show latest race results
  const currentRaceResults = data4.MRData.RaceTable.Races[0].Results;
  currentRaceResults.map(driver => {
    const driverRow = document.createElement("tr");

    const driverName = document.createElement("td");
    const driverPosition = document.createElement("td");
    const driverPoints = document.createElement("td");
    const driverTime = document.createElement("td");
    //GET DRIVER NAME, NO, TIME & POINTS
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


//OPEN MODAL
function openModal() {
  modal.classList.add("active");
  overlay.classList.add("active");
};

//CALL EVENTS
window.addEventListener("load", loadTable);
window.addEventListener("load", showStandings);
window.addEventListener("load", latestResults);
select.addEventListener("change", loadTable);
select.addEventListener("change", () => {
  table.innerText = "";
});
showBtn.addEventListener("click", showHidden);
latestRace.addEventListener("click", openModal);
//CLOSE MODAL
closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  overlay.classList.remove("active");
});
