import ExpoModulesCore
import CoreHaptics

public class ExpoCoreHapticsModule: Module {
    private var engine: CHHapticEngine?
    private var continuousPlayer: CHHapticAdvancedPatternPlayer?

    public func definition() -> ModuleDefinition {
        Name("ExpoCoreHaptics")

        // Inicializa o engine
        Function("prepare") {
            self.prepareHapticEngine()
        }

        // Transient tap (equivalente ao impactAsync mas com controle)
        Function("transient") { (intensity: Double, sharpness: Double) in
            self.playTransient(intensity: Float(intensity), sharpness: Float(sharpness))
        }

        // Inicia vibração contínua
        Function("startContinuous") { (intensity: Double, sharpness: Double, duration: Double) in
            self.startContinuous(intensity: Float(intensity), sharpness: Float(sharpness), duration: duration)
        }

        // Atualiza parâmetros em tempo real (enquanto vibra)
        Function("updateContinuous") { (intensity: Double, sharpness: Double) in
            self.updateContinuousParameters(intensity: Float(intensity), sharpness: Float(sharpness))
        }

        // Para vibração contínua
        Function("stopContinuous") {
            self.stopContinuous()
        }

        // Toca padrão AHAP (JSON)
        Function("playPattern") { (ahapJSON: String) in
            self.playAHAPPattern(json: ahapJSON)
        }

        // Toca sequência com parameter curve (grave → agudo em X segundos)
        Function("playRamp") { (
            fromIntensity: Double,
            toIntensity: Double,
            fromSharpness: Double,
            toSharpness: Double,
            duration: Double
        ) in
            self.playRamp(
                fromIntensity: Float(fromIntensity),
                toIntensity: Float(toIntensity),
                fromSharpness: Float(fromSharpness),
                toSharpness: Float(toSharpness),
                duration: duration
            )
        }

        // Verifica se device suporta haptics
        Function("isSupported") { () -> Bool in
            return CHHapticEngine.capabilitiesForHardware().supportsHaptics
        }
    }

    // ============ IMPLEMENTAÇÕES ============

    private func prepareHapticEngine() {
        guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else { return }

        do {
            engine = try CHHapticEngine()
            engine?.playsHapticsOnly = true
            engine?.isAutoShutdownEnabled = true

            engine?.resetHandler = { [weak self] in
                do {
                    try self?.engine?.start()
                } catch {
                    print("Failed to restart haptic engine: \(error)")
                }
            }

            // Handler para quando o engine para (ex: app vai pro background)
            engine?.stoppedHandler = { [weak self] reason in
                print("Haptic engine stopped: \(reason.rawValue)")
            }

            try engine?.start()
        } catch {
            print("Failed to create haptic engine: \(error)")
        }
    }

    private func playTransient(intensity: Float, sharpness: Float) {
        // Garante que o engine está rodando
        ensureEngineRunning()

        guard let engine = engine else { return }

        do {
            let event = CHHapticEvent(
                eventType: .hapticTransient,
                parameters: [
                    CHHapticEventParameter(parameterID: .hapticIntensity, value: clamp(intensity)),
                    CHHapticEventParameter(parameterID: .hapticSharpness, value: clamp(sharpness))
                ],
                relativeTime: 0
            )

            let pattern = try CHHapticPattern(events: [event], parameters: [])
            let player = try engine.makePlayer(with: pattern)
            try player.start(atTime: CHHapticTimeImmediate)
        } catch {
            print("Failed to play transient: \(error)")
        }
    }

    private func startContinuous(intensity: Float, sharpness: Float, duration: Double) {
        ensureEngineRunning()

        guard let engine = engine else { return }

        // Para player anterior se existir
        stopContinuous()

        do {
            let event = CHHapticEvent(
                eventType: .hapticContinuous,
                parameters: [
                    CHHapticEventParameter(parameterID: .hapticIntensity, value: clamp(intensity)),
                    CHHapticEventParameter(parameterID: .hapticSharpness, value: clamp(sharpness))
                ],
                relativeTime: 0,
                duration: duration
            )

            let pattern = try CHHapticPattern(events: [event], parameters: [])
            continuousPlayer = try engine.makeAdvancedPlayer(with: pattern)
            try continuousPlayer?.start(atTime: CHHapticTimeImmediate)
        } catch {
            print("Failed to start continuous: \(error)")
        }
    }

    private func updateContinuousParameters(intensity: Float, sharpness: Float) {
        guard continuousPlayer != nil else { return }

        do {
            let intensityParam = CHHapticDynamicParameter(
                parameterID: .hapticIntensityControl,
                value: clamp(intensity),
                relativeTime: 0
            )
            let sharpnessParam = CHHapticDynamicParameter(
                parameterID: .hapticSharpnessControl,
                value: clamp(sharpness),
                relativeTime: 0
            )
            try continuousPlayer?.sendParameters([intensityParam, sharpnessParam], atTime: CHHapticTimeImmediate)
        } catch {
            print("Failed to update parameters: \(error)")
        }
    }

    private func stopContinuous() {
        guard continuousPlayer != nil else { return }

        do {
            try continuousPlayer?.stop(atTime: CHHapticTimeImmediate)
            continuousPlayer = nil
        } catch {
            print("Failed to stop continuous: \(error)")
        }
    }

    private func playRamp(
        fromIntensity: Float,
        toIntensity: Float,
        fromSharpness: Float,
        toSharpness: Float,
        duration: Double
    ) {
        ensureEngineRunning()

        guard let engine = engine else { return }

        do {
            // Evento contínuo que dura toda a rampa
            let event = CHHapticEvent(
                eventType: .hapticContinuous,
                parameters: [
                    CHHapticEventParameter(parameterID: .hapticIntensity, value: clamp(fromIntensity)),
                    CHHapticEventParameter(parameterID: .hapticSharpness, value: clamp(fromSharpness))
                ],
                relativeTime: 0,
                duration: duration
            )

            // Curva de intensidade (do valor inicial ao final)
            let intensityCurve = CHHapticParameterCurve(
                parameterID: .hapticIntensityControl,
                controlPoints: [
                    .init(relativeTime: 0, value: clamp(fromIntensity)),
                    .init(relativeTime: duration, value: clamp(toIntensity))
                ],
                relativeTime: 0
            )

            // Curva de sharpness (grave → agudo ou vice-versa)
            let sharpnessCurve = CHHapticParameterCurve(
                parameterID: .hapticSharpnessControl,
                controlPoints: [
                    .init(relativeTime: 0, value: clamp(fromSharpness)),
                    .init(relativeTime: duration, value: clamp(toSharpness))
                ],
                relativeTime: 0
            )

            let pattern = try CHHapticPattern(
                events: [event],
                parameterCurves: [intensityCurve, sharpnessCurve]
            )

            let player = try engine.makePlayer(with: pattern)
            try player.start(atTime: CHHapticTimeImmediate)
        } catch {
            print("Failed to play ramp: \(error)")
        }
    }

    private func playAHAPPattern(json: String) {
        ensureEngineRunning()

        guard let engine = engine,
              let data = json.data(using: .utf8) else { return }

        do {
            try engine.playPattern(from: data)
        } catch {
            print("Failed to play AHAP: \(error)")
        }
    }

    // ============ HELPERS ============

    private func ensureEngineRunning() {
        if engine == nil {
            prepareHapticEngine()
        } else {
            do {
                try engine?.start()
            } catch {
                // Engine já está rodando, ignorar
            }
        }
    }

    // Garante que o valor está entre 0.0 e 1.0
    private func clamp(_ value: Float) -> Float {
        return min(max(value, 0.0), 1.0)
    }
}
