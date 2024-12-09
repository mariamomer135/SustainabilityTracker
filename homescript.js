// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut,updateEmail } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
document.getElementById('add-fruit').addEventListener('click', function() {
    addFruitField();
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



function displayGreeting() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const firstName = userDocSnap.data().firstName;
                document.getElementById("userFirstName").textContent = firstName;
            } else {
                console.log("No such document!");
            }
        } else {
            console.log("User is not signed in.");
        }
    });
}

// Call the function when the page loads
window.onload = displayGreeting;











async function fetchProgressData() {
    const user = auth.currentUser;
    if (!user) {
        console.log("User is not logged in.");
        return [];
    }

    try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            console.log("User document does not exist.");
            return [];
        }

        const userData = userDoc.data();
        if (!userData.emissions || !Array.isArray(userData.emissions)) {
            console.log("No emissions data available.");
            return [];
        }

        // Return the array of emissions data
        return userData.emissions.map(item => ({
            date: item.date,
            carEmissions: item.carEmissions || 0,
            dietEmissions: item.dietEmissions || 0,
            energyEmissions: item.energyEmissions || 0,
        }));
    } catch (error) {
        console.error("Error fetching progress data:", error);
        return [];
    }
}

async function getChartData() {
    const progressData = await fetchProgressData();

    // Extract labels (dates) and datasets (emission types)
    const labels = progressData.map(item => item.date);
    const carData = progressData.map(item => item.carEmissions);
    const dietData = progressData.map(item => item.dietEmissions);
    const energyData = progressData.map(item => item.energyEmissions);

    return { labels, carData, dietData, energyData };
}


// Display the line chart
function displayLineChart(labels, carData, dietData, energyData) {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    if (!ctx) {
        console.error('Canvas element not found.');
        return;
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Car Emissions (kg CO₂)',
                    data: carData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Diet Emissions (kg CO₂)',
                    data: dietData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Energy Emissions (kg CO₂)',
                    data: energyData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
// Get modal elements
// Modal Elements
const modal = document.getElementById('progressModal');
const viewProgressBtn = document.getElementById('view-progress-btn');
const closeBtn = document.querySelector('.close');

// Event Listener for View Progress Button
viewProgressBtn.addEventListener('click', async () => {
    const { labels, carData, dietData, energyData } = await getChartData();

    if (labels.length > 0) {
        // Render the chart
        displayLineChart(labels, carData, dietData, energyData);
        // Show the modal
        modal.style.display = 'block';
    } else {
        alert("No progress data available.");
    }
});

// Close modal when 'x' is clicked
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside of modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});






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
  

    // Calculate emissions
    const carEmissions = calculateCarEmissions(carDistance, fuelEfficiency, carType);
    const dietEmissions = calculateDietEmissions(fruit, fruitAmount, protein, proteinWeight, grains, grainsWeight, dairy, dairyWeight);
    const energyEmissions = calculateEnergyEmissions(energyUsage, naturalGas, heatingOil, propane);

    const idealCar = 8; // Ideal car emissions in kg
    const idealDiet = 6; // Ideal diet emissions in kg
    const idealEnergy = 9; // Ideal energy emissions in kg


    // Total emissions
    const totalEmissions = carEmissions + dietEmissions + energyEmissions;

    // Display results
    displayResults(date, carEmissions, dietEmissions, energyEmissions, totalEmissions);

    // Save emissions data to Firebase
    saveEmissionsDataToFirebase(date, carEmissions, dietEmissions, energyEmissions, totalEmissions);

    // Show lifestyle advice
    const { advice, link } = generateLifestyleAdvice(carEmissions, dietEmissions, energyEmissions);
    displayLifestyleAdvice(advice, link);


    function displayResults(date, carEmissions, dietEmissions, energyEmissions, totalEmissions) {
        document.getElementById('result-date').textContent = date;
        document.getElementById('result-car').textContent = carEmissions.toFixed(2);
        document.getElementById('result-diet').textContent = dietEmissions.toFixed(2);
        document.getElementById('result-energy').textContent = energyEmissions.toFixed(2);
        document.getElementById('result-total').textContent = totalEmissions.toFixed(2);
    
        // Hide the form and show the results
        document.getElementById('carbon-footprint-form').style.display = 'none';
        document.getElementById('result').style.display = 'block';
    
        // Display the emissions chart
        displayComparisonEmissionsChart(carEmissions, dietEmissions, energyEmissions, idealCar, idealDiet, idealEnergy);
    }
    











});


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('add-fruit').addEventListener('click', () => {
        const additionalFruits = document.getElementById('additional-fruits');
        const newFruit = document.createElement('div');
        newFruit.className = 'fruit-entry';
        newFruit.innerHTML = `
            <select class="fruit">
                <option value="apple">Apple</option>
                <option value="banana">Banana</option>
                <option value="orange">Orange</option>
            </select>
            <input type="number" class="fruit-amount" placeholder="Amount (kg)">
        `;
        additionalFruits.appendChild(newFruit);
    });

    document.getElementById('add-protein').addEventListener('click', () => {
        const additionalProtein = document.getElementById('additional-protein');
        const newProtein = document.createElement('div');
        newProtein.className = 'protein-entry';
        newProtein.innerHTML = `
            <select class="protein">
                <option value="beef">Beef</option>
                <option value="poultry">Poultry</option>
                <option value="fish">Fish</option>
                <option value="pork">Pork</option>
            </select>
            <input type="number" class="protein-weight" placeholder="Amount (kg)">
        `;
        additionalProtein.appendChild(newProtein);
    });

    document.getElementById('add-grain').addEventListener('click', () => {
        const additionalGrains = document.getElementById('additional-grains');
        const newGrain = document.createElement('div');
        newGrain.className = 'grain-entry';
        newGrain.innerHTML = `
            <select class="grains">
                <option value="rice">Rice</option>
                <option value="oats">Oats</option>
            </select>
            <input type="number" class="grains-weight" placeholder="Amount (kg)">
        `;
        additionalGrains.appendChild(newGrain);
    });

    document.getElementById('add-dairy').addEventListener('click', () => {
        const additionalDairy = document.getElementById('additional-dairy');
        const newDairy = document.createElement('div');
        newDairy.className = 'dairy-entry';
        newDairy.innerHTML = `
            <select class="dairy">
                <option value="milk">Milk</option>
                <option value="yogurt">Yogurt</option>
                <option value="cheese">Cheese</option>
            </select>
            <input type="number" class="dairy-weight" placeholder="Amount (kg)">
        `;
        additionalDairy.appendChild(newDairy);
    });
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













function displayComparisonEmissionsChart(carEmissions, dietEmissions, energyEmissions, idealCar, idealDiet, idealEnergy) {
    const ctx = document.getElementById('emissionsChart').getContext('2d');

    const data = {
        labels: ['Car', 'Diet', 'Energy'], // Categories for comparison
        datasets: [
            {
                label: 'Actual Emissions',
                data: [carEmissions, dietEmissions, energyEmissions], // Actual data values
                backgroundColor: 'rgba(255, 99, 132, 0.6)', // Color for actual emissions bars
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Ideal Emissions',
                data: [idealCar, idealDiet, idealEnergy], // Ideal values
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Color for ideal emissions bars
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true, // Start the Y-axis from 0 for better comparison
                ticks: {
                    stepSize: 10
                }
            }
        }
    };

    // Store the chart instance in a variable
    const myChart = new Chart(ctx, {
        type: 'bar', // Use bar chart for comparison
        data: data,
        options: options
    });

    // Add event listener for "Copy Link" button
    document.getElementById('copyLinkBtn').addEventListener('click', function () {
        const chartImageURL = myChart.toBase64Image(); // Get the image URL
        navigator.clipboard.writeText(chartImageURL) // Copy to clipboard
            .then(() => alert('Chart link copied to clipboard!'))
            .catch(err => alert('Failed to copy the link.'));
    });
}






















