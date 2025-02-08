
const blessed = require('blessed');

const HUD = {

    screen: null,
    objects: {
        calculationTable: null
    },

    initScreen() {
        if (HUD.screen) return;
        HUD.screen = blessed.screen({
            smartCSR: true
        });
    },

    displayTopCalculations(calculations, rowCount=10) {
        HUD.initScreen();
        if (!HUD.objects.calculationTable) {
            HUD.objects.calculationTable = blessed.table({
                top: '0',
                left: 'center',
                width: '90%', // Increased width
                height: '50%',
                border: {
                    type: 'line'
                },
                style: {
                    header: {
                        fg: 'blue',
                        bold: true
                    }
                }
            });

            HUD.screen.append(HUD.objects.calculationTable);
        }

        const now = Date.now();

        // Added Velocity to the table
        let tableData = [['Trade', 'Profit', 'AB Age', 'BC Age', 'CA Age', 'Age', 'AB Vel', 'BC Vel', 'CA Vel']];

        Object.values(calculations)
            .filter(({depth: {ab, bc, ca}}) => ab.eventTime && bc.eventTime && ca.eventTime)
            .sort((a, b) => a.percent > b.percent ? -1 : 1)
            .slice(0, rowCount)
            .forEach(({ trade, percent, depth, ab, bc, ca }) => { // Destructure velocity
                tableData.push([
                    `${trade.symbol.a}-${trade.symbol.b}-${trade.symbol.c}`,
                    `${percent.toFixed(4)}%`,
                    `${now - depth.ab.eventTime}`,
                    `${now - depth.bc.eventTime}`,
                    `${now - depth.ca.eventTime}`,
                    `${now - Math.min(depth.ab.eventTime, depth.