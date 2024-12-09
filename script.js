// Show the car section when the user clicks the button
document.getElementById('next-to-car').addEventListener('click', function() {
    document.getElementById('date-section').style.display = 'none';
    document.getElementById('car-section').style.display = 'block';
});

// Show the diet section when the user clicks the button
document.getElementById('next-to-diet').addEventListener('click', function() {
    document.getElementById('car-section').style.display = 'none';
    document.getElementById('diet-section').style.display = 'block';
});

// Show the energy section when the user clicks the button
document.getElementById('next-to-energy').addEventListener('click', function() {
    document.getElementById('diet-section').style.display = 'none';
    document.getElementById('energy-section').style.display = 'block';
});

// Handle the carbon footprint form submission
document.getElementById('carbon-footprint-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get user inputs
    const date = document.getElementById('date').value;
    const carDistance = parseFloat(document.getElementById('car-distance').value);
    const fuelEfficiency = parseFloat(document.getElementById('fuel-efficiency').value);
    const carType = document.getElementById('car-type').value;
    const fruit = document.getElementById('diet').value; // Assuming this gets the fruit choice
    const protein = document.getElementById('protein').value; // Protein choice
    const grains = document.getElementById('grains').value; // Grains choice
    const dairy = document.getElementById('dairy').value; // Dairy choice
    
    // Weight Inputs for Diet
    const fruitAmount = parseFloat(document.getElementById('fruit-amount').value);
    const proteinWeight = parseFloat(document.getElementById('protein-weight').value);
    const grainsWeight = parseFloat(document.getElementById('grains-weight').value);
    const dairyWeight = parseFloat(document.getElementById('dairy-weight').value);

    const energyUsage = parseFloat(document.getElementById('energy').value);

    // Validate inputs
    if (isNaN(carDistance) || isNaN(fuelEfficiency) || carDistance <= 0 || fuelEfficiency <= 0) {
        alert("Please enter valid values for distance and fuel efficiency.");
        return;
    }

    // Car emissions calculation
    let carEmissions = 0;
    let emissionFactor = 0;

    // Set emission factor based on car type
    if (carType === 'gasoline') {
        emissionFactor = 19.6; // pounds of CO2 per gallon for gasoline
    } else if (carType === 'diesel') {
        emissionFactor = 22.4; // pounds of CO2 per gallon for diesel
    }

    // Calculate gallons of fuel used
    const gallonsUsed = carDistance / fuelEfficiency;

    // Calculate car emissions in kg
    carEmissions = gallonsUsed * emissionFactor * 0.453592; // Convert to kg

    // Diet emissions calculation
    let dietEmissions = calculateDietEmissions(fruit, fruitAmount, protein, proteinWeight, grains, grainsWeight, dairy, dairyWeight);

    // Energy emissions calculation
    const energyEmissions = energyUsage * 0.92;  // Example: 0.92 kg CO2 per kWh

    // Total emissions
    const totalEmissions = carEmissions + dietEmissions + energyEmissions;

    // Display the results
    document.getElementById('result-date').textContent = date;
    document.getElementById('result-car').textContent = carEmissions.toFixed(2);
    document.getElementById('result-diet').textContent = dietEmissions.toFixed(2);
    document.getElementById('result-energy').textContent = energyEmissions.toFixed(2);
    document.getElementById('result-total').textContent = totalEmissions.toFixed(2);

    // Hide the form and show the results
    document.getElementById('carbon-footprint-form').style.display = 'none';
    document.getElementById('result').style.display = 'block';
});

// Diet emissions calculation function
function calculateDietEmissions(fruit, fruitAmount, protein, proteinWeight, grains, grainsWeight, dairy, dairyWeight) {
    let dietEmissions = 0;

    // Emission factors (kg CO₂e per unit)
    const emissionsFactors = {
        apple: 0.06,   // kg CO₂e per apple
        banana: 0.11,  // kg CO₂e per banana
        orange: 0.05,  // kg CO₂e per orange
        beef: 155,  
        pork: 24, // kg CO₂e per kg
        poultry: 18.2,  // kg CO₂e per kg
        fish: 13.4,     // kg CO₂e per kg
        rice: 1.6,     // kg CO₂e per kg
        oats: 1.0,     // kg CO₂e per kg
        milk: 3.57,     // kg CO₂e per kg
        yogurt: 2.92,   // kg CO₂e per kg
        cheese: 27.9,   // kg CO₂e per kg
    };

    // Calculate emissions for fruit
    if (emissionsFactors[fruit]) {
        dietEmissions += emissionsFactors[fruit] * fruitAmount;  // Assuming fruitWeight is the number of fruits
    }

    // Calculate emissions for protein
    if (emissionsFactors[protein]) {
        dietEmissions += emissionsFactors[protein] * proteinWeight;
    }

    // Calculate emissions for grains
    if (emissionsFactors[grains]) {
        dietEmissions += emissionsFactors[grains] * grainsWeight;
    }

    // Calculate emissions for dairy
    if (emissionsFactors[dairy]) {
        dietEmissions += emissionsFactors[dairy] * dairyWeight;
    }

    return dietEmissions;
}

