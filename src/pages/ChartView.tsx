import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const ChartView = () => {
  const { ticker = 'DOGEUSDT' } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState(searchParams.get('tf') || '1h');
  const [showSettings, setShowSettings] = useState(false);

  const setTimeframe = (tf: string) => {
    setSelectedTimeframe(tf);
    setSearchParams(prev => {
      prev.set('tf', tf);
      return prev;
    });
  };

  // Горячие клавиши
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      const key = e.key.toLowerCase();
      
      switch (key) {
        case 'escape':
          navigate('/');
          break;
        case '1':
          setTimeframe('1m');
          break;
        case '5':
          setTimeframe('5m');
          break;
        case '6':
          setTimeframe('15m');
          break;
        case 'h':
          setTimeframe('1h');
          break;
        case '4':
          setTimeframe('4h');
          break;
        case 'd':
          setTimeframe('1d');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header Toolbar */}
      <div className="border-b border-border bg-cyber-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-neon-orange hover:bg-neon-orange/10"
              >
                <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
                Назад в Dashboard
              </Button>
              
              <div className="text-2xl font-bold">
                <span className="text-neon-orange">{ticker}</span>
                <span className="text-neon-green ml-2">Chart</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Timeframe Buttons */}
              <div className="flex gap-1">
                {['1m', '5m', '15m', '1h', '4h', '1d'].map((tf) => (
                  <Button
                    key={tf}
                    variant={selectedTimeframe === tf ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeframe(tf)}
                    className={`transition-all duration-300 ${
                      selectedTimeframe === tf 
                        ? 'bg-neon-orange text-black border-neon-orange neon-glow' 
                        : 'border-neon-orange text-neon-orange hover:bg-neon-orange/20'
                    }`}
                  >
                    {tf}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                className="border-neon-green text-neon-green hover:bg-neon-green/10"
              >
                <Icon name="Share" className="mr-2 h-4 w-4" />
                Поделиться
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowSettings(!showSettings)}
                className="border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10"
              >
                <Icon name="Settings" className="mr-2 h-4 w-4" />
                Настройки
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chart Container */}
        <div className="flex-1 relative">
          <div className="w-full h-full min-h-[600px] bg-cyber-black flex items-center justify-center">
            <div className="text-center">
              <Icon name="BarChart3" className="h-24 w-24 text-neon-orange mx-auto mb-6 neon-glow" />
              <h2 className="text-3xl font-bold text-neon-green mb-4">Professional Chart</h2>
              <p className="text-xl text-muted-foreground mb-4">{ticker} • {selectedTimeframe}</p>
              <p className="text-sm text-neon-orange mb-8">График загружается... Вскоре здесь будут живые свечи!</p>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="p-4 border border-neon-green/30 rounded-lg">
                  <div className="text-2xl font-bold text-neon-green">$0.087432</div>
                  <div className="text-sm text-muted-foreground">Текущая цена</div>
                </div>
                <div className="p-4 border border-neon-orange/30 rounded-lg">
                  <div className="text-2xl font-bold text-neon-orange">+12.45%</div>
                  <div className="text-sm text-muted-foreground">24h изменение</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart Overlay Info */}
          <div className="absolute top-4 left-4 bg-cyber-black/80 backdrop-blur-sm rounded-lg p-3 border border-border">
            <div className="text-neon-green text-sm font-mono">
              <div>Горячие клавиши:</div>
              <div className="text-xs text-muted-foreground mt-1">
                1,5,6,H,4,D = Таймфреймы<br/>
                ESC = Назад в Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Right Settings Panel */}
        {showSettings && (
          <div className="w-80 border-l border-border bg-cyber-black/50 backdrop-blur-sm">
            <Card className="cyber-card h-full rounded-none border-0">
              <CardHeader>
                <CardTitle className="text-neon-orange flex items-center gap-2">
                  <Icon name="Settings" className="h-5 w-5" />
                  Настройки графика
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg border border-border bg-cyber-gray/30">
                  <div className="text-sm font-medium text-neon-green mb-2">Индикаторы</div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div>• RSI - Относительная сила</div>
                    <div>• EMA - Экспоненциальная скользящая</div>
                    <div>• Bollinger Bands - Полосы Боллинджера</div>
                    <div>• MACD - Схождение-расхождение</div>
                    <div>• Volume - Объём торгов</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border bg-cyber-gray/30">
                  <div className="text-sm font-medium text-neon-orange mb-2">Pump/Dump Детектор</div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Статус: <span className="text-neon-green">Активен</span></div>
                    <div>Чувствительность: <span className="text-neon-orange">Высокая</span></div>
                    <div>Фильтр шума: <span className="text-neon-green">Включён</span></div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-neon-green text-neon-green hover:bg-neon-green/10"
                  >
                    <Icon name="Save" className="mr-2 h-4 w-4" />
                    Сохранить настройки
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full border-neon-orange text-neon-orange hover:bg-neon-orange/10"
                  >
                    <Icon name="Download" className="mr-2 h-4 w-4" />
                    Экспорт изображения
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="border-t border-border bg-cyber-black/50 backdrop-blur-sm px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Подключено к MEXC</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span>Live Data</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>Последние данные: {new Date().toLocaleTimeString()}</span>
            <span className="text-neon-orange">MemeDex Pro v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartView;