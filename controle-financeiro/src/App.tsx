import React, { useState, useEffect } from 'react';
import { Mic, ArrowUpRight, ArrowDownRight, ShoppingCart, Briefcase, Zap, CreditCard, LayoutDashboard, ChevronLeft, Wallet, Home, AlertCircle } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

// --- CONFIGURAÇÃO DE CATEGORIAS ---
const categoriasConfig = {
  todas: { nome: 'Visão Geral', icon: LayoutDashboard, color: 'text-cyan-400', hex: '#22d3ee' },
  entradas: { nome: 'Entradas', icon: Briefcase, color: 'text-emerald-400', hex: '#34d399' },
  aluguel: { nome: 'Aluguel', icon: Home, color: 'text-emerald-500', hex: '#10b981' },
  mercado: { nome: 'Mercado', icon: ShoppingCart, color: 'text-amber-400', hex: '#fbbf24' },
  creditos: { nome: 'Créditos', icon: CreditCard, color: 'text-purple-400', hex: '#c084fc' },
  servicos: { nome: 'Serviços', icon: Zap, color: 'text-blue-400', hex: '#60a5fa' },
  outros: { nome: 'Outros', icon: Wallet, color: 'text-pink-400', hex: '#f472b6' },
};

const comparativoMensalData = [
  { categoria: 'Aluguel', marco: 1200, abril: 1200 },
  { categoria: 'Mercado', marco: 680, abril: 850 },
  { categoria: 'Serviços', marco: 430, abril: 450 },
  { categoria: 'Créditos', marco: 550, abril: 300 },
  { categoria: 'Outros', marco: 290, abril: 344 },
];

// --- COMPONENTE: TELA DE DETALHES ---
const CategoryDetail = ({ catId, onBack, transacoes }: any) => {
  const config = categoriasConfig[catId as keyof typeof categoriasConfig] || categoriasConfig.todas;
  const Icone = config.icon;
  const transacoesFiltradas = (transacoes || []).filter((t: any) => t?.categoria === catId);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit p-2 rounded-lg hover:bg-white/5">
        <ChevronLeft className="w-5 h-5" /> Voltar ao Início
      </button>

      <div className="glass-card p-6 border-b-2 border-cyan-500/30">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-3xl bg-gray-900 border border-white/5 ${config.color}`}><Icone className="w-10 h-10" /></div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{config.nome}</h2>
            <p className="text-gray-400">Detalhamento de movimentações</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 min-h-[500px]">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Histórico Recente</h3>
        <div className="flex flex-col gap-4">
          {transacoesFiltradas.length > 0 ? transacoesFiltradas.map((t: any, idx: number) => (
            <div key={t.id || idx} className="flex justify-between items-center p-4 rounded-xl bg-gray-900/50 border border-white/5">
              <div>
                <span className="text-white font-medium block">{t.descricao || 'Sem descrição'}</span>
                <span className="text-xs text-gray-500 block">{t.data ? new Date(t.data).toLocaleDateString('pt-BR') : 'Data desconhecida'}</span>
              </div>
              <span className={`font-bold ${Number(t.valor) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                R$ {Math.abs(Number(t.valor) || 0).toFixed(2)}
              </span>
            </div>
          )) : <p className="text-center py-10 text-gray-600">Nenhum registro encontrado.</p>}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE: DASHBOARD PRINCIPAL ---
