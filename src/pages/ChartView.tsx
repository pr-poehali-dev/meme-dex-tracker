import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { createChart, IChartApi, ISeriesApi, CandlestickData, LineData } from 'lightweight-charts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

interface Indicator {
  id: string;
  name: string;
  enabled: boolean;
  color: string;
}

const ChartView = () => {
  const { ticker = 'DOGEUSDT' } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  
  const [selectedTimeframe, setSelectedTimeframe] = useState(searchParams.get('tf') || '1h');
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  const [showSettings, setShowSettings] = useState(false);
  
  const [indicators, setIndicators] = useState<Indicator[]>([
    { id: 'rsi', name: 'RSI', enabled: false, color: '#ff6a00' },
    { id: 'ema', name: 'EMA 20', enabled: false, color: '#00ff7f' },
    { id: 'bollinger', name: 'Bollinger Bands', enabled: false, color: '#ff2e2e' },
    { id: 'macd', name: 'MACD', enabled: false, color: '#ffff00' },
    { id: 'volume', name: 'Volume', enabled: true, color: '#666' },
    { id: 'pumpdump', name: 'Pump/Dump Signals', enabled: true, color: '#ff6a00' }
  ]);

  // Mock данные для свечей
  const generateMockData = useCallback(() => {
    const data: CandlestickData[] = [];
    let basePrice = 0.087432;
    const now = Math.floor(Date.now() / 1000);
    const timeframeMinutes = {
      '1m': 1, '5m': 5, '15m': 15, '1h': 60, '4h': 240, '1d': 1440
    }[selectedTimeframe] || 60;
    
    for (let i = 200; i >= 0; i--) {
      const time = now - (i * timeframeMinutes * 60);
      const volatility = 0.02;
      const change = (Math.random() - 0.5) * volatility;
      
      const open = basePrice;
      const close = open * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      data.push({
        time: time as any,
        open,
        high,
        low,
        close
      });
      
      basePrice = close;
    }
    
    return data;
  }, [selectedTimeframe]);

  // Инициализация графика
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#0a0a0a' },
        textColor: '#d1d4dc',
        fontSize: 12,
        fontFamily: 'ui-monospace, monospace'
      },
      grid: {
        vertLines: { color: '#1a1a1a' },
        horzLines: { color: '#1a1a1a' }
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#ff6a00',
          width: 1,
          style: 2
        },
        horzLine: {
          color: '#ff6a00',
          width: 1,
          style: 2
        }
      },
      rightPriceScale: {
        borderColor: '#333',
        textColor: '#d1d4dc'
      },
      timeScale: {
        borderColor: '#333',
        timeVisible: true,
        secondsVisible: false
      },
      watermark: {
        color: '#ff6a0020',
        visible: true,
        text: `${ticker} • MemeDex Pro`,
        fontSize: 24,
        fontFamily: 'ui-monospace, monospace'
      }
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#00ff7f',
      downColor: '#ff2e2e',
      borderDownColor: '#ff2e2e',
      borderUpColor: '#00ff7f',
      wickDownColor: '#ff2e2e',
      wickUpColor: '#00ff7f'
    });

    const data = generateMockData();
    candlestickSeries.setData(data);

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Обработчик изменения размера
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [ticker, generateMockData]);

  // Горячие клавиши
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      const key = e.key.toLowerCase();
      
      switch (key) {
        case 'r':
          toggleIndicator('rsi');
          break;
        case 'e':
          toggleIndicator('ema');
          break;
        case 'b':
          toggleIndicator('bollinger');
          break;
        case 'm':
          toggleIndicator('macd');
          break;
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

  const toggleIndicator = (id: string) => {
    setIndicators(prev => prev.map(ind => 
      ind.id === id ? { ...ind, enabled: !ind.enabled } : ind
    ));
  };

  const setTimeframe = (tf: string) => {
    setSelectedTimeframe(tf);
    setSearchParams(prev => {
      prev.set('tf', tf);
      return prev;
    });
  };

  const shareChart = () => {
    const enabledIndicators = indicators.filter(i => i.enabled).map(i => i.id);
    const url = `${window.location.origin}/chart/${ticker}?tf=${selectedTimeframe}&indicators=${enabledIndicators.join(',')}`;
    navigator.clipboard.writeText(url);
  };

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

              {/* Chart Type */}
              <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                <SelectTrigger className="w-32 border-neon-orange">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candlestick">Свечи</SelectItem>
                  <SelectItem value="line">Линия</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={shareChart}
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
          <div 
            ref={chartContainerRef}
            className="w-full h-full min-h-[600px] bg-cyber-black"
            style={{ height: 'calc(100vh - 80px)' }}
          />
          
          {/* Chart Overlay Info */}
          <div className="absolute top-4 left-4 bg-cyber-black/80 backdrop-blur-sm rounded-lg p-3 border border-border">
            <div className="text-neon-green text-sm font-mono">
              <div>Горячие клавиши:</div>
              <div className="text-xs text-muted-foreground mt-1">
                R=RSI • E=EMA • B=Bollinger • M=MACD<br/>
                1,5,6,H,4,D=Таймфреймы • ESC=Назад
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
                  Индикаторы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {indicators.map((indicator) => (
                  <div key={indicator.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-cyber-gray/30">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: indicator.color }}
                      />
                      <Label className="text-sm font-medium">{indicator.name}</Label>
                    </div>
                    <Switch
                      checked={indicator.enabled}
                      onCheckedChange={() => toggleIndicator(indicator.id)}
                      className="data-[state=checked]:bg-neon-orange"
                    />
                  </div>
                ))}

                <div className="pt-4 space-y-3">
                  <div className="border-t border-border pt-4">
                    <Label className="text-sm font-medium text-neon-green mb-2 block">
                      Pump/Dump Детектор
                    </Label>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Чувствительность</span>
                        <span className="text-neon-orange">Высокая</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Фильтр шума</span>
                        <span className="text-neon-green">Включён</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full border-neon-green text-neon-green hover:bg-neon-green/10"
                  >
                    <Icon name="Save" className="mr-2 h-4 w-4" />
                    Сохранить Workspace
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