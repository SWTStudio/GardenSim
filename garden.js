// Garden grid and core game mechanics
class Garden {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = this.createGrid(width, height);
    }
    
    createGrid(width, height) {
        const grid = [];
        
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                row.push({
                    plant: null,
                    soilMoisture: 50,
                    soilQuality: 50,
                    sunExposure: "full",
                    weedLevel: 0,
                    isPlowed: false,
                    soilTemperature: 65 // Initialize with moderate soil temperature
                });
            }
            grid.push(row);
        }
        
        return grid;
    }
    
    getCell(x, y) {
        return this.grid[y][x];
    }
    
    waterGardenFromRain(rainfallAmount) {
        // Add moisture to all cells based on rainfall
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.getCell(x, y);
                
                // Add rainfall to soil moisture (capped at 100%)
                cell.soilMoisture = Math.min(100, cell.soilMoisture + rainfallAmount);
                
                if (rainfallAmount > 0) {
                    console.log(`Rain added ${rainfallAmount}% moisture to plot (${x},${y}). New moisture: ${cell.soilMoisture}%`);
                }
            }
        }
    }
    
    // Water the plot, filling to 100%
    waterPlot(x, y) {
        const cell = this.getCell(x, y);
        cell.soilMoisture = 100;
        console.log(`Watered plot at (${x},${y}). New moisture: ${cell.soilMoisture}%`);
    }
    
    // Plant a seed in the plot
    plantSeed(x, y, plantType = 'tomato') {
        const cell = this.getCell(x, y);
        if (!cell.plant) {
            cell.plant = new Plant(plantType);
            console.log(`Planted ${cell.plant.name} seed at (${x},${y}), preferred season: ${cell.plant.preferredSeason}`);
            return true;
        } else {
            console.log(`Cannot plant, plot at (${x},${y}) already contains a plant`);
            return false;
        }
    }
    
    // Harvest a mature plant - now considers plant lifecycle
    harvestPlant(x, y) {
        const cell = this.getCell(x, y);
        if (cell.plant && cell.plant.isHarvestable()) {
            // Get harvest reward
            const harvestReward = cell.plant.harvestReward;
            
            // Use plant's harvest method to determine if plant should be removed
            const shouldRemove = cell.plant.harvest();
            
            if (shouldRemove) {
                cell.plant = null;
                console.log(`Plant removed after harvest at (${x},${y})`);
            } else {
                console.log(`Plant remains after harvest at (${x},${y})`);
            }
            
            return harvestReward;
        } else if (cell.plant) {
            console.log(`Plant at (${x},${y}) is not ready for harvest`);
            return 0;
        } else {
            console.log(`No plant to harvest at (${x},${y})`);
            return 0;
        }
    }
    
    // Clear a plot (remove dead or unwanted plants)
    clearPlot(x, y) {
        const cell = this.getCell(x, y);
        if (cell.plant) {
            console.log(`Cleared plot at (${x},${y})`);
            cell.plant = null;
            return true;
        } else {
            console.log(`No plant to clear at (${x},${y})`);
            return false;
        }
    }
    
    // Update soil temperatures based on air temperature
    updateSoilTemperatures(airTemperature) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.getCell(x, y);
                
                // Soil temperature changes more slowly than air temperature
                // It's a weighted average of current soil temp and air temp
                const soilTempChangeRate = 0.3; // 30% change toward air temp each day
                cell.soilTemperature = cell.soilTemperature + 
                    (airTemperature - cell.soilTemperature) * soilTempChangeRate;
                
                // Round to nearest degree
                cell.soilTemperature = Math.round(cell.soilTemperature);
            }
        }
    }
    
    // Check all plants for temperature-related deaths
    checkPlantsForTemperatureEffects(airTemperature) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.getCell(x, y);
                
                if (cell.plant) {
                    cell.plant.checkTemperatureSurvival(airTemperature);
                }
            }
        }
    }
    
    // Update the garden for a new day
    advanceDay(moistureReduction, environmentModifier, currentSeason, rainfallAmount, airTemperature) {
        // First, update soil temperatures
        this.updateSoilTemperatures(airTemperature);
        
        // Check plants for temperature effects (frost damage, etc.)
        this.checkPlantsForTemperatureEffects(airTemperature);
        
        // Apply rainfall if any
        if (rainfallAmount > 0) {
            this.waterGardenFromRain(rainfallAmount);
        }
        
        // Then update each cell
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.getCell(x, y);
                
                // Update plant growth if present and if there's moisture
                if (cell.plant && cell.soilMoisture > 0) {
                    // Pass soil temperature to the growth function
                    cell.plant.grow(
                        cell.soilMoisture, 
                        environmentModifier, 
                        currentSeason,
                        cell.soilTemperature
                    );
                }
                
                // Reduce moisture after growth has been calculated
                cell.soilMoisture = Math.max(0, cell.soilMoisture - moistureReduction);
                
                // Log the cell's state after updates
                if (cell.plant) {
                    const plantState = cell.plant.isDormant ? "DORMANT" : 
                                       cell.plant.isDead ? "DEAD" : 
                                       cell.plant.growthStage;
                    
                    console.log(`Cell (${x},${y}): Plant=${cell.plant.type}, Stage=${plantState}, Progress=${cell.plant.growthProgress.toFixed(1)}%, Moisture=${cell.soilMoisture}%, Soil Temp=${cell.soilTemperature}°F`);
                }
            }
        }
    }
}

// Create global garden instance
const garden = new Garden(5, 5);