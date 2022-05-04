const table = document.querySelector("tbody");
const select = document.querySelector(".select");

let currentYear = (new Date()).getFullYear();

for(i = currentYear; i>=1950 && i<=currentYear; i--){
  let option = document.createElement("option");
  option.innerHTML = i;
  select.append(option);
}

const loadStats = async () => {

  const res = await fetch(`https://ergast.com/api/f1/${select.value}.json`);
  const data = await res.json();
  const currentSeason = data.MRData.RaceTable.Races;
//iterate through list of objects retunred and select the data i want
  for(let i = 0; i<currentSeason.length; i++){
    const round = currentSeason[i].round;
    const races = currentSeason[i].raceName;
    const circuit = currentSeason[i].Circuit.circuitName;
    const date = currentSeason[i].date.split("-").reverse().join("-");

//create new table row//
    const newTr = document.createElement("tr");
//create new table data for each piece of data i want displayed & insert that data into the new table data element.
    const roundNo = document.createElement("td");
    roundNo.innerText = round;
    const raceName = document.createElement("td");
    raceName.innerText = races;
    const circuitName = document.createElement("td");
    circuitName.innerText = circuit;
    const raceDate = document.createElement("td");
    raceDate.innerText = date;

//append each new table data to the table row and append table row to the tablebody
    newTr.append(roundNo, raceName, circuitName, raceDate);
    table.append(newTr)

//make second request using the same year value and the current round value to request results
    const res2 = await fetch(`https://ergast.com/api/f1/${select.value}/${round}/results.json`);
    const data2 = await res2.json();
    let currentRounds = data2.MRData.RaceTable.Races;

    for(let i = 0; i<currentRounds.length; i++){
      const winnerS = currentRounds[i].Results[i].Driver.givenName;
      const winnerF = currentRounds[i].Results[i].Driver.familyName;
      const raceWinner = document.createElement("td");
      raceWinner.innerText = `${winnerS} ${winnerF}`;
      newTr.append(raceWinner);
    }
  }

//make 3rd request to show current driver standings and display 
  const res3 = await fetch("http://ergast.com/api/f1/current/driverStandings.json");
  const data3 = await res3.json();
  const driverStandings = data3.MRData.StandingsTable.StandingsLists[0].DriverStandings;
  const standingsTable = document.querySelector(".standings");
  driverStandings.forEach(driver => {
    const surName = driver.Driver.familyName;
    const firstName = driver.Driver.givenName;
    const points = driver.points;
    const position = driver.position;
    const wins = driver.wins;

    const newRow = document.createElement("tr");
    const driverPosition = document.createElement("td");
    const driverName = document.createElement("td");
    const driverPoints = document.createElement("td");
    const driverWins = document.createElement("td");

    driverPosition.innerText = position;
    driverName.innerText = `${firstName} ${surName}`;
    driverPoints.innerText = points;
    driverWins.innerText = wins;

    newRow.append(driverPosition, driverName, driverPoints, driverWins);
    standingsTable.append(newRow);
  })
};

window.addEventListener("load", loadStats);
select.addEventListener("change", loadStats);
select.addEventListener("change", () => {
  table.innerText = "";
});
