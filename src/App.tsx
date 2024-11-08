import React, { useState } from 'react';
import { Calculator, AlertTriangle, Baby, Activity, Clock, Stethoscope, Syringe, Pill } from 'lucide-react';
import { NumberSpinner } from './components/NumberSpinner';

interface FormData {
  gestationalWeeks: number;
  gestationalDays: number;
  uterineDynamics: string;
  priorPreterm: string;
  cervicalLength: number;
  membraneRupture: string;
  fetalNumber: string;
  cervicalSurgery: string;
}

interface RiskResults {
  oneWeek: number;
  twoWeeks: number;
  fourWeeks: number;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    gestationalWeeks: 23,
    gestationalDays: 0,
    uterineDynamics: 'no',
    priorPreterm: 'no',
    cervicalLength: 25,
    membraneRupture: 'no',
    fetalNumber: '1',
    cervicalSurgery: 'no'
  });

  const [results, setResults] = useState<RiskResults | null>(null);

  const handleNumberChange = (field: keyof FormData) => (value: number) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'gestationalWeeks' && value === 33) {
        return { ...newData, gestationalDays: Math.min(prev.gestationalDays, 6) };
      }
      return newData;
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateRisk = () => {
    const gestAge = formData.gestationalWeeks + formData.gestationalDays / 7;
    let riskFactor = 1;

    if (gestAge < 24) riskFactor *= 1.8;
    else if (gestAge < 28) riskFactor *= 1.5;
    else if (gestAge < 32) riskFactor *= 1.3;

    if (formData.cervicalLength < 15) riskFactor *= 2.5;
    else if (formData.cervicalLength < 20) riskFactor *= 2.0;
    else if (formData.cervicalLength < 25) riskFactor *= 1.5;

    if (formData.uterineDynamics === 'yes') riskFactor *= 1.5;
    if (formData.priorPreterm === 'yes') riskFactor *= 1.8;
    if (formData.membraneRupture === 'yes') riskFactor *= 2.0;
    if (formData.fetalNumber !== '1') riskFactor *= formData.fetalNumber === '2' ? 1.8 : 2.2;
    if (formData.cervicalSurgery === 'yes') riskFactor *= 1.4;

    const baseRisk = 0.015;
    const riskOneWeek = Math.min(baseRisk * riskFactor * 2.2, 1) * 100;
    const riskTwoWeeks = Math.min(baseRisk * riskFactor * 3.3, 1) * 100;
    const riskFourWeeks = Math.min(baseRisk * riskFactor * 4.4, 1) * 100;

    setResults({ oneWeek: riskOneWeek, twoWeeks: riskTwoWeeks, fourWeeks: riskFourWeeks });
  };

  const getRecommendations = (gestAge: number, hasUterineDynamics: boolean) => {
    const recommendations = [];
    
    if (gestAge < 24) {
      recommendations.push({
        icon: <Clock className="w-5 h-5 text-red-500" />,
        text: "Período crítico de viabilidad fetal. Evaluación individualizada urgente."
      });
    }
    
    if (gestAge < 34) {
      recommendations.push({
        icon: <Syringe className="w-5 h-5 text-red-500" />,
        text: "Considerar administración de corticosteroides para maduración pulmonar fetal."
      });
    }
    
    if (gestAge < 32) {
      recommendations.push({
        icon: <Stethoscope className="w-5 h-5 text-red-500" />,
        text: "Considerar sulfato de magnesio para neuroprotección fetal."
      });
    }

    if (hasUterineDynamics) {
      recommendations.push({
        icon: <Pill className="w-5 h-5 text-red-500" />,
        text: "Considerar tocólisis."
      });
    }

    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6">
            <div className="flex items-center justify-center space-x-3">
              <Calculator className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Calculadora de Riesgo de Parto Prematuro</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <NumberSpinner
                  label="Edad gestacional (semanas)"
                  name="gestationalWeeks"
                  value={formData.gestationalWeeks}
                  onChange={handleNumberChange('gestationalWeeks')}
                  min={23}
                  max={33}
                  helperText="Entre 23 y 33 semanas"
                />

                <NumberSpinner
                  label="Días adicionales"
                  name="gestationalDays"
                  value={formData.gestationalDays}
                  onChange={handleNumberChange('gestationalDays')}
                  min={0}
                  max={formData.gestationalWeeks === 33 ? 6 : 6}
                  helperText="Entre 0 y 6 días"
                />

                <NumberSpinner
                  label="Longitud cervical (mm)"
                  name="cervicalLength"
                  value={formData.cervicalLength}
                  onChange={handleNumberChange('cervicalLength')}
                  min={0}
                  max={50}
                />

                <label className="block">
                  <span className="text-gray-700">Número de fetos</span>
                  <select
                    name="fetalNumber"
                    value={formData.fetalNumber}
                    onChange={handleSelectChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-700">¿Dinámica uterina?</span>
                  <select
                    name="uterineDynamics"
                    value={formData.uterineDynamics}
                    onChange={handleSelectChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="no">No</option>
                    <option value="yes">Sí</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-gray-700">¿Antecedente de parto prematuro?</span>
                  <select
                    name="priorPreterm"
                    value={formData.priorPreterm}
                    onChange={handleSelectChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="no">No</option>
                    <option value="yes">Sí</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-gray-700">¿Rotura de membranas?</span>
                  <select
                    name="membraneRupture"
                    value={formData.membraneRupture}
                    onChange={handleSelectChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="no">No</option>
                    <option value="yes">Sí</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-gray-700">¿Cirugía cervical previa?</span>
                  <select
                    name="cervicalSurgery"
                    value={formData.cervicalSurgery}
                    onChange={handleSelectChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="no">No</option>
                    <option value="yes">Sí</option>
                  </select>
                </label>
              </div>
            </div>

            <button
              onClick={calculateRisk}
              className="mt-8 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              Calcular Riesgo
            </button>

            {results && (
              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                  <Activity className="w-6 h-6 mr-2" />
                  Resultados
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg shadow-sm ${results.oneWeek >= 5 ? 'bg-red-50' : 'bg-white'}`}>
                      <p className="text-sm text-gray-600">Riesgo a 1 semana</p>
                      <p className={`text-2xl font-bold ${results.oneWeek >= 5 ? 'text-red-600' : 'text-blue-600'}`}>
                        {results.oneWeek.toFixed(1)}%
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg shadow-sm ${results.twoWeeks >= 10 ? 'bg-red-50' : 'bg-white'}`}>
                      <p className="text-sm text-gray-600">Riesgo a 2 semanas</p>
                      <p className={`text-2xl font-bold ${results.twoWeeks >= 10 ? 'text-red-600' : 'text-blue-600'}`}>
                        {results.twoWeeks.toFixed(1)}%
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg shadow-sm ${results.fourWeeks >= 15 ? 'bg-red-50' : 'bg-white'}`}>
                      <p className="text-sm text-gray-600">Riesgo a 4 semanas</p>
                      <p className={`text-2xl font-bold ${results.fourWeeks >= 15 ? 'text-red-600' : 'text-blue-600'}`}>
                        {results.fourWeeks.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {(results.oneWeek >= 5 || results.twoWeeks >= 10) && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-red-900">¡Atención! Riesgo Elevado</h3>
                          <p className="text-red-700 mt-1">
                            Se requiere evaluación médica inmediata y seguimiento estrecho.
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mt-4">
                        {getRecommendations(formData.gestationalWeeks, formData.uterineDynamics === 'yes').map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            {rec.icon}
                            <p className="text-red-700">{rec.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.oneWeek < 5 && results.twoWeeks < 10 && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Baby className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-green-900">Riesgo Bajo</h3>
                          <p className="text-green-700 mt-1">
                            Continuar con el control prenatal habitual según protocolo.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-600">
          <p>Todos los derechos reservados a MiMaternoFetal.cl</p>
          <p className="text-sm mt-2">Esta herramienta es solo una guía. La decisión final debe ser tomada por un profesional de la salud.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;