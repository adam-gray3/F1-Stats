const table = document.querySelector("tbody");
const select = document.querySelector(".select");
const showBtn = document.querySelector(".show-more");

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

const loadWinners = async(customUrl) => {
  try{
    const res2 = await fetch(customUrl);
    const winners = await res2.json();
    return winners;
  } catch(e){
      console.log("Error requesting driver wins", e)
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


     const winners = async () => {
       const winRes = await loadWinners(`https://ergast.com/api/f1/${select.value}/${round}/Results.json`);
       const completedRaces = winRes.MRData.RaceTable.Races[0];
       const raceWinner = document.createElement("td");
       if(completedRaces === undefined){
         raceWinner.innerText = "TBC";
       } else{
         const firstName = completedRaces.Results[0].Driver.givenName;
         const secName = completedRaces.Results[0].Driver.familyName;
         raceWinner.innerText = `${firstName} ${secName}`;
       }
       newTr.append(roundNo, raceName, circuitName, raceDate, raceWinner);
     }
     winners();
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

//CALL EVENTS
window.addEventListener("load", loadTable);
window.addEventListener("load", showStandings);

select.addEventListener("change", loadTable);
//CLEAR PREVIOUS DATA FROM TABLE 
select.addEventListener("change", () => {
  table.innerText = "";
});
showBtn.addEventListener("click", showHidden);

