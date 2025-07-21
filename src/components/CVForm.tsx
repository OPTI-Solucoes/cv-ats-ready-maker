import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { CVData, Experience, Education, Skill } from '@/types/cv';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CVFormProps {
  onDataChange: (data: CVData) => void;
}

export const CVForm = ({ onDataChange }: CVFormProps) => {
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

  const updateData = (newData: Partial<CVData>) => {
    const updatedData = { ...cvData, ...newData };
    setCvData(updatedData);
    onDataChange(updatedData);
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['']
    };
    updateData({ experience: [...cvData.experience, newExperience] });
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    const updatedExperience = cvData.experience.map(exp =>
      exp.id === id ? { ...exp, ...updates } : exp
    );
    updateData({ experience: updatedExperience });
  };

  const removeExperience = (id: string) => {
    updateData({ experience: cvData.experience.filter(exp => exp.id !== id) });
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      gpa: ''
    };
    updateData({ education: [...cvData.education, newEducation] });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    const updatedEducation = cvData.education.map(edu =>
      edu.id === id ? { ...edu, ...updates } : edu
    );
    updateData({ education: updatedEducation });
  };

  const removeEducation = (id: string) => {
    updateData({ education: cvData.education.filter(edu => edu.id !== id) });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      category: 'technical'
    };
    updateData({ skills: [...cvData.skills, newSkill] });
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    const updatedSkills = cvData.skills.map(skill =>
      skill.id === id ? { ...skill, ...updates } : skill
    );
    updateData({ skills: updatedSkills });
  };

  const removeSkill = (id: string) => {
    updateData({ skills: cvData.skills.filter(skill => skill.id !== id) });
  };

  const addDescriptionPoint = (experienceId: string) => {
    const experience = cvData.experience.find(exp => exp.id === experienceId);
    if (experience) {
      updateExperience(experienceId, {
        description: [...experience.description, '']
      });
    }
  };

  const updateDescriptionPoint = (experienceId: string, index: number, value: string) => {
    const experience = cvData.experience.find(exp => exp.id === experienceId);
    if (experience) {
      const newDescription = [...experience.description];
      newDescription[index] = value;
      updateExperience(experienceId, { description: newDescription });
    }
  };

  const removeDescriptionPoint = (experienceId: string, index: number) => {
    const experience = cvData.experience.find(exp => exp.id === experienceId);
    if (experience && experience.description.length > 1) {
      const newDescription = experience.description.filter((_, i) => i !== index);
      updateExperience(experienceId, { description: newDescription });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Pessoal</TabsTrigger>
          <TabsTrigger value="experience">Experiência</TabsTrigger>
          <TabsTrigger value="education">Educação</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Nome Completo *</Label>
                  <Input
                    id="fullName"
                    value={cvData.personalInfo.fullName}
                    onChange={(e) => updateData({
                      personalInfo: { ...cvData.personalInfo, fullName: e.target.value }
                    })}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={cvData.personalInfo.email}
                    onChange={(e) => updateData({
                      personalInfo: { ...cvData.personalInfo, email: e.target.value }
                    })}
                    placeholder="seu.email@exemplo.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={cvData.personalInfo.phone}
                    onChange={(e) => updateData({
                      personalInfo: { ...cvData.personalInfo, phone: e.target.value }
                    })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Localização *</Label>
                  <Input
                    id="location"
                    value={cvData.personalInfo.location}
                    onChange={(e) => updateData({
                      personalInfo: { ...cvData.personalInfo, location: e.target.value }
                    })}
                    placeholder="Cidade, Estado"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedIn">LinkedIn</Label>
                  <Input
                    id="linkedIn"
                    value={cvData.personalInfo.linkedIn}
                    onChange={(e) => updateData({
                      personalInfo: { ...cvData.personalInfo, linkedIn: e.target.value }
                    })}
                    placeholder="linkedin.com/in/seuperfil"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={cvData.personalInfo.website}
                    onChange={(e) => updateData({
                      personalInfo: { ...cvData.personalInfo, website: e.target.value }
                    })}
                    placeholder="www.seusite.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="summary">Resumo Profissional *</Label>
                <Textarea
                  id="summary"
                  value={cvData.summary}
                  onChange={(e) => updateData({ summary: e.target.value })}
                  placeholder="Descreva brevemente sua experiência e objetivos profissionais..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Experiência Profissional</h3>
            <Button onClick={addExperience} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
          
          {cvData.experience.map((exp) => (
            <Card key={exp.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div>
                      <Label>Cargo *</Label>
                      <Input
                        value={exp.jobTitle}
                        onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
                        placeholder="Desenvolvedor Frontend"
                      />
                    </div>
                    <div>
                      <Label>Empresa *</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        placeholder="Nome da Empresa"
                      />
                    </div>
                    <div>
                      <Label>Localização</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                        placeholder="Cidade, Estado"
                      />
                    </div>
                    <div>
                      <Label>Data de Início *</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      />
                    </div>
                    {!exp.current && (
                      <div>
                        <Label>Data de Término</Label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onCheckedChange={(checked) => 
                          updateExperience(exp.id, { 
                            current: !!checked,
                            endDate: checked ? '' : exp.endDate
                          })
                        }
                      />
                      <Label htmlFor={`current-${exp.id}`}>Trabalho atual</Label>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeExperience(exp.id)}
                    className="ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div>
                  <Label>Descrição das responsabilidades *</Label>
                  {exp.description.map((desc, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={desc}
                        onChange={(e) => updateDescriptionPoint(exp.id, index, e.target.value)}
                        placeholder="• Responsabilidade ou conquista..."
                        className="flex-1"
                      />
                      {exp.description.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeDescriptionPoint(exp.id, index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addDescriptionPoint(exp.id)}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar ponto
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Educação</h3>
            <Button onClick={addEducation} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
          
          {cvData.education.map((edu) => (
            <Card key={edu.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div>
                      <Label>Curso/Grau *</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        placeholder="Bacharelado em Ciência da Computação"
                      />
                    </div>
                    <div>
                      <Label>Instituição *</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                        placeholder="Universidade Federal"
                      />
                    </div>
                    <div>
                      <Label>Localização</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                        placeholder="Cidade, Estado"
                      />
                    </div>
                    <div>
                      <Label>Data de Formatura *</Label>
                      <Input
                        type="month"
                        value={edu.graduationDate}
                        onChange={(e) => updateEducation(edu.id, { graduationDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>GPA/Nota (opcional)</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                        placeholder="3.8/4.0 ou 8.5/10"
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEducation(edu.id)}
                    className="ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Habilidades</h3>
            <Button onClick={addSkill} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cvData.skills.map((skill) => (
              <Card key={skill.id}>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Habilidade</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSkill(skill.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                      placeholder="React, JavaScript, etc."
                    />
                    <Label>Categoria</Label>
                    <select
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, { category: e.target.value as 'technical' | 'soft' | 'language' })}
                      className="w-full p-2 border border-input rounded-md"
                    >
                      <option value="technical">Técnica</option>
                      <option value="soft">Comportamental</option>
                      <option value="language">Idioma</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};