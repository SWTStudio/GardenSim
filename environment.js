// Environment simulation for garden
class Environment {
    constructor() {
        this.temperature = 75; // Current temperature in Fahrenheit
        this.highTemp = 80;    // High temperature for the day
        this.lowTemp = 65;     // Low temperature for the day
        this.sunlight = "bright"; // bright, moderate, dim
        this.rainfall = 0; // 0-100% chance of rain
        this.season = "spring"; // spring, summer, fall, winter
        this.day = 1;
        this.daysInSeason = 20; // 20 days per season
        this.weatherConditions = "clear"; // clear, light rain, heavy rain
        
        // Season-specific temperature ranges
        this.seasonTemps = {
            spring: { min: 45, max: 75 },
            summer: { min: 65, max: 95 },
            fall: { min: 40, max: 75 },
            winter: { min: 20, max: 55 } // Winter can now get below freezing
        };
        
        // Season-specific rain chances (%)
        this.seasonRainChance = {
            spring: 40,
            summer: 20,
            fall: 35,
            winter: 25
        };
        
        // Track frost events
        this.frostWarning = false;
        
        // Initialize temperature for the first day
        this.generateDailyHighLow();
        this.updateTemperature();
    }

    advanceDay() {
        this.day++;
        
        // Check for season change (every 20 days)
        if (this.day % this.daysInSeason === 0) {
            this.changeSeason();
        }
        
        // Generate new high and low temperatures for the day
        this.generateDailyHighLow();
        
        // Update temperature within the high/low range
        this.updateTemperature();
        
        // Update other weather conditions
        this.updateConditions();
        
        // Return moisture reduction (affected by rainfall)
        return this.getMoistureReduction();
    }
    
    // Generate high and low temperatures for the day
    generateDailyHighLow() {
        const seasonRange = this.seasonTemps[this.season];
        
        // Base range for the season
        const baseMin = seasonRange.min;
        const baseMax = seasonRange.max;
        
        // Random variation (plus or minus up to 10 degrees)
        const variation = 10;
        
        // Generate high temperature with variation
        this.highTemp = Math.floor(
            Math.min(baseMax + Math.random() * variation, baseMax + variation)
        );
        
        // Generate low temperature with variation
        // Ensure it's at least 10 degrees below the high and above the minimum
        this.lowTemp = Math.floor(
            Math.max(
                Math.min(baseMin - variation * Math.random(), this.highTemp - 10),
                baseMin - variation
            )
        );
        
        console.log(`Day ${this.day}: High: ${this.highTemp}°F, Low: ${this.lowTemp}°F`);
    }
    
    // Update temperature randomly within high/low range
    updateTemperature() {
        const range = this.highTemp - this.lowTemp;
        
        // Generate temperature somewhere between the high and low
        // Weighted slightly toward the middle of the range
        const randomFactor = Math.random() * Math.random();
        this.temperature = Math.round(this.lowTemp + range * randomFactor);
        
        // Check for frost conditions
        this.frostWarning = this.temperature <= 32;
        if (this.frostWarning) {
            console.log(`⚠️ FROST WARNING: Temperature has dropped to ${this.temperature}°F!`);
        }
    }
    
    changeSeason() {
        const seasons = ["spring", "summer", "fall", "winter"];
        const currentIndex = seasons.indexOf(this.season);
        const nextIndex = (currentIndex + 1) % 4;
        this.season = seasons[nextIndex];
        console.log(`Season changed to ${this.season}!`);
    }

    updateConditions() {
        // Sunlight conditions
        const lightRoll = Math.random();
        if (lightRoll < 0.6) {
            this.sunlight = "bright";
        } else if (lightRoll < 0.9) {
            this.sunlight = "moderate";
        } else {
            this.sunlight = "dim";
        }
        
        // Weather conditions (rainfall)
        const rainChance = this.seasonRainChance[this.season];
        const rainRoll = Math.random() * 100;
        
        if (rainRoll < rainChance) {
            // It's going to rain!
            if (rainRoll < rainChance / 3) {
                this.weatherConditions = "heavy rain";
                this.rainfall = Math.floor(40 + Math.random() * 60); // 40-100% rainfall
                this.sunlight = "dim"; // Heavy rain means dim sunlight
            } else {
                this.weatherConditions = "light rain";
                this.rainfall = Math.floor(10 + Math.random() * 30); // 10-40% rainfall
                this.sunlight = "moderate"; // Light rain means moderate sunlight
            }
        } else {
            this.weatherConditions = "clear";
            this.rainfall = 0;
        }
        
        console.log(`Day ${this.day}: ${this.season}, ${this.temperature}°F (${this.lowTemp}-${this.highTemp}°F), ${this.sunlight} sunlight, ${this.weatherConditions} ${this.rainfall > 0 ? '(' + this.rainfall + '% rainfall)' : ''}`);
        
        if (this.frostWarning) {
            console.log(`⚠️ Frost conditions may damage sensitive plants!`);
        }
    }

    getMoistureReduction() {
        let reduction = 0;
        
        // Only reduce moisture on clear days
        if (this.rainfall === 0) {
            // Temperature effect (higher temp = more evaporation)
            if (this.temperature < 60) {
                reduction += 5; // Cool day
            } else if (this.temperature < 80) {
                reduction += 10; // Moderate day
            } else {
                reduction += 20; // Hot day
            }
            
            // Sunlight effect
            if (this.sunlight === "bright") {
                reduction += 15;
            } else if (this.sunlight === "moderate") {
                reduction += 10;
            } else {
                reduction += 5; // Dim sunlight
            }
        }
        
        // Ensure within the 0-50% range
        return Math.min(Math.max(reduction, 0), 50);
    }
    
    // Get current air temperature
    getAirTemperature() {
        return this.temperature;
    }

    getGrowthModifier() {
        let modifier = 1.0; // Start with neutral modifier
        
        // Temperature effect
        if (this.temperature >= 65 && this.temperature <= 85) {
            modifier += 0.5; // Increased ideal temperature bonus
        } else if (this.temperature < 55 || this.temperature > 95) {
            modifier -= 0.5; // Significant penalty for extreme temperatures
        } else {
            modifier -= 0.2; // Small penalty for slightly suboptimal temperatures
        }
        
        // Sunlight effect
        if (this.sunlight === "bright") {
            modifier += 0.5; // Increased sunlight bonus
        } else if (this.sunlight === "moderate") {
            modifier += 0.2;
        } else { // dim
            modifier -= 0.3; // Increased penalty for insufficient light
        }
        
        // Season effect - plants generally grow better in spring and summer
        if (this.season === "spring") {
            modifier += 0.2;
        } else if (this.season === "summer") {
            modifier += 0.3;
        } else if (this.season === "fall") {
            modifier -= 0.1;
        } else if (this.season === "winter") {
            modifier -= 0.3;
        }
        
        // Ensure modifier doesn't go below a minimum threshold
        return Math.max(modifier, 0.1);
    }
    
    // Get rainfall amount to add to soil moisture
    getRainfallMoisture() {
        return this.rainfall;
    }
}

// Create global environment instance
const environment = new Environment();