// Function to save emissions data to Firebase
// Function to save emissions data to Firebase


function saveEmissionsDataToFirebase(date, carEmissions, dietEmissions, energyEmissions, totalEmissions) {
    const user = auth.currentUser; // Get the current authenticated user
    if (user) {
        const userRef = doc(db, 'users', user.uid); // Reference to the user's document
        
        const emissionsData = {
            date: date,
            carEmissions: carEmissions,
            dietEmissions: dietEmissions,
            energyEmissions: energyEmissions,
            totalEmissions: totalEmissions
        };

        // Update the user's document by adding the new emission data to the emissions array
        updateDoc(userRef, {
            emissions: arrayUnion(emissionsData) // Ensure that the array is updated correctly
        })
        .then(() => {
            console.log("Emissions data added successfully!");
        })
        .catch((error) => {
            console.error("Error adding emissions data:", error);
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

    if (carEmissions >= dietEmissions && carEmissions >= energyEmissions) {
        advice = "Consider reducing your driving or switching to a more efficient vehicle.";
        link = "https://www.epa.gov/greenvehicles";
    } else if (dietEmissions >= carEmissions && dietEmissions >= energyEmissions) {
        advice = "Try reducing your meat consumption or eating more plant-based foods.";
        link = "https://www.wwf.org.uk/betterbasket";
    } else if (energyEmissions >= carEmissions && energyEmissions >= dietEmissions) {
        advice = "Consider using energy-efficient appliances or renewable energy sources.";
        link = "https://scied.ucar.edu/learning-zone/climate-solutions/reduce-greenhouse-gases";
    }

    return { advice, link };
}





















// Function to display lifestyle advice
function displayLifestyleAdvice(advice, link) {
    const lifestyleElement = document.getElementById('lifestyle-advice');
    lifestyleElement.innerHTML = `<p>${advice}</p><a href="${link}" target="_blank">Learn more</a>`;
}

const profileModal = document.getElementById('profileModal');
const editProfileLink = document.getElementById('editProfileLink');
const closeModal = document.querySelector('.close');

// Open modal when "Edit Profile" is clicked
editProfileLink.addEventListener('click', async (e) => {
    e.preventDefault();  // Prevent default anchor behavior
    console.log("Edit Profile clicked");
    profileModal.style.display = 'block';  // Show the modal

    // Load current user info (example with Firebase auth and Firestore)
    const user = auth.currentUser;
    if (user) {
        // Fetch data from Firestore (example code)
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('profileFirstName').value = data.firstName;
            document.getElementById('profileLastName').value = data.lastName;
            document.getElementById('profileEmail').value = user.email; // get email from auth user
        }
    }
});

// Close modal when 'x' (close button) is clicked
closeModal.addEventListener('click', () => {
    console.log("Close button clicked");
    profileModal.style.display = 'none';  // Hide the modal
});

// Close modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
    if (event.target === profileModal) {
        console.log("Clicked outside modal, closing...");
        profileModal.style.display = 'none';  // Hide the modal if clicked outside
    }
});



// Save changes to Firestore and update email
document.getElementById('saveProfile').addEventListener('click', async () => {
    const firstName = document.getElementById('profileFirstName').value;
    const lastName = document.getElementById('profileLastName').value;
    const email = document.getElementById('profileEmail').value;

    const user = auth.currentUser;

    try {
        // Update profile fields in Firestore
        if (user) {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                firstName: firstName,
                lastName: lastName
            });

            // Update email in Firebase Auth if it has changed
            if (email !== user.email) {
                await updateEmail(user, email);  // Requires user to have recently signed in
            }

            // Update local storage if using it for greeting
            localStorage.setItem('firstName', firstName);

            alert('Profile updated successfully!');
            profileModal.style.display = 'none';
        }
    } catch (error) {
        console.error("Error updating profile: ", error);
        alert(`Failed to update profile: ${error.message}`);
    }
});

