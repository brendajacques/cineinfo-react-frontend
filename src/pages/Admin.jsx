import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { Shield, Users, FileText, Settings, ArrowLeft, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Layout>
      <div className="space-y-8 animate-fadeIn">
        {/* Header da Página */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-cinema-charcoal pb-6">
          <div>
            <div className="flex items-center gap-2 text-cinema-red mb-1">
              <Shield className="h-5 w-5 fill-cinema-red/10" />
              <span className="text-xs font-bold uppercase tracking-widest text-cinema-red">Área Restrita</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-cinema-popcorn sm:text-4xl">
              Painel do <span className="text-cinema-red">Administrador</span>
            </h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 self-start rounded-full bg-cinema-charcoal/40 hover:bg-cinema-charcoal/80 px-5 py-2 text-sm font-bold text-cinema-popcorn border border-cinema-charcoal hover:border-cinema-gray/60 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Home</span>
          </button>
        </div>

        {/* Informações do Admin */}
        <div className="bg-cinema-charcoal/20 border border-cinema-charcoal/80 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
          <img 
            src={user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=admin"} 
            alt={user?.name || "Admin"} 
            className="w-20 h-20 rounded-full border-2 border-cinema-red bg-cinema-black/45 p-1"
          />
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-xl font-bold text-white">{user?.name || 'Administrador'}</h2>
            <p className="text-sm text-cinema-popcorn/60">{user?.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cinema-red/15 text-cinema-red border border-cinema-red/35">
              Nível: {user?.perfil}
            </span>
          </div>
        </div>

        {/* Dashboard Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-cinema-charcoal/20 border border-cinema-charcoal/50 rounded-xl p-6 space-y-4 hover:border-cinema-red/30 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-cinema-red/10 border border-cinema-red/25 rounded-lg text-cinema-red">
                <Users className="h-6 w-6" />
              </div>
              <span className="text-xs text-cinema-neon bg-cinema-neon/10 px-2 py-0.5 rounded font-bold">Ativos</span>
            </div>
            <div>
              <p className="text-2xl font-black text-white">1.254</p>
              <p className="text-xs text-cinema-popcorn/60 font-medium">Usuários Cadastrados</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-cinema-charcoal/20 border border-cinema-charcoal/50 rounded-xl p-6 space-y-4 hover:border-cinema-red/30 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-cinema-gold/10 border border-cinema-gold/25 rounded-lg text-cinema-gold">
                <FileText className="h-6 w-6" />
              </div>
              <span className="text-xs text-cinema-gold bg-cinema-gold/10 px-2 py-0.5 rounded font-bold">+12 hoje</span>
            </div>
            <div>
              <p className="text-2xl font-black text-white">482</p>
              <p className="text-xs text-cinema-popcorn/60 font-medium">Críticas e Avaliações</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-cinema-charcoal/20 border border-cinema-charcoal/50 rounded-xl p-6 space-y-4 hover:border-cinema-red/30 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-cinema-neon/10 border border-cinema-neon/25 rounded-lg text-cinema-neon">
                <Activity className="h-6 w-6" />
              </div>
              <span className="text-xs text-cinema-neon bg-cinema-neon/10 px-2 py-0.5 rounded font-bold">99.9%</span>
            </div>
            <div>
              <p className="text-2xl font-black text-white">Saudável</p>
              <p className="text-xs text-cinema-popcorn/60 font-medium">Status do Sistema (API TMDB)</p>
            </div>
          </div>
        </div>

        {/* Gerenciamento do Painel */}
        <div className="border border-cinema-charcoal/80 rounded-xl overflow-hidden bg-cinema-charcoal/10">
          <div className="bg-cinema-charcoal/40 px-6 py-4 border-b border-cinema-charcoal flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Settings className="h-4 w-4 text-cinema-red" />
              Painel de Controle do Sistema
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-cinema-popcorn/80">
              Bem-vindo à área administrativa do CineInfo. Aqui você poderá gerenciar filmes, moderar os comentários dos usuários e ajustar as configurações da API do TMDB em atualizações futuras.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button className="px-4 py-2 bg-cinema-red hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors">
                Gerenciar Usuários
              </button>
              <button className="px-4 py-2 bg-cinema-charcoal/60 border border-cinema-charcoal text-cinema-popcorn text-xs font-bold rounded-lg hover:bg-cinema-charcoal transition-colors">
                Moderar Comentários
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
