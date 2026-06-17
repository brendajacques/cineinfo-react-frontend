import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';
import { Mail, Lock, Eye, EyeOff, Film, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

/**
 * Página de Login da Plataforma CineInfo.
 * Apresenta um formulário de login premium com validações e feedback visual dinâmico.
 */
function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Estados dos inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estados de controle da interface
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Se o usuário já estiver logado, redireciona para a Home
  if (user) {
    setTimeout(() => navigate('/'), 0);
    return null;
  }

  // Validação simples de formato de e-mail
  const validateEmail = (val) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Por favor, informe seu endereço de e-mail.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg('Por favor, digite um e-mail válido (ex: usuario@email.com).');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    // Inicia estado de carregamento simulando API
    setLoading(true);

    setTimeout(() => {
      const isSuccess = login(email, password);
      setLoading(false);

      if (isSuccess) {
        setSuccessMsg('Login efetuado com sucesso! Redirecionando...');
        // Redireciona para a Home após 1.5 segundos
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setErrorMsg('Erro ao efetuar login. Verifique suas credenciais.');
      }
    }, 1200);
  };

  return (
    <Layout>
      <div className="relative min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glows decorativos de fundo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[380px] w-[380px] rounded-full bg-cinema-red/10 blur-[80px]"></div>
        <div className="absolute right-10 bottom-10 -z-10 h-72 w-72 rounded-full bg-cinema-neon/5 blur-[90px]"></div>

        <div className="w-full max-w-md space-y-8">
          {/* Cabeçalho da página */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cinema-red text-cinema-popcorn shadow-[0_0_20px_rgba(229,9,20,0.55)]">
              <Film className="h-7 w-7 animate-pulse" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-cinema-popcorn mt-4">
              CINE<span className="text-cinema-red">INFO</span> ACESSO
            </h2>
            <p className="text-sm text-cinema-popcorn/60">
              Faça login para salvar seus favoritos e interagir com a comunidade
            </p>
          </div>

          {/* Card Glassmorphic de Login */}
          <div className="rounded-2xl border border-cinema-charcoal bg-cinema-charcoal/30 backdrop-blur-md p-6 sm:p-8 shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Campo E-mail */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-cinema-popcorn/60">
                  Endereço de E-mail
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 h-4 w-4 text-cinema-gray" />
                  <input
                    type="email"
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@cineinfo.com.br"
                    className="w-full rounded-xl border border-cinema-charcoal bg-cinema-black/40 px-4 py-3 pl-11 text-sm text-cinema-popcorn placeholder-cinema-gray/80 outline-none transition-all duration-300 focus:border-cinema-red focus:bg-cinema-black/60 focus:ring-1 focus:ring-cinema-red/30"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-cinema-popcorn/60">
                    Senha de Acesso
                  </label>
                  <span className="text-[10px] text-cinema-neon hover:underline cursor-pointer font-bold">
                    Esqueceu a senha?
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 h-4 w-4 text-cinema-gray" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha (mín. 6 caracteres)"
                    className="w-full rounded-xl border border-cinema-charcoal bg-cinema-black/40 px-4 py-3 pl-11 pr-11 text-sm text-cinema-popcorn placeholder-cinema-gray/80 outline-none transition-all duration-300 focus:border-cinema-red focus:bg-cinema-black/60 focus:ring-1 focus:ring-cinema-red/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-cinema-gray hover:text-cinema-popcorn transition-colors"
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Checkbox Lembrar */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-cinema-popcorn/70">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-cinema-red rounded border-cinema-charcoal bg-cinema-black/40"
                  />
                  <span>Lembrar de mim neste dispositivo</span>
                </label>
              </div>

              {/* Mensagem de Erro */}
              {errorMsg && (
                <div className="flex items-start gap-2.5 rounded-xl bg-cinema-red/10 border border-cinema-red/30 p-3.5 text-xs text-red-400 animate-headShake">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Mensagem de Sucesso */}
              {successMsg && (
                <div className="flex items-start gap-2.5 rounded-xl bg-green-500/10 border border-green-500/30 p-3.5 text-xs text-green-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Botão de Enviar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative flex items-center justify-center gap-2 rounded-xl bg-cinema-red py-3 px-4 text-sm font-bold text-cinema-popcorn shadow-[0_4px_15px_rgba(229,9,20,0.3)] hover:bg-red-700 hover:scale-[1.01] transition-all duration-200 disabled:opacity-75 disabled:hover:scale-100 disabled:bg-cinema-red/60"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-cinema-popcorn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Autenticando sessão...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar na Plataforma</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Painel Informativo para Testes */}
            <div className="mt-8 pt-6 border-t border-cinema-charcoal text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cinema-gold bg-cinema-gold/10 border border-cinema-gold/20 rounded-full px-3 py-1">
                Acesso de Teste Liberado
              </span>
              <p className="text-[11px] text-cinema-popcorn/50 mt-3.5 leading-relaxed">
                Utilize qualquer formato de e-mail e senha de 6 dígitos. Exemplo: <br />
                <span className="text-cinema-neon font-mono">brenda@cineinfo.com.br</span> com a senha <span className="text-cinema-neon font-mono">123456</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
