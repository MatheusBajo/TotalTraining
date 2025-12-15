declare module '*.ahap' {
    const content: {
        Version?: number;
        Metadata?: {
            Project?: string;
            Created?: string;
            Description?: string;
        };
        Pattern: Array<{
            Event?: {
                Time: number;
                EventType: 'HapticTransient' | 'HapticContinuous';
                EventDuration?: number;
                EventParameters: Array<{
                    ParameterID: 'HapticIntensity' | 'HapticSharpness';
                    ParameterValue: number;
                }>;
            };
            ParameterCurve?: {
                ParameterID: 'HapticIntensityControl' | 'HapticSharpnessControl';
                Time: number;
                ParameterCurveControlPoints: Array<{
                    Time: number;
                    ParameterValue: number;
                }>;
            };
        }>;
    };
    export default content;
}