const HomeDashboard = ({ onNavigate, transacoes, stats, graficos, apiError }: any) => {
  const saldo = stats?.saldo || 0;
  const entradas = stats?.entradas || 0;
  const gastos = stats?.gastos || 0;
  
  // Impede que o gráfico do Recharts quebre se a lista estiver vazia
  const gastosData = graficos?.gastosPorCategoria?.length > 0 
    ? graficos.gastosPorCategoria 
    : [{ name: 'Sem dados', valor: 0, color: '#4b5563' }];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      
      {/* ALERTA DE ERRO DE API */}
      {apiError && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl flex items-center gap-4 text-rose-400">
          <AlertCircle className="w-6 h-6" />
          <div>
            <span className="block font-bold">Aviso: API Desconectada</span>
            <span className="text-sm text-rose-300">Não conseguimos puxar os dados do banco. Exibindo modo offline.</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center">
        <div className="glass-card flex items-center justify-between p-4 border-cyan-500/30">
          <input type="text" placeholder="Comando n8n (ex: Mercado 28)" className="bg-transparent border-none outline-none text-base w-full text-white placeholder-gray-400"/>
          <Mic className="text-cyan-400 w-6 h-6 cursor-pointer"/>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {Object.entries(categoriasConfig).map(([id, config]) => {
            const Icone = config.icon;
            return (
              <button key={id} onClick={() => onNavigate(id)} className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium glass-card text-gray-400 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap">
                <Icone className="w-4 h-4" /> {config.nome}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div className="glass-card p-8 flex flex-col justify-center gap-2 border-l-4 border-cyan-500">
          <span className="text-base font-medium text-gray-400">Saldo Total</span>
          <span className={`text-5xl font-extrabold tracking-tight ${saldo >= 0 ? 'text-white' : 'text-rose-400'}`}>
            R$ {saldo.toFixed(2)}
          </span>
        </div>
        <div className="glass-card p-8 flex flex-col justify-center gap-5">
          <div className="flex justify-between items-center text-emerald-400">
            <span className="text-base flex items-center gap-2 font-medium"><ArrowUpRight className="w-5 h-5" /> Entradas</span>
            <span className="font-bold text-2xl">R$ {entradas.toFixed(2)}</span>
          </div>
          <div className="w-full h-px bg-white/5"></div>
          <div className="flex justify-between items-center text-rose-400">
            <span className="text-base flex items-center gap-2 font-medium"><ArrowDownRight className="w-5 h-5" /> Gastos</span>
            <span className="font-bold text-2xl">R$ {gastos.toFixed(2)}</span>
          </div>
        </div>
        <div className="glass-card p-8 flex flex-col justify-center gap-3 relative overflow-hidden border-rose-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300 uppercase font-bold tracking-wider">Alerta Mercado</span>
            <span className="text-rose-400 font-medium text-lg animate-pulse">85%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-4 border border-white/5 shadow-inner">
            <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-4 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mb-8">
        <div className="xl:col-span-2 flex flex-col gap-6 lg:gap-8">
          
          <div className="glass-card p-8 flex flex-col h-[450px]">
             <span className="text-sm font-bold text-gray-400 mb-4 block uppercase tracking-widest border-b border-white/5 pb-3">Onde gastei este mês?</span>
             <div className="flex-1 w-full min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gastosData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={14} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#6b7280" fontSize={13} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val}`} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                      contentStyle={{backgroundColor: '#1e2030', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#ffffff', fontSize: '16px', fontWeight: 'bold'}}
                      itemStyle={{ color: '#ffffff' }}
                      formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`}
                    />
                    <Bar dataKey="valor" radius={[6, 6, 0, 0]} barSize={50}>
                      {gastosData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="glass-card p-8 flex flex-col h-[450px]">
            <span className="text-sm font-bold text-gray-400 mb-4 block uppercase tracking-widest border-b border-white/5 pb-3">Tendência: Março vs Abril</span>
            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparativoMensalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                  <XAxis dataKey="categoria" stroke="#9ca3af" fontSize={14} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#6b7280" fontSize={13} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val}`} />
                  <Tooltip
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{backgroundColor: '#1e2030', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#ffffff', fontSize: '16px'}}
                    itemStyle={{ color: '#ffffff' }}
                    formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`}
                  />
                  <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
                  <Bar dataKey="marco" name="Março" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={35} />
                  <Bar dataKey="abril" name="Abril" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
        
        <div className="glass-card p-8 h-fit">
          <span className="text-sm font-bold text-gray-400 mb-8 block uppercase tracking-widest border-b border-white/5 pb-3">Últimas Movimentações (API)</span>
          <div className="flex flex-col gap-5">
             {(transacoes || []).slice(0, 8).map((t: any, idx: number) => (
               <div key={t.id || idx} className="flex justify-between items-center bg-gray-900/40 p-5 rounded-xl border border-white/5 text-base hover:border-cyan-500/30 transition-colors cursor-default">
                 <div>
                   <span className="text-gray-100 font-medium block">{t.descricao || 'Desconhecido'}</span>
                   <span className="text-xs text-gray-500">{t.data ? new Date(t.data).toLocaleDateString('pt-BR') : ''} • {t.categoria || ''}</span>
                 </div>
                 <span className={`font-bold ${Number(t.valor) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                   {Number(t.valor) > 0 ? '+' : '-'} R$ {Math.abs(Number(t.valor) || 0).toFixed(2)}
                 </span>
               </div>
             ))}
             {(!transacoes || transacoes.length === 0) && <p className="text-center text-gray-500 py-6">Nenhum dado na API ainda.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APLICAÇÃO PRINCIPAL COM LÓGICA DE DADOS ---
function MainApp() {
  const [view, setView] = useState('todas');
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3005/api/transacoes')
      .then(res => {
        if (!res.ok) throw new Error("Erro na rede da API");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setTransacoes(data);
        } else {
          setTransacoes([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Falha ao puxar dados da API:", err);
        setApiError(true);
        setLoading(false);
      });
  }, []);

  const calcularEstatisticas = () => {
    let entradas = 0;
    let gastos = 0;
    const gastosAgrupados: any = {};

    (transacoes || []).forEach((t: any) => {
      const valor = Number(t.valor) || 0;
      if (valor > 0) {
        entradas += valor;
      } else {
        gastos += Math.abs(valor);
        if (t.categoria !== 'entradas' && t.categoria) {
          gastosAgrupados[t.categoria] = (gastosAgrupados[t.categoria] || 0) + Math.abs(valor);
        }
      }
    });

    const graficoCategorias = Object.keys(gastosAgrupados).map(cat => ({
      name: categoriasConfig[cat as keyof typeof categoriasConfig]?.nome || cat,
      valor: gastosAgrupados[cat],
      color: categoriasConfig[cat as keyof typeof categoriasConfig]?.hex || '#ec4899'
    }));

    return {
      stats: { saldo: entradas - gastos, entradas, gastos },
      graficos: { gastosPorCategoria: graficoCategorias }
    };
  };

  const { stats, graficos } = calcularEstatisticas();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-10 font-sans text-gray-100 flex flex-col justify-between" style={{ backgroundColor: '#050609' }}>
      <div className="w-full mx-auto flex flex-col gap-8 flex-1">
        <header className="flex items-center justify-between pb-6 border-b border-white/5">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('todas')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
               <Wallet className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-white">Controle<span className="text-cyan-400 font-light"> Financeiro</span></h1>
          </div>
          <span className="hidden md:block text-sm font-bold text-gray-400 bg-gray-900 px-4 py-2 rounded-xl border border-white/5">ABRIL 2026</span>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-cyan-400 font-semibold animate-pulse">Conectando ao banco de dados...</p>
          </div>
        ) : (
          view === 'todas' ? (
            <HomeDashboard onNavigate={setView} transacoes={transacoes} stats={stats} graficos={graficos} apiError={apiError} />
          ) : (
            <CategoryDetail catId={view} onBack={() => setView('todas')} transacoes={transacoes} />
          )
        )}
      </div>

      <footer className="w-full mt-12 pt-8 border-t border-white/5 flex flex-col items-center justify-center gap-2 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} <span className="text-cyan-400 font-semibold tracking-wide">CodiSec</span>. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

// --- CLASSE DE PROTEÇÃO (ERROR BOUNDARY) ---
// Se o React tentar quebrar novamente, esta classe vai impedir a tela branca
// e exibir exatamente qual foi a linha de código que falhou.
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    this.setState({ errorInfo: error.toString() });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050609] p-10 flex flex-col items-center justify-center text-center font-sans">
          <div className="bg-gray-900 border border-rose-500/30 p-8 rounded-2xl max-w-2xl w-full">
            <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Opa! Ocorreu um erro no painel.</h1>
            <p className="text-gray-400 mb-6">Em vez de ficar com a tela branca, o sistema capturou o erro exato:</p>
            <pre className="bg-black/50 p-4 rounded-lg text-rose-400 text-sm text-left overflow-x-auto border border-rose-500/20">
              {this.state.errorInfo}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Exportação final embrulhada na proteção
export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
