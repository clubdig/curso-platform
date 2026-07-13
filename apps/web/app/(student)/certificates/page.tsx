'use client';

import { useEffect, useState } from 'react';
import { Award, Download, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface Certificate {
  id: string;
  certificateNumber: string;
  issuedAt: string;
  pdfUrl: string;
  course: {
    id: string;
    title: string;
    slug: string;
  };
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates')
      .then((res) => setCertificates(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Meus Certificados</h1>

      {certificates.length === 0 ? (
        <div className="text-center py-16">
          <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum certificado ainda
          </h2>
          <p className="text-gray-600">
            Complete seus cursos para receber certificados de conclusão.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                {cert.pdfUrl && (
                  <a
                    href={cert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{cert.course.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                Número: {cert.certificateNumber}
              </p>
              <p className="text-sm text-gray-500">
                Emitido em: {formatDate(cert.issuedAt)}
              </p>

              <div className="mt-4 pt-4 border-t">
                <a
                  href={`/certificates/verify/${cert.certificateNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Verificar autenticidade
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
