// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAqGYp2JLW3zgfNtcnHhtBJxHuBCJjJhm8",
    authDomain: "sustainabilitylogin.firebaseapp.com",
    projectId: "sustainabilitylogin",
    storageBucket: "sustainabilitylogin.appspot.com",
    messagingSenderId: "890836111581",
    appId: "1:890836111581:web:fa0450b2dca2039e800b34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();


// Show the car section when the user clicks the button
document.getElementById('next-to-car').addEventListener('click', function() {
    toggleSections('date-section', 'car-section');
});

// Show the diet section when the user clicks the button
document.getElementById('next-to-diet').addEventListener('click', function() {
    toggleSections('car-section', 'diet-section');
});

// Show the energy section when the user clicks the button
document.getElementById('next-to-energy').addEventListener('click', function() {
    toggleSections('diet-section', 'energy-section');
});

// Function to toggle section visibility
function toggleSections(hideId, showId) {
    document.getElementById(hideId).style.display = 'none';
    document.getElementById(showId).style.display = 'block';
}

// Handle the carbon footprint form submission
document.getElementById('carbon-footprint-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get user inputs
    const date = document.getElementById('date').value;
    const carDistance = parseFloat(document.getElementById('car-distance').value);
    const fuelEfficiency = parseFloat(document.getElementById('fuel-efficiency').value);
    const carType = document.getElementById('car-type').value;
    const energyUsage = parseFloat(document.getElementById('energy').value);
    const naturalGas = parseFloat(document.getElementById('naturalgas').value);
    const heatingOil = parseFloat(document.getElementById('heatingoil').value);
    const propane = parseFloat(document.getElementById('propane').value);

    // Weight Inputs for Diet
    const fruit = document.getElementById('diet').value; // Fruit choice
    const fruitAmount = parseFloat(document.getElementById('fruit-amount').value);
    const protein = document.getElementById('protein').value; // Protein choice
    const proteinWeight = parseFloat(document.getElementById('protein-weight').value);
    const grains = document.getElementById('grains').value; // Grains choice
    const grainsWeight = parseFloat(document.getElementById('grains-weight').value);
    const dairy = document.getElementById('dairy').value; // Dairy choice
    const dairyWeight = parseFloat(document.getElementById('dairy-weight').value);

    // Validate inputs
    if (isNaN(carDistance) || isNaN(fuelEfficiency) || carDistance <= 0 || fuelEfficiency <= 0) {
        alert("Please enter valid values for distance and fuel efficiency.");
        return;
    }

    // Calculate emissions
    const carEmissions = calculateCarEmissions(carDistance, fuelEfficiency, carType);
    const dietEmissions = calculateDietEmissions(fruit, fruitAmount, protein, proteinWeight, grains, grainsWeight, dairy, dairyWeight);
    const energyEmissions = calculateEnergyEmissions(energyUsage, naturalGas, heatingOil, propane);

    // Total emissions
    const totalEmissions = carEmissions + dietEmissions + energyEmissions;

    // Display results
    displayResults(date, carEmissions, dietEmissions, energyEmissions, totalEmissions);

    // Save emissions data to Firebase
    saveEmissionsDataToFirebase(date, carEmissions, dietEmissions, energyEmissions, totalEmissions);

    // Show lifestyle advice
    const { advice, link } = generateLifestyleAdvice(carEmissions, dietEmissions, energyEmissions);
    displayLifestyleAdvice(advice, link);
});

// Function to calculate car emissions
function calculateCarEmissions(distance, efficiency, type) {
    const emissionFactors = {
        gasoline: 19.6, // pounds of CO2 per gallon for gasoline
        diesel: 22.4    // pounds of CO2 per gallon for diesel
    };

    const gallonsUsed = distance / efficiency;
    const emissionFactor = emissionFactors[type] || 0;

    // Calculate emissions in kg
    return (gallonsUsed * emissionFactor * 0.453592); // Convert to kg
}

