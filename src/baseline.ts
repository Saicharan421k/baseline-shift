let baselineFeatures: Record<string, any> | null = null;
export async function loadBaselineData() {
    try {
        const featuresModule = await import('web-features');
        baselineFeatures = featuresModule.features;
        console.log('Baseline data loaded successfully.');
    } catch (error) {
        console.error('Failed to load Baseline data:', error);
        baselineFeatures = null;
    }
}
export function isBaselineSupported(featureId: string): boolean {
    if (!baselineFeatures) {
        return false;
    }
    const feature = baselineFeatures[featureId];
    if (feature && feature.status && feature.status.baseline === 'high') {
        return true;
    }
    return false;
}