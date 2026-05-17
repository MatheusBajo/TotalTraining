# Core Haptics Module

Módulo nativo Expo que expõe a API Core Haptics do iOS para JavaScript, permitindo controle avançado sobre feedback háptico.

## Funcionalidades

- **Transient taps** com controle de intensidade e sharpness
- **Vibração contínua** com atualização de parâmetros em tempo real
- **Parameter curves** (ramps) para transições suaves tipo Duolingo
- **Padrões AHAP** para haptics complexos
- **Fallback automático** para Android/Web (não quebra, só não vibra)

## Instalação

O módulo já está configurado como dependência local. Para rebuildar:

```bash
npx expo prebuild --clean
npx expo run:ios
```

## Uso Básico

### Preparar o Engine

```tsx
import { useCoreHaptics } from 'core-haptics';

function App() {
  useCoreHaptics(); // Prepara automaticamente no mount

  return <YourApp />;
}
```

### Taps Simples

```tsx
import CoreHaptics from 'core-haptics';

// Presets
CoreHaptics.tap.light();   // Leve, agudo
CoreHaptics.tap.medium();  // Médio, balanceado
CoreHaptics.tap.heavy();   // Pesado, grave
CoreHaptics.tap.soft();    // Suave, orgânico (tipo heartbeat)
CoreHaptics.tap.rigid();   // Rígido, mecânico (tipo clique)

// Custom
CoreHaptics.tap.custom(0.7, 0.5); // intensity, sharpness
```

### Ramps (Transições)

Perfeito para sincronizar com animações:

```tsx
// Grave → Agudo (progresso enchendo)
CoreHaptics.ramp.graveToAgudo(1.0); // 1 segundo

// Agudo → Grave (relaxamento)
CoreHaptics.ramp.agudoToGrave(1.0);

// Build up (energia crescente)
CoreHaptics.ramp.buildUp(0.8);

// Fade out (diminui suavemente)
CoreHaptics.ramp.fadeOut(0.5);

// Custom
CoreHaptics.ramp.custom(
  fromIntensity, toIntensity,
  fromSharpness, toSharpness,
  duration
);
```

### Padrões Compostos

```tsx
// Moedas caindo (tipo game)
await CoreHaptics.patterns.coinDrop(5);

// Batimento cardíaco
await CoreHaptics.patterns.heartbeat(2);

// Sucesso
await CoreHaptics.patterns.success();

// Erro
await CoreHaptics.patterns.error();

// Meta atingida (celebração)
await CoreHaptics.patterns.goalComplete();

// Streak de fogo
await CoreHaptics.patterns.streakFire();
```

### Vibração Contínua (Gestos)

```tsx
import { useContinuousHaptic } from 'core-haptics';

function SliderWithHaptic() {
  const { start, update, stop } = useContinuousHaptic();

  const onGestureBegin = () => start(5); // max 5 segundos
  const onGestureUpdate = (progress) => update(progress);
  const onGestureEnd = () => stop();
}
```

### Hook para Animações de Progresso

```tsx
import { useProgressHaptic } from 'core-haptics';

function AnimatedProgressBar({ value }) {
  const { trigger, reset } = useProgressHaptic(10); // 10 steps

  useEffect(() => {
    reset();
    // Durante a animação, chamar:
    // trigger(currentProgress); // 0 a 1
  }, [value]);
}
```

## Exemplo: Substituindo no ProfileScreen

```tsx
// Antes (expo-haptics)
const triggerProgressiveHaptic = (progress: number) => {
  if (progress < 0.3) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } else if (progress < 0.7) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } else {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

// Depois (core-haptics) - Muito mais suave!
import CoreHaptics from 'core-haptics';

// Opção 1: Usar o pattern pronto
CoreHaptics.patterns.progressFill(progress);

// Opção 2: Usar ramp sincronizado com a animação
// Dispara UMA VEZ no início da animação
CoreHaptics.ramp.graveToAgudo(animationDuration / 1000);
```

## Sharpness vs Intensity

- **Intensity** (0.0 - 1.0): Quão forte é a vibração
- **Sharpness** (0.0 - 1.0): O "tom" da vibração
  - 0.0 = Grave, orgânico, suave (como batimento cardíaco)
  - 1.0 = Agudo, mecânico, preciso (como clique de botão)

## Notas

- **Só funciona no iOS** - Android não tem Core Haptics
- **Precisa de device físico** - Simulador não tem Taptic Engine
- **Chama `prepare()` no início** - O engine precisa estar pronto
- Valores fora de 0-1 são automaticamente clamped

## API Completa

```typescript
interface CoreHaptics {
  prepare(): void;
  isSupported(): boolean;

  tap: {
    light(): void;
    medium(): void;
    heavy(): void;
    soft(): void;
    rigid(): void;
    custom(intensity: number, sharpness: number): void;
  };

  continuous: {
    start(intensity: number, sharpness: number, duration: number): void;
    update(intensity: number, sharpness: number): void;
    stop(): void;
  };

  ramp: {
    graveToAgudo(duration: number): void;
    agudoToGrave(duration: number): void;
    buildUp(duration: number): void;
    fadeOut(duration: number): void;
    custom(...): void;
  };

  patterns: {
    coinDrop(count?: number): Promise<void>;
    heartbeat(beats?: number): Promise<void>;
    success(): Promise<void>;
    error(): Promise<void>;
    warning(): Promise<void>;
    tick(): void;
    pop(): void;
    bump(): void;
    countingNumber(progress: number): void;
    progressFill(progress: number): void;
    streakFire(): Promise<void>;
    goalComplete(): Promise<void>;
  };

  playAHAP(json: string): void;
}
```
