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
                    isPlowed: false
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
    
    // Harvest a mature plant
    harvestPlant(x, y) {
        const cell = this.getCell(x, y);
        if (cell.plant && cell.plant.isHarvestable()) {
            console.log(`Harvested ${cell.plant.name} at (${x},${y})`);
            cell.plant = null;
            return true;
        } else if (cell.plant) {
            console.log(`Plant at (${x},${y}) is not ready for harvest`);
            return false;
        } else {
            console.log(`No plant to harvest at (${x},${y})`);
            return false;
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
    
    // Update the garden for a new day
    advanceDay(moistureReduction, environmentModifier, currentSeason, rainfallAmount) {
        // First, apply rainfall if any
        if (rainfallAmount > 0) {
            this.waterGardenFromRain(rainfallAmount);
        }
        
        // Then update each cell
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.getCell(x, y);
                
                // Update plant growth if present and if there's moisture
                if (cell.plant && cell.soilMoisture > 0) {
                    cell.plant.grow(cell.soilMoisture, environmentModifier, currentSeason);
                }
                
                // Reduce moisture after growth has been calculated
                cell.soilMoisture = Math.max(0, cell.soilMoisture - moistureReduction);
                
                // Log the cell's state after updates
                if (cell.plant) {
                    console.log(`Cell (${x},${y}): Plant=${cell.plant.type}, Stage=${cell.plant.growthStage}, Progress=${cell.plant.growthProgress.toFixed(1)}%, Moisture=${cell.soilMoisture}%`);
                }
            }
        }
    }
}

// Create global garden instance
const garden = new Garden(5, 5);