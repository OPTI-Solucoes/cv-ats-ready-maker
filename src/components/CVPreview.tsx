import { CVData } from '@/types/cv';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface CVPreviewProps {
  data: CVData;
}

export const CVPreview = ({ data }: CVPreviewProps) => {
  console.log(data);
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthNames = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };


  return (
    <Card className="w-full max-w-4xl mx-auto">
      <div className="p-8 bg-white" id="cv-content">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-cv-border">
          <h1 className="text-3xl font-bold text-cv-section mb-2">
            {data.personalInfo.fullName || 'Seu Nome'}
          </h1>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-cv-text">
            {data.personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.linkedIn && (
              <div className="flex items-center gap-1">
                <Linkedin className="w-4 h-4" />
                <span>{data.personalInfo.linkedIn}</span>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{data.personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-cv-section mb-3 uppercase tracking-wide">
              Resumo Profissional
            </h2>
            <p className="text-cv-text leading-relaxed">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-cv-section mb-4 uppercase tracking-wide">
              Experiência Profissional
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-cv-border pl-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-cv-section">{exp.jobTitle}</h3>
                      <p className="text-cv-text font-medium">{exp.company}</p>
                      {exp.location && (
                        <p className="text-sm text-cv-text">{exp.location}</p>
                      )}
                    </div>
                    <div className="text-sm text-cv-text md:text-right">
                      <p>
                        {formatDate(exp.startDate)} - {exp.current ? 'Presente' : formatDate(exp.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 text-cv-text">
                    {exp.challenge && (
                      <div>
                        <h4 className="font-semibold text-cv-section text-sm mb-1">Desafio:</h4>
                        <p className="leading-relaxed">{exp.challenge}</p>
                      </div>
                    )}
                    
                    {exp.responsibilities.filter(resp => resp.trim()).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-cv-section text-sm mb-1">Responsabilidades:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {exp.responsibilities.filter(resp => resp.trim()).map((resp, index) => (
                            <li key={index} className="leading-relaxed">
                              {resp.startsWith('•') ? resp.substring(1).trim() : resp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {exp.achievements.filter(achievement => achievement.trim()).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-cv-section text-sm mb-1">Conquistas:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {exp.achievements.filter(achievement => achievement.trim()).map((achievement, index) => (
                            <li key={index} className="leading-relaxed">
                              {achievement.startsWith('•') ? achievement.substring(1).trim() : achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
              
                    {exp.technologies.split(',').filter(tech => tech.trim()).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-cv-section text-sm mb-1">Tecnologias:</h4>
                        <p className="leading-relaxed">
                          {exp.technologies.split(',').filter(tech => tech.trim()).map(tech => 
                            tech.startsWith('•') ? tech.substring(1).trim() : tech
                          ).join(' • ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-cv-section mb-4 uppercase tracking-wide">
              Educação
            </h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-cv-border pl-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h3 className="font-semibold text-cv-section">{edu.degree}</h3>
                      <p className="text-cv-text font-medium">{edu.institution}</p>
                      {edu.location && (
                        <p className="text-sm text-cv-text">{edu.location}</p>
                      )}
                      {edu.gpa && (
                        <p className="text-sm text-cv-text">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <div className="text-sm text-cv-text md:text-right">
                      <p>{formatDate(edu.graduationDate)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {(data.skills.technical || data.skills.soft || data.skills.language) && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-cv-section mb-4 uppercase tracking-wide">
              Habilidades
            </h2>
            <div className="space-y-3">
              {data.skills.technical && (
                <div>
                  <h3 className="font-semibold text-cv-section mb-2">Técnicas</h3>
                  <p className="text-cv-text">
                    {data.skills.technical.split(',').map(skill => skill.trim()).join(' • ')}
                  </p>
                </div>
              )}
              {data.skills.soft && (
                <div>
                  <h3 className="font-semibold text-cv-section mb-2">Comportamentais</h3>
                  <p className="text-cv-text">
                    {data.skills.soft.split(',').map(skill => skill.trim()).join(' • ')}
                  </p>
                </div>
              )}
              {data.skills.language && (
                <div>
                  <h3 className="font-semibold text-cv-section mb-2">Idiomas</h3>
                  <p className="text-cv-text">
                    {data.skills.language.split(',').map(skill => skill.trim()).join(' • ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};