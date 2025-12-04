"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareWithBaseline = void 0;
function compareWithBaseline(baseline, comparison) {
    const percentDiff = ((comparison.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
    const compliant = comparison.ghgIntensity <= baseline.ghgIntensity * 0.98 || comparison.ghgIntensity <= 89.3368;
    return {
        routeId: comparison.routeId,
        baselineIntensity: baseline.ghgIntensity,
        comparisonIntensity: comparison.ghgIntensity,
        percentDiff,
        compliant,
    };
}
exports.compareWithBaseline = compareWithBaseline;
