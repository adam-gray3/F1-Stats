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

//GET DATA FROM API
const loadData = async() => {
  try{
      const res = await fetch(`https://ergast.com/api/f1/${select.value}.json`);
      const data = await res.json();
      return data;
  } catch (e) {
      console.log("Error Requesting Data", e)
  }
};

//MAKE 2ND REQUEST USING DATA FROM FIRST REQUEST
  const loadWinners = async(customUrl) => {
    try{
        const res2 = await fetch(customUrl);
        const winners = await res2.json();
        return winners;
    } catch(e){
        console.log("Error requesting driver wins", e)
    }
  };
  //RUN BOTH FUNCTIONS FOR REQUESTING DATA AND BUILD TABLE
  const loadTable = async () => {
    const raceStats = await loadData();
     const season = raceStats.MRData.RaceTable.Races;
     //LOOP THROUGH THE RETUNRED DATA AND EXTRACT THE DATA I WANT TO DISPLAY
     season.forEach(race => {
       const round = race.round;
       const races = race.raceName;
       const circuit = race.Circuit.circuitName;
       const date = race.date.split("-").reverse().join("-").replaceAll("-", "/");
       //CREATE NEW TABLE ROW FOR EACH ITERATION
       const newTr = document.createElement("tr");
       //CREATE TABLE DATA FOR EACH PIECE OF DATA I WANT TO DISPLAY ON THE TABLE
       const roundNo = document.createElement("td");
       roundNo.innerText = round;
       const raceName = document.createElement("td");
       raceName.innerText = races;
       const circuitName = document.createElement("td");
       circuitName.innerText = circuit;
       const raceDate = document.createElement("td");
       raceDate.innerText = date;

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
        newTr.append(raceWinner);
      }

        //APPEND THE NEW TABLE DATA VARAIBLES TO THE NEW TABLE ROW THEN APPEND TO THE TABLE
        newTr.append(roundNo, raceName, circuitName, raceDate);
        table.append(newTr);
        winners();
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
    const points = driver.points;
    const position = driver.position;
    const wins = driver.wins;
//CREATE NEW TABLE DATA FOR EACH PIECE OF DATA I WANT TO DISPLAY
    const newRow = document.createElement("tr");
    const driverPosition = document.createElement("td");
    const driverName = document.createElement("td");
    const driverPoints = document.createElement("td");
    const driverWins = document.createElement("td");
//INSERT THE DATA INTO EACH ONE OF THOSE ROWS
    driverPosition.innerText = position;
    driverName.innerText = `${firstName} ${surName}`;
    driverPoints.innerText = points;
    driverWins.innerText = wins;
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
  const currentRaceName = data4.MRData.RaceTable.Races[0].Circuit.circuitName;
  raceName.innerText = currentRaceName;
  //show latest race results
  const currentRaceResults = data4.MRData.RaceTable.Races[0].Results;
  currentRaceResults.map(driver => {
    const driverRow = document.createElement("tr");

    const driverName = document.createElement("td");
    const driverPosition = document.createElement("td");
    const driverPoints = document.createElement("td");
    const driverTime = document.createElement("td");
    //GET DRIVER NAME, NO, TIME & POINTS
    const currentName = driver.Driver.familyName;
    driverName.innerText = currentName;
    const racePosition = driver.position;
    driverPosition.innerText = racePosition;
    const racePoints = driver.points;
    driverPoints.innerText = racePoints;
    if(driver.Time === undefined){
      driverTime.innerText = "DNF"
    } else{
      const raceTime = driver.Time.time;
      driverTime.innerText = raceTime;
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
})
