import { useState } from 'react';
import { ArrowLeft, Maximize2, Minimize2, Eye, EyeOff, Search, Pin, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

interface Viewer3DScreenProps {
  onBack: () => void;
}

export function Viewer3DScreen({ onBack }: Viewer3DScreenProps) {
  const [layers, setLayers] = useState({
    skeletal: true,
    muscular: true,
    nervous: false,
    vascular: false,
  });

  const [fullscreen, setFullscreen] = useState(false);

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers({ ...layers, [layer]: !layers[layer] });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {!fullscreen && (
        <header className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h2>Explorador 3D</h2>
                <p className="text-sm text-muted-foreground">Visualizador anatômico interativo</p>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main 3D Viewer Area */}
      <div className="flex-1 relative flex">
        {/* 3D Canvas Mock */}
        <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative">
          <div className="text-center space-y-4">
            <div className="w-64 h-64 mx-auto bg-gray-700/50 rounded-full flex items-center justify-center">
              <div className="text-6xl">🦴</div>
            </div>
            <p className="text-white/60">
              Modelo 3D Interativo
              <br />
              <span className="text-sm">Arraste para rotacionar · Pinch para zoom</span>
            </p>
          </div>

          {/* 3D Controls Overlay */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setFullscreen(!fullscreen)}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              {fullscreen ? <Minimize2 className="w-5 h-5 text-white" /> : <Maximize2 className="w-5 h-5 text-white" />}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <RotateCcw className="w-5 h-5 text-white" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="absolute top-4 left-4 right-20">
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                <Input
                  placeholder="Buscar estrutura anatômica..."
                  className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>
          </div>

          {/* Pins/Annotations Mock */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-primary/90 hover:bg-primary text-white shadow-lg"
            >
              <Pin className="w-3 h-3 mr-1" />
              Fêmur
            </Button>
          </div>
        </div>

        {/* Sidebar - Layers Control */}
        {!fullscreen && (
          <div className="w-80 bg-card border-l border-border p-4 overflow-y-auto">
            <h3 className="mb-4">Camadas</h3>
            
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="skeletal" className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xl">🦴</span>
                    Sistema Esquelético
                  </Label>
                  <Switch
                    id="skeletal"
                    checked={layers.skeletal}
                    onCheckedChange={() => toggleLayer('skeletal')}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Ossos e articulações</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="muscular" className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xl">💪</span>
                    Sistema Muscular
                  </Label>
                  <Switch
                    id="muscular"
                    checked={layers.muscular}
                    onCheckedChange={() => toggleLayer('muscular')}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Músculos e tendões</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="nervous" className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xl">🧠</span>
                    Sistema Nervoso
                  </Label>
                  <Switch
                    id="nervous"
                    checked={layers.nervous}
                    onCheckedChange={() => toggleLayer('nervous')}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Nervos e gânglios</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="vascular" className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xl">❤️</span>
                    Sistema Vascular
                  </Label>
                  <Switch
                    id="vascular"
                    checked={layers.vascular}
                    onCheckedChange={() => toggleLayer('vascular')}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Artérias e veias</p>
              </Card>
            </div>

            <div className="mt-6 space-y-3">
              <h4>Missões Ativas</h4>
              <Card className="p-3 bg-primary/5 border-primary/20">
                <p className="text-sm mb-2">📍 Localize o forame redondo</p>
                <Button size="sm" variant="outline" className="w-full">
                  Iniciar Missão
                </Button>
              </Card>
              <Card className="p-3 bg-muted/50">
                <p className="text-sm mb-2">🔍 Identifique o trajeto do nervo facial</p>
                <Button size="sm" variant="outline" className="w-full" disabled>
                  Bloqueado
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
