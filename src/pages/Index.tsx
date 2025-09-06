import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [generatedColors, setGeneratedColors] = useState<string[]>([]);
  const brandBookRef = useRef<HTMLDivElement>(null);
  const [brandData, setBrandData] = useState({
    companyName: '',
    font: '',
    colors: '',
    comments: ''
  });

  const generateColorPalette = (baseColors: string) => {
    // Генерируем умную цветовую палитру на основе введенных цветов
    const colorMap: { [key: string]: string[] } = {
      'синий': ['#0066CC', '#004499', '#3399FF', '#66B2FF'],
      'красный': ['#CC0000', '#990000', '#FF3333', '#FF6666'], 
      'зеленый': ['#00AA00', '#007700', '#33CC33', '#66FF66'],
      'фиолетовый': ['#6600CC', '#4400AA', '#9933FF', '#BB66FF'],
      'оранжевый': ['#FF6600', '#CC5500', '#FF8833', '#FFAA66'],
      'желтый': ['#FFCC00', '#CC9900', '#FFDD33', '#FFEE66'],
    };
    
    const lowerColors = baseColors.toLowerCase();
    for (const [colorName, palette] of Object.entries(colorMap)) {
      if (lowerColors.includes(colorName)) {
        return palette;
      }
    }
    
    // Дефолтная палитра если не найдено совпадений
    return ['#00D4FF', '#E94560', '#1A1A2E', '#16213E'];
  };

  const handleGenerate = async () => {
    if (!logoFile || !brandData.companyName) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Создаем URL для логотипа
    const logoURL = URL.createObjectURL(logoFile);
    setLogoUrl(logoURL);
    
    // Генерируем цветовую палитру
    const colors = generateColorPalette(brandData.colors);
    setGeneratedColors(colors);
    
    // Симуляция процесса генерации с этапами
    const stages = [
      'Анализ логотипа...',
      'Извлечение цветов...',
      'Создание палитры...',
      'Генерация макетов...',
      'Финальная обработка...'
    ];
    
    let currentStage = 0;
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        
        // Обновляем прогресс и переходим к следующему этапу
        if (prev % 20 === 0 && currentStage < stages.length - 1) {
          currentStage++;
        }
        
        return prev + 20;
      });
    }, 1000);
  };

  const handleDownload = async () => {
    if (!brandBookRef.current) return;
    
    try {
      // Захватываем визуальный брендбук как изображение
      const canvas = await html2canvas(brandBookRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Добавляем изображение на первую страницу
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Добавляем дополнительные страницы если нужно
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const filename = `brandbook-${brandData.companyName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background font-inter">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 animate-glow"></div>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Icon name="Cpu" size={48} className="text-primary animate-pulse" />
              <h1 className="text-6xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                AI BRAND GENERATOR
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Профессиональная нейросеть для создания брендбуков. Загрузите логотип, укажите параметры — получите полный брендбук за секунды.
            </p>

            <div className="flex items-center justify-center space-x-8 mt-8">
              <Badge variant="secondary" className="text-lg py-2 px-4">
                <Icon name="Zap" size={16} className="mr-2" />
                Мгновенная генерация
              </Badge>
              <Badge variant="secondary" className="text-lg py-2 px-4">
                <Icon name="Palette" size={16} className="mr-2" />
                Профессиональный дизайн
              </Badge>
              <Badge variant="secondary" className="text-lg py-2 px-4">
                <Icon name="Download" size={16} className="mr-2" />
                Готово к использованию
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* AI Visualization */}
      <div className="container mx-auto px-4 py-12">
        <div className="relative">
          <img 
            src="/img/bc2eb253-3fa0-4377-83c0-466c138dc211.jpg" 
            alt="AI Neural Network"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl border border-primary/20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-2xl"></div>
        </div>
      </div>

      {/* Generator Interface */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Input Form */}
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm animate-scale-in">
            <CardHeader>
              <CardTitle className="font-orbitron text-2xl flex items-center space-x-3">
                <Icon name="Settings" size={24} className="text-primary" />
                <span>Параметры брендбука</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Логотип компании</Label>
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer block">
                    <Icon name="Upload" size={32} className="mx-auto mb-4 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      {logoFile ? logoFile.name : 'Кликните или перетащите файл логотипа'}
                    </p>
                  </label>
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="company">Название компании</Label>
                <Input
                  id="company"
                  placeholder="Введите название компании"
                  value={brandData.companyName}
                  onChange={(e) => setBrandData({...brandData, companyName: e.target.value})}
                  className="bg-muted/50"
                />
              </div>

              {/* Font */}
              <div className="space-y-2">
                <Label htmlFor="font">Шрифт (опционально)</Label>
                <Input
                  id="font"
                  placeholder="Например: Roboto, Arial, Montserrat"
                  value={brandData.font}
                  onChange={(e) => setBrandData({...brandData, font: e.target.value})}
                  className="bg-muted/50"
                />
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <Label htmlFor="colors">Цветовая палитра</Label>
                <Input
                  id="colors"
                  placeholder="Например: синий, белый, серый"
                  value={brandData.colors}
                  onChange={(e) => setBrandData({...brandData, colors: e.target.value})}
                  className="bg-muted/50"
                />
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <Label htmlFor="comments">Дополнительные комментарии</Label>
                <Textarea
                  id="comments"
                  placeholder="Опишите стиль, настроение, особенности бренда..."
                  value={brandData.comments}
                  onChange={(e) => setBrandData({...brandData, comments: e.target.value})}
                  className="bg-muted/50 min-h-[100px]"
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!logoFile || !brandData.companyName || isGenerating}
                className="w-full py-6 text-lg font-orbitron bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 transition-all duration-300"
              >
                {isGenerating ? (
                  <>
                    <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                    Генерирую брендбук...
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" size={20} className="mr-2" />
                    Создать брендбук
                  </>
                )}
              </Button>

              {isGenerating && (
                <div className="space-y-2 animate-fade-in">
                  <div className="flex justify-between text-sm">
                    <span>Прогресс генерации</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview/Result */}
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm animate-slide-up">
            <CardHeader>
              <CardTitle className="font-orbitron text-2xl flex items-center space-x-3">
                <Icon name="Eye" size={24} className="text-primary" />
                <span>Предварительный просмотр</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generationProgress === 100 ? (
                <div ref={brandBookRef} className="space-y-6 animate-fade-in bg-white p-6 rounded-lg">
                  {/* Визуальный брендбук */}
                  <div className="text-center mb-8">
                    <h1 className="font-orbitron text-3xl font-bold text-gray-900 mb-2">
                      БРЕНДБУК
                    </h1>
                    <h2 className="text-2xl text-gray-700">{brandData.companyName}</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4"></div>
                  </div>

                  {/* Логотип */}
                  {logoUrl && (
                    <div className="text-center mb-8">
                      <h3 className="font-orbitron text-xl font-bold text-gray-800 mb-4">ЛОГОТИП</h3>
                      <div className="flex justify-center space-x-8">
                        <div className="bg-white p-4 border-2 border-gray-200 rounded-lg">
                          <img src={logoUrl} alt="Logo" className="h-16 w-auto" />
                        </div>
                        <div className="bg-gray-900 p-4 border-2 border-gray-200 rounded-lg">
                          <img src={logoUrl} alt="Logo" className="h-16 w-auto" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Цветовая палитра */}
                  <div className="mb-8">
                    <h3 className="font-orbitron text-xl font-bold text-gray-800 mb-4">ЦВЕТОВАЯ ПАЛИТРА</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {generatedColors.map((color, index) => (
                        <div key={index} className="text-center">
                          <div 
                            className="w-full h-20 rounded-lg shadow-md mb-2"
                            style={{ backgroundColor: color }}
                          ></div>
                          <p className="text-sm font-mono text-gray-700">{color}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Типографика */}
                  <div className="mb-8">
                    <h3 className="font-orbitron text-xl font-bold text-gray-800 mb-4">ТИПОГРАФИКА</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Заголовки - {brandData.font || 'Orbitron'}</p>
                        <h1 className="text-4xl font-bold" style={{fontFamily: brandData.font || 'Orbitron'}}>
                          {brandData.companyName}
                        </h1>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Основной текст - Inter</p>
                        <p className="text-lg font-inter">
                          Профессиональный подход к брендингу и качественный дизайн.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Примеры применения */}
                  <div className="mb-8">
                    <h3 className="font-orbitron text-xl font-bold text-gray-800 mb-4">ПРИМЕРЫ ПРИМЕНЕНИЯ</h3>
                    <div className="grid grid-cols-2 gap-6">
                      {/* Визитка */}
                      <div className="bg-gradient-to-br p-6 rounded-lg text-white shadow-lg" 
                           style={{background: `linear-gradient(135deg, ${generatedColors[0]}, ${generatedColors[1]})`}}>
                        <div className="flex items-center justify-between">
                          {logoUrl && <img src={logoUrl} alt="Logo" className="h-8 w-auto" />}
                          <div className="text-right">
                            <p className="font-bold">{brandData.companyName}</p>
                            <p className="text-sm opacity-80">Визитная карточка</p>
                          </div>
                        </div>
                      </div>

                      {/* Конверт */}
                      <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          {logoUrl && <img src={logoUrl} alt="Logo" className="h-6 w-auto" />}
                          <p className="text-sm text-gray-600">Фирменный бланк</p>
                        </div>
                        <div className="border-l-4 pl-4" style={{borderColor: generatedColors[0]}}>
                          <p className="font-bold text-gray-800">{brandData.companyName}</p>
                          <p className="text-sm text-gray-600">Корпоративная документация</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleDownload} className="w-full py-3 mt-8" 
                          style={{backgroundColor: generatedColors[0]}}>
                    <Icon name="Download" size={16} className="mr-2" />
                    Скачать полный брендбук PDF
                  </Button>
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Здесь появится предварительный просмотр вашего брендбука</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-orbitron font-bold mb-4">Возможности нейросети</h2>
          <p className="text-xl text-muted-foreground">Полный спектр инструментов для создания профессионального брендинга</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-colors">
            <CardContent className="p-6 text-center">
              <Icon name="Cpu" size={32} className="mx-auto mb-4 text-primary" />
              <h3 className="font-orbitron text-xl mb-2">ИИ-анализ</h3>
              <p className="text-muted-foreground">Нейросеть анализирует ваш логотип и создает гармоничную цветовую палитру</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-colors">
            <CardContent className="p-6 text-center">
              <Icon name="Layers" size={32} className="mx-auto mb-4 text-primary" />
              <h3 className="font-orbitron text-xl mb-2">Полный брендбук</h3>
              <p className="text-muted-foreground">Логобук, цветовая схема, типографика, макеты — всё в одном файле</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-colors">
            <CardContent className="p-6 text-center">
              <Icon name="Zap" size={32} className="mx-auto mb-4 text-primary" />
              <h3 className="font-orbitron text-xl mb-2">Мгновенный результат</h3>
              <p className="text-muted-foreground">От загрузки до готового брендбука — менее минуты работы</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-primary/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              © 2024 AI Brand Generator. Создано с помощью передовых нейросетевых технологий.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;