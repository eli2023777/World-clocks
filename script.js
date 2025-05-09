
// MODEL
async function timezoneObjs(countryName) {
    if (!countryName) {
        countryName = document.getElementById('countryInput').value;
    }

    const getTimezoneObj = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    if (getTimezoneObj.ok) {
        return getTimezoneObj.json();
    }

}

// VIEW
function updateUI(data, htmlElementName) {
    let htmlContent = '';
    let seenKeys = {};

    for (let timezoneObj of data) {

        const timezoneObjsArr = timezoneObj.timezones;
        const countryUtc = timezoneObjsArr[0];
        if (!seenKeys[countryUtc]) {
            seenKeys[countryUtc] = true;


            const sign = countryUtc[3] === '-' ? -1 : 1; // + או -
            let hoursOffset = sign * parseInt(countryUtc.substring(4, 6));
            let minutesOffset = sign * parseInt(countryUtc.substring(7, 9));

            // In case the utc is +0 like iceland
            if (isNaN(hoursOffset)) {
                hoursOffset = 0;
            }
            if (isNaN(minutesOffset)) {
                minutesOffset = 0;
            }


            const totalOffsetMilliseconds = (hoursOffset * 60 + minutesOffset) * 60 * 1000;

            const currentUtc = new Date();
            currentUtc.setHours(currentUtc.getHours() - 4);


            const localTime = new Date(currentUtc.getTime() + totalOffsetMilliseconds);

            const localTimeWithOffset = new Date(localTime.getTime() - localTime.getTimezoneOffset() * 60000);

            htmlContent += localTimeWithOffset.toLocaleTimeString('en-GB');

            const htmlBox = document.getElementById(htmlElementName)
            if (htmlElementName === 'output') {
                const countryInput = document.getElementById('countryInput');
                htmlBox.innerHTML = `${countryInput.value}<br/></br>${htmlContent}`;
                console.log(htmlElementName);
            } else {
                htmlBox.innerHTML = `${htmlElementName}<br/></br>${htmlContent}`;
            }

            htmlBox.addEventListener('mouseover', flagsEvent = () => {
                const flag = timezoneObj.flags.png;
                const flagsDiv = document.getElementById('flagsDiv');
                flagsDiv.style.backgroundImage = `url(${flag})`;
                htmlBox.innerHTML = '';

            });

        }
    }
}

// CONTROL for output
async function main() {
    const data = await timezoneObjs();
    const outputSI = setInterval(() => {
        try {
            updateUI(data, 'output');
            document.getElementById('output').style.display = 'block';
            document.getElementById('reload').style.display = 'block';
            document.getElementById('enterContainer').style.display = 'none';
        } catch (e) {
            alert('The country name is incorect. Please try again');
            clearInterval(outputSI);
        }
    }, 1000);
}

document.getElementById('send').addEventListener('click', () => {
    main();
})


// Init
const countriesNames = ['israel', 'thailand', 'germany', 'iceland', 'japan'];

async function initStaticClocks() {
    for (const countryName of countriesNames) {
        const data = await timezoneObjs(countryName);
        setInterval(() => { updateUI(data, countryName); }, 1000);
    }
}

initStaticClocks();





