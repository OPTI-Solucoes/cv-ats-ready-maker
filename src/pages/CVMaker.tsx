import { useState, useRef } from 'react';
import { CVForm } from '@/components/CVForm';
import { CVPreview } from '@/components/CVPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CVData } from '@/types/cv';
import { Download, FileText, Eye, Edit, MoreVertical, Upload, Save, AlertTriangle } from 'lucide-react';
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
    skills: {
      technical: '',
      soft: '',
      language: ''
    }
  });
  const [activeView, setActiveView] = useState<'form' | 'preview'>('form');
  const [pendingImportData, setPendingImportData] = useState<CVData | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    window.print();
  };

  const isDataValid = () => {
    return cvData.personalInfo.fullName && 
           cvData.personalInfo.email && 
           cvData.summary;
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(cvData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `cv-${cvData.personalInfo.fullName || 'dados'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Dados exportados",
      description: "Os dados do CV foram exportados em formato JSON."
    });
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const hasExistingData = () => {
    return cvData.personalInfo.fullName || 
           cvData.personalInfo.email || 
           cvData.summary || 
           cvData.experience.length > 0 || 
           cvData.education.length > 0 ||
           cvData.skills.technical ||
           cvData.skills.soft ||
           cvData.skills.language;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        if (hasExistingData()) {
          setPendingImportData(importedData);
          setShowImportDialog(true);
        } else {
          setCvData(importedData);
          toast({
            title: "Dados importados",
            description: "Os dados do CV foram importados com sucesso."
          });
        }
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "Arquivo JSON inválido ou corrompido.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleOverwriteImport = () => {
    if (pendingImportData) {
      setCvData(pendingImportData);
      toast({
        title: "Dados sobrescritos",
        description: "Todos os dados anteriores foram substituídos pelos dados importados."
      });
    }
    setShowImportDialog(false);
    setPendingImportData(null);
  };

  const handleMergeImport = () => {
    if (pendingImportData) {
      const mergedData: CVData = {
        personalInfo: {
          fullName: pendingImportData.personalInfo.fullName || cvData.personalInfo.fullName,
          email: pendingImportData.personalInfo.email || cvData.personalInfo.email,
          phone: pendingImportData.personalInfo.phone || cvData.personalInfo.phone,
          location: pendingImportData.personalInfo.location || cvData.personalInfo.location,
          linkedIn: pendingImportData.personalInfo.linkedIn || cvData.personalInfo.linkedIn,
          website: pendingImportData.personalInfo.website || cvData.personalInfo.website,
        },
        summary: pendingImportData.summary || cvData.summary,
        experience: [...cvData.experience, ...pendingImportData.experience],
        education: [...cvData.education, ...pendingImportData.education],
        skills: {
          technical: [cvData.skills.technical, pendingImportData.skills.technical].filter(Boolean).join(', '),
          soft: [cvData.skills.soft, pendingImportData.skills.soft].filter(Boolean).join(', '),
          language: [cvData.skills.language, pendingImportData.skills.language].filter(Boolean).join(', '),
        }
      };
      setCvData(mergedData);
      toast({
        title: "Dados mesclados",
        description: "Os dados foram combinados mantendo as informações existentes."
      });
    }
    setShowImportDialog(false);
    setPendingImportData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 print:pt-0 print:px-0">
        {/* Header */}
        <div className="relative text-center mb-8 print:hidden print:scale-0">
          {/* Dropdown Menu - Positioned in top right */}
          <div className="absolute top-0 right-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleExportJSON}>
                  <Save className="mr-2 h-4 w-4" />
                  Exportar dados JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImportJSON}>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar dados JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Gerador de CV Compatível com ATS
          </h1>
          <p className="text-lg text-muted-foreground">
            Crie um currículo profissional otimizado para sistemas de triagem automática
          </p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Navigation */}
        <div className="flex justify-center mb-6 print:hidden print:scale-0">
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
          <div className={`${activeView === 'preview' ? 'hidden xl:block' : ''} print:hidden print:scale-0`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Informações do Currículo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CVForm onDataChange={setCvData} initialData={cvData} />
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className={`${activeView === 'form' ? 'hidden xl:block' : ''} print:block`}>
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

        {/* Import Confirmation Dialog */}
        <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Dados existentes detectados
              </AlertDialogTitle>
              <AlertDialogDescription>
                Você já possui informações preenchidas no formulário. Como deseja proceder com a importação?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel onClick={() => setShowImportDialog(false)}>
                Cancelar
              </AlertDialogCancel>
              <Button variant="outline" onClick={handleMergeImport}>
                Mesclar dados
              </Button>
              <AlertDialogAction onClick={handleOverwriteImport}>
                Sobrescrever tudo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CVMaker;