// Function to calculate diet emissions
function calculateDietEmissions(fruit, fruitAmount, protein, proteinWeight, grains, grainsWeight, dairy, dairyWeight) {
    let dietEmissions = 0;

    // Emission factors (kg CO₂e per unit)
    const emissionsFactors = {
        apple: 0.06,   // kg CO₂e per apple
        banana: 0.11,  // kg CO₂e per banana
        orange: 0.05,  // kg CO₂e per orange
        beef: 155,     // kg CO₂e per kg
        pork: 24,      // kg CO₂e per kg
        poultry: 18.2, // kg CO₂e per kg
        fish: 13.4,    // kg CO₂e per kg
        rice: 1.6,     // kg CO₂e per kg
        oats: 1.0,     // kg CO₂e per kg
        milk: 3.57,    // kg CO₂e per kg
        yogurt: 2.92,  // kg CO₂e per kg
        cheese: 27.9   // kg CO₂e per kg
    };

    // Calculate emissions for each food category
    if (emissionsFactors[fruit]) {
        dietEmissions += emissionsFactors[fruit] * fruitAmount;
    }
    if (emissionsFactors[protein]) {
        dietEmissions += emissionsFactors[protein] * proteinWeight;
    }
    if (emissionsFactors[grains]) {
        dietEmissions += emissionsFactors[grains] * grainsWeight;
    }
    if (emissionsFactors[dairy]) {
        dietEmissions += emissionsFactors[dairy] * dairyWeight;
    }

    return dietEmissions; // Total emissions from diet
}

// Function to calculate energy emissions
function calculateEnergyEmissions(energy, naturalGas, heatingOil, propane) {
    // Emission factors (kg CO2e)
    const energyEmissions = energy * 0.92;  // kWh to kg CO2e
    const naturalGasEmissions = naturalGas * 1.89; // kg CO₂e per therm
    const heatingOilEmissions = heatingOil * 2.52; // kg CO₂e per gallon
    const propaneEmissions = propane * 1.56; // kg CO₂e per gallon

    return energyEmissions + naturalGasEmissions + heatingOilEmissions + propaneEmissions; // Total emissions from energy
}

// Function to save emissions data to Firebase
function saveEmissionsDataToFirebase(date, carEmissions, dietEmissions, energyEmissions, totalEmissions) {
    const userId = localStorage.getItem('loggedInUserId');
    if (userId) {
        const userRef = doc(db, 'users', userId); // Reference to the user's document in Firestore
        const emissionsData = {
            date: date,
            carEmissions: carEmissions,
            dietEmissions: dietEmissions,
            energyEmissions: energyEmissions,
            totalEmissions: totalEmissions
        };

        // Update the user's document with the new emissions data
        setDoc(userRef, {
            emissions: emissionsData
        }, { merge: true }) // Merge allows you to add to the document without overwriting it
        .then(() => {
            console.log("Emissions data saved successfully!");
        })
        .catch((error) => {
            console.error("Error saving emissions data:", error);
        });
    } else {
        console.log("User not logged in.");
    }
}

// Function to display results
function displayResults(date, carEmissions, dietEmissions, energyEmissions, totalEmissions) {
    document.getElementById('result-date').textContent = date;
    document.getElementById('result-car').textContent = carEmissions.toFixed(2);
    document.getElementById('result-diet').textContent = dietEmissions.toFixed(2);
    document.getElementById('result-energy').textContent = energyEmissions.toFixed(2);
    document.getElementById('result-total').textContent = totalEmissions.toFixed(2);

    // Hide the form and show the results
    document.getElementById('carbon-footprint-form').style.display = 'none';
    document.getElementById('result').style.display = 'block';
}

// Function to generate lifestyle advice
function generateLifestyleAdvice(carEmissions, dietEmissions, energyEmissions) {
    let advice = "";
    let link = "";

    if (carEmissions > 100) {
        advice += "Consider reducing your driving or switching to a more efficient vehicle.";
        link = "https://www.epa.gov/greenvehicles";
    }

    if (dietEmissions > 50) {
        advice += " Try reducing your meat consumption or eating more plant-based foods.";
        link = "https://www.peta.org/living/food/";
    }

    if (energyEmissions > 50) {
        advice += " Consider using energy-efficient appliances or renewable energy sources.";
        link = "https://www.energy.gov/energysaver/energy-efficient-home";
    }

    return { advice, link };
}

// Function to display lifestyle advice
function displayLifestyleAdvice(advice, link) {
    const lifestyleElement = document.getElementById('lifestyle-advice');
    lifestyleElement.innerHTML = `<p>${advice}</p><a href="${link}" target="_blank">Learn more</a>`;
}
