// _ = helper functions
function _parseMillisecondsIntoReadabconstime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
const updateSun=(sunelement,left,bottom,now) =>{
	sunelement.style.left=`${left}%`;
	sunelement.style.bottom=`${bottom}%`;
	const CurrentTimeStamp= `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`//nog verder tupen
	sunelement.setAttribute('data-time',CurrentTimeStamp);

}
// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
const placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	let sun =document.querySelector(".js-sun");
	let minleft= document.querySelector(".js-time-left");
	console.log(sun);
	//console.log(sun);
	let now=new Date()
	SunriseDate=new Date(sunrise*1000);
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	minNow=now.getMinutes()+now.getHours()*60;
	minPast=SunriseDate.getHours()*60+SunriseDate.getMinutes();
	let minutesSunUp=minNow-minPast;
	const percentage=100/totalMinutes*minutesSunUp;
	const sunleft=percentage;
	const sunbottom=percentage<50? percentage*2:(100-percentage)*2;
	updateSun(sun,sunleft,sunbottom,now);

	//manier martijn
	minleft.innerHTML=totalMinutes-minutesSunUp;
	
	const t = setInterval(() => {
		if(minutesSunUp>totalMinutes){
			clearInterval(t);
			ItBeNight();
		}else if(minutesSunUp<0){
			ItBeNight();
		}
		
			else{
				ItBeDay();
				const now = new Date();
				const left=(100/totalMinutes)*minutesSunUp;
				const bottom= left<50?left*2 : (100-left)*2;
				minleft.innerHTML=totalMinutes-minutesSunUp;
				updateSun(sun,left,bottom,now);
				minutesSunUp++;
			}
		
	}, 60000);
	
	// Bepaal het aantal minuten dat de zon al op is.
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	// Vergeet niet om het resterende aantal minuten in te vullen.
	// Nu maken we een functie die de zon elke minuut zal updaten
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};
let ItBeNight= ()=>{
	document.querySelector("html").classList.add("is-night");
}
let ItBeDay= ()=>{
	document.querySelector("html").classList.remove("is-night");
}
// 3 Met de data van de API kunnen we de app opvullen
const showResult = (queryResponse) => {
	console.log({queryResponse});
	document.querySelector(".js-location").innerHTML=`${queryResponse.city.name},${queryResponse.city.country}`;
	document.querySelector(".js-sunrise").innerHTML=_parseMillisecondsIntoReadabconstime(queryResponse.city.sunrise);
	document.querySelector(".js-sunset").innerHTML=_parseMillisecondsIntoReadabconstime(queryResponse.city.sunset);
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	let timedifference =(queryResponse.city.sunset-queryResponse.city.sunrise)/60;
	//console.log(timedifference);

	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	placeSunAndStartMoving(timedifference,queryResponse.city.sunrise);
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
const getAPI = async (lat, lon) => {
	const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=852a8ef17e6e410a0421c3bfbc658f91&units=metric&lang=nl&cnt=1`;
	const data =await fetch(url).then(res=>res.json())
		.catch(error=>console.error('Error:', error));    
		console.log(data);
		showResult(data);
	};	
	
	

	// Eerst bouwen we onze url op
	// Met de fetch API proberen we de data op te halen.
	// Als dat gelukt is, gaan we naar onze showResult functie.


document.addEventListener('DOMContentLoaded', function() {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
	console.info("dom loaded");
});
