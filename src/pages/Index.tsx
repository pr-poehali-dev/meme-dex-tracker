import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

interface CoinData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  signal?: 'pump' | 'dump' | 'neutral';
}

const mockCoins: CoinData[] = [
  { symbol: "DOGEUSDT", price: 0.087432, change24h: 12.45, volume: 2847392, signal: 'pump' },
  { symbol: "PEPEUSDT", price: 0.000012, change24h: -8.32, volume: 1847293, signal: 'dump' },
  { symbol: "SHIBUSDT", price: 0.000023, change24h: 5.67, volume: 3847293, signal: 'neutral' },
  { symbol: "FLOKIUSDT", price: 0.000045, change24h: 15.23, volume: 1247293, signal: 'pump' },
  { symbol: "BONKUSDT", price: 0.000067, change24h: -3.45, volume: 947293, signal: 'neutral' },
];

const signals = [
  { coin: "DOGEUSDT", type: "pump", message: "Pump detected - 3 мин до рывка", time: "2 мин назад" },
  { coin: "PEPEUSDT", type: "dump", message: "Dump detected - ожидаем падение", time: "5 мин назад" },
  { coin: "FLOKIUSDT", type: "pump", message: "Strong pump signal", time: "1 мин назад" },
];

export default function Index() {
  const [selectedCoin, setSelectedCoin] = useState<string>("DOGEUSDT");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCoins = mockCoins.filter(coin => 
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSignalColor = (signal?: string) => {
    switch (signal) {
      case 'pump': return 'text-neon-green';
      case 'dump': return 'text-neon-red';
      default: return 'text-neon-yellow';
    }
  };

  const getSignalIcon = (signal?: string) => {
    switch (signal) {
      case 'pump': return 'TrendingUp';
      case 'dump': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-cyber-black to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,106,0,0.1)_0%,transparent_70%)]" />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="mb-6">
            <h1 className="text-6xl font-bold mb-4">
              <span className="text-neon-orange neon-text pulse-neon">Meme</span>
              <span className="text-neon-green neon-text">Dex</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Realtime графики мем-коинов. Pump & Dump сигналы до того, как рынок рванёт
            </p>
            <Button 
              size="lg" 
              className="bg-neon-orange hover:bg-neon-orange/80 text-black font-bold neon-glow"
            >
              <Icon name="Rocket" className="mr-2 h-5 w-5" />
              🚀 Открыть дашборд
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="cyber-card">
              <CardHeader>
                <div className="text-neon-magenta text-2xl mb-2">🔮</div>
                <CardTitle className="text-neon-green">Предиктивные индикаторы</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Видим движение до того, как его увидит толпа</p>
              </CardContent>
            </Card>
            
            <Card className="cyber-card">
              <CardHeader>
                <div className="text-neon-orange text-2xl mb-2">📊</div>
                <CardTitle className="text-neon-green">Профессиональные графики</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Графики уровня TradingView с неоновым стилем</p>
              </CardContent>
            </Card>
            
            <Card className="cyber-card">
              <CardHeader>
                <div className="text-neon-yellow text-2xl mb-2">⚡</div>
                <CardTitle className="text-neon-green">Real-time данные</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Прямое подключение к MEXC/Bitget</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Panel - Watchlist */}
          <div className="lg:col-span-1">
            <Card className="cyber-card h-fit">
              <CardHeader>
                <CardTitle className="text-neon-orange flex items-center gap-2">
                  <Icon name="Eye" className="h-5 w-5" />
                  Watchlist
                </CardTitle>
                <div className="relative">
                  <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск тикера..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-cyber-gray border-border"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {filteredCoins.map((coin) => (
                  <div
                    key={coin.symbol}
                    onClick={() => setSelectedCoin(coin.symbol)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      selectedCoin === coin.symbol 
                        ? 'border-neon-orange bg-neon-orange/10' 
                        : 'border-border hover:border-neon-orange/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{coin.symbol}</span>
                      <Icon 
                        name={getSignalIcon(coin.signal)} 
                        className={`h-4 w-4 ${getSignalColor(coin.signal)}`} 
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">${coin.price.toFixed(6)}</span>
                      <span className={coin.change24h >= 0 ? 'text-neon-green' : 'text-neon-red'}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-neon-orange text-neon-orange hover:bg-neon-orange/10"
                >
                  <Icon name="Plus" className="mr-2 h-4 w-4" />
                  Добавить монету
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Center - Chart */}
          <div className="lg:col-span-2">
            <Card className="cyber-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-neon-green flex items-center gap-2">
                    <Icon name="BarChart3" className="h-5 w-5" />
                    {selectedCoin}
                  </CardTitle>
                  <div className="flex gap-2">
                    {['1m', '5m', '15m', '1h', '4h', '1d'].map((timeframe) => (
                      <Button 
                        key={timeframe}
                        variant="outline" 
                        size="sm"
                        className="border-neon-orange text-neon-orange hover:bg-neon-orange/20"
                      >
                        {timeframe}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-cyber-gray rounded-lg flex items-center justify-center border border-border">
                  <div className="text-center">
                    <Icon name="BarChart3" className="h-16 w-16 text-neon-orange mx-auto mb-4 neon-glow" />
                    <p className="text-neon-green text-lg font-medium">Trading Chart</p>
                    <p className="text-muted-foreground">Профессиональный график {selectedCoin}</p>
                    <div className="mt-4 flex justify-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-neon-green neon-glow"></div>
                        <span className="text-sm text-neon-green">Pump Zone</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-neon-red neon-glow"></div>
                        <span className="text-sm text-neon-red">Dump Zone</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-neon-yellow neon-glow"></div>
                        <span className="text-sm text-neon-yellow">Neutral</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Signals */}
          <div className="lg:col-span-1">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-neon-red flex items-center gap-2">
                  <Icon name="Zap" className="h-5 w-5" />
                  Live Сигналы
                </CardTitle>
                <CardDescription>Real-time pump/dump детекция</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {signals.map((signal, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg border border-border bg-cyber-gray/50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="outline" 
                        className={`${signal.type === 'pump' ? 'border-neon-green text-neon-green' : 'border-neon-red text-neon-red'} neon-glow`}
                      >
                        {signal.type === 'pump' ? '🚀' : '⚠️'} {signal.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{signal.time}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{signal.coin}</p>
                    <p className="text-xs text-muted-foreground">{signal.message}</p>
                  </div>
                ))}
                
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full border-neon-green text-neon-green hover:bg-neon-green/10"
                  >
                    <Icon name="Settings" className="mr-2 h-4 w-4" />
                    Настройки сигналов
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}