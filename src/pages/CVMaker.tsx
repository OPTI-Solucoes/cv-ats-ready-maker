import { useState } from 'react';
import { CVForm } from '@/components/CVForm';
import { CVPreview } from '@/components/CVPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CVData } from '@/types/cv';
import { Download, FileText, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CVMaker = () => {
  const { toast } = useToast();
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: []
  });
  const [activeView, setActiveView] = useState<'form' | 'preview'>('form');

  const handlePrint = () => {
    // Verificar se dados essenciais estão preenchidos
    if (!cvData.personalInfo.fullName || !cvData.personalInfo.email || !cvData.summary) {
      toast({
        title: "Dados incompletos",
        description: "Preencha pelo menos nome, email e resumo profissional antes de gerar o CV.",
        variant: "destructive"
      });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const cvContent = document.getElementById('cv-content');
    if (!cvContent) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>CV - ${cvData.personalInfo.fullName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { font-size: 28px; margin-bottom: 10px; text-align: center; }
            h2 { font-size: 18px; margin: 20px 0 10px 0; text-transform: uppercase; font-weight: bold; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
            h3 { font-size: 16px; margin: 10px 0 5px 0; font-weight: 600; }
            p { margin: 5px 0; }
            ul { margin: 10px 0; padding-left: 20px; }
            li { margin: 5px 0; }
            .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
            .contact-info { display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-top: 10px; font-size: 14px; }
            .section { margin-bottom: 25px; }
            .experience-item, .education-item { margin-bottom: 20px; padding-left: 15px; border-left: 2px solid #e5e7eb; }
            .date { font-size: 14px; color: #666; }
            .skills { line-height: 1.8; }
            @media print {
              body { font-size: 12px; }
              .container { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${cvContent.innerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();

    toast({
      title: "CV pronto para impressão",
      description: "Seu currículo foi aberto em uma nova janela para download/impressão."
    });
  };

  const isDataValid = () => {
    return cvData.personalInfo.fullName && 
           cvData.personalInfo.email && 
           cvData.summary;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Gerador de CV Compatível com ATS
          </h1>
          <p className="text-lg text-muted-foreground">
            Crie um currículo profissional otimizado para sistemas de triagem automática
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <Button
              variant={activeView === 'form' ? 'default' : 'ghost'}
              onClick={() => setActiveView('form')}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Button>
            <Button
              variant={activeView === 'preview' ? 'default' : 'ghost'}
              onClick={() => setActiveView('preview')}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Visualizar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className={`${activeView === 'preview' ? 'hidden xl:block' : ''}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Informações do Currículo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CVForm onDataChange={setCvData} />
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className={`${activeView === 'form' ? 'hidden xl:block' : ''}`}>
            <div className="sticky top-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Pré-visualização</h2>
                <Button 
                  onClick={handlePrint}
                  disabled={!isDataValid()}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Baixar/Imprimir
                </Button>
              </div>
              
              <CVPreview data={cvData} />
              
              {!isDataValid() && (
                <Card className="mt-4 border-amber-200 bg-amber-50">
                  <CardContent className="pt-4">
                    <p className="text-sm text-amber-700">
                      <strong>Dica:</strong> Preencha pelo menos nome, email e resumo profissional 
                      para gerar seu CV.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Dicas para um CV compatível com ATS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">✅ Faça:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Use palavras-chave relevantes da vaga</li>
                  <li>• Mantenha formatação simples e limpa</li>
                  <li>• Use verbos de ação para descrever experiências</li>
                  <li>• Inclua números e resultados concretos</li>
                  <li>• Salve em formato PDF padrão</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">❌ Evite:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Imagens, gráficos ou elementos visuais complexos</li>
                  <li>• Fontes decorativas ou muito estilizadas</li>
                  <li>• Caixas de texto ou elementos sobrepostos</li>
                  <li>• Abreviações sem explicação</li>
                  <li>• Informações pessoais desnecessárias</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CVMaker;