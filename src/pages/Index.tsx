import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { jsPDF } from 'jspdf';

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [brandData, setBrandData] = useState({
    companyName: '',
    font: '',
    colors: '',
    comments: ''
  });

  const handleGenerate = async () => {
    if (!logoFile || !brandData.companyName) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Симуляция процесса генерации
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Настройка шрифтов и цветов
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(0, 212, 255); // Кибер-синий
    
    // Заголовок
    const title = `БРЕНДБУК: ${brandData.companyName.toUpperCase()}`;
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 30);
    
    // Линия под заголовком
    doc.setDrawColor(0, 212, 255);
    doc.setLineWidth(2);
    doc.line(20, 40, pageWidth - 20, 40);
    
    let yPosition = 60;
    
    // Основная информация
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(233, 69, 96); // Красный акцент
    doc.text("ОСНОВНАЯ ИНФОРМАЦИЯ", 20, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Название компании: ${brandData.companyName}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Шрифт: ${brandData.font || 'Не указан'}`, 25, yPosition);
    yPosition += 8;
    doc.text(`Цветовая палитра: ${brandData.colors || 'Не указана'}`, 25, yPosition);
    yPosition += 8;
    if (brandData.comments) {
      const splitComments = doc.splitTextToSize(`Комментарии: ${brandData.comments}`, pageWidth - 45);
      doc.text(splitComments, 25, yPosition);
      yPosition += splitComments.length * 6;
    }
    yPosition += 10;
    
    // Цветовая схема
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(233, 69, 96);
    doc.text("ЦВЕТОВАЯ СХЕМА", 20, yPosition);
    yPosition += 15;
    
    // Цветные блоки
    const colors = [
      { name: "Основной цвет", hex: "#00D4FF", rgb: [0, 212, 255] },
      { name: "Акцент", hex: "#E94560", rgb: [233, 69, 96] },
      { name: "Темный", hex: "#1A1A2E", rgb: [26, 26, 46] },
      { name: "Глубокий", hex: "#16213E", rgb: [22, 33, 62] }
    ];
    
    colors.forEach((color, index) => {
      const xPos = 25 + (index % 2) * 90;
      const yPos = yPosition + Math.floor(index / 2) * 25;
      
      // Цветной квадрат
      doc.setFillColor(color.rgb[0], color.rgb[1], color.rgb[2]);
      doc.rect(xPos, yPos, 15, 15, 'F');
      
      // Название и HEX
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(color.name, xPos + 20, yPos + 8);
      doc.text(color.hex, xPos + 20, yPos + 14);
    });
    yPosition += 60;
    
    // Типографика
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(233, 69, 96);
    doc.text("ТИПОГРАФИКА", 20, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Заголовки: Orbitron (футуристичный)", 25, yPosition);
    yPosition += 8;
    doc.text("Основной текст: Inter (читаемый)", 25, yPosition);
    yPosition += 8;
    doc.text("Размеры: H1 (48px), H2 (32px), H3 (24px), Body (16px)", 25, yPosition);
    yPosition += 20;
    
    // Логотип
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(233, 69, 96);
    doc.text("ЛОГОТИП", 20, yPosition);
    yPosition += 15;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Загруженный файл: ${logoFile?.name || 'Не загружен'}`, 25, yPosition);
    yPosition += 8;
    doc.text("Рекомендуемые размеры: 200x200px (минимум)", 25, yPosition);
    yPosition += 8;
    doc.text("Форматы: PNG, SVG для веб, EPS для печати", 25, yPosition);
    yPosition += 20;
    
    // Применение
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(233, 69, 96);
    doc.text("ПРИМЕНЕНИЕ", 20, yPosition);
    yPosition += 15;
    
    const applications = [
      "• Визитные карточки",
      "• Фирменные бланки", 
      "• Веб-сайт",
      "• Социальные сети",
      "• Рекламные материалы"
    ];
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    applications.forEach(app => {
      doc.text(app, 25, yPosition);
      yPosition += 8;
    });
    
    // Footer
    yPosition = doc.internal.pageSize.height - 30;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Сгенерировано: ${new Date().toLocaleDateString('ru-RU')}`, 20, yPosition);
    doc.text("AI Brand Generator", pageWidth - 60, yPosition);
    
    // Скачивание
    const filename = `brandbook-${brandData.companyName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    doc.save(filename);
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
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6">
                    <h3 className="font-orbitron text-xl mb-4">Брендбук готов!</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-primary/20 rounded p-3 text-center">
                        <Icon name="Palette" size={24} className="mx-auto mb-2" />
                        <p className="text-sm">Цветовая схема</p>
                      </div>
                      <div className="bg-accent/20 rounded p-3 text-center">
                        <Icon name="Type" size={24} className="mx-auto mb-2" />
                        <p className="text-sm">Типографика</p>
                      </div>
                      <div className="bg-primary/20 rounded p-3 text-center">
                        <Icon name="Layout" size={24} className="mx-auto mb-2" />
                        <p className="text-sm">Макеты</p>
                      </div>
                      <div className="bg-accent/20 rounded p-3 text-center">
                        <Icon name="FileText" size={24} className="mx-auto mb-2" />
                        <p className="text-sm">Гайдлайны</p>
                      </div>
                    </div>
                    <Button onClick={handleDownload} className="w-full mt-6">
                      <Icon name="Download" size={16} className="mr-2" />
                      Скачать брендбук
                    </Button>
                  </div>
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