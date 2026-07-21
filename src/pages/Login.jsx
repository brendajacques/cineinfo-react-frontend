import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';
import { Mail, Lock, Eye, EyeOff, Film, CheckCircle2, AlertCircle, ArrowRight, User } from 'lucide-react';
function Login() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (user) {
    setTimeout(() => navigate('/'), 0);
    return null;
  }

  const validateEmail = (val) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isRegister && !name.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }

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

    if (isRegister && password !== confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      let isSuccess = false;
      if (isRegister) {
        isSuccess = register(name.trim(), email, password);
      } else {
        isSuccess = login(email, password);
      }
      setLoading(false);

      if (isSuccess) {
        setSuccessMsg(isRegister ? 'Conta criada com sucesso! Redirecionando...' : 'Login efetuado com sucesso! Redirecionando...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setErrorMsg(isRegister ? 'Erro ao criar conta. Tente novamente.' : 'Erro ao efetuar login. Verifique suas credenciais.');
      }
    }, 1200);
  };

  return (
    <Layout>
      <div className="relative min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[380px] w-[380px] rounded-full bg-cinema-red/10 blur-[80px]"></div>
        <div className="absolute right-10 bottom-10 -z-10 h-72 w-72 rounded-full bg-cinema-neon/5 blur-[90px]"></div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cinema-red text-cinema-popcorn shadow-[0_0_20px_rgba(229,9,20,0.55)]">
              <Film className="h-7 w-7 animate-pulse" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-cinema-popcorn mt-4">
              CINE<span className="text-cinema-red">INFO</span> {isRegister ? 'CADASTRO' : 'ACESSO'}
            </h2>
            <p className="text-sm text-cinema-popcorn/60">
              {isRegister
                ? 'Crie sua conta para salvar seus favoritos e interagir com a comunidade'
                : 'Faça login para salvar seus favoritos e interagir com a comunidade'}
            </p>
          </div>

          <div className="rounded-2xl border border-cinema-charcoal bg-cinema-charcoal/30 backdrop-blur-md p-6 sm:p-8 shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
            <form onSubmit={handleSubmit} className="space-y-6">

              {isRegister && (
                <div className="space-y-2 animate-fadeIn">
                  <label className="block text-xs font-bold uppercase tracking-wider text-cinema-popcorn/60">
                    Nome Completo
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 h-4 w-4 text-cinema-gray" />
                    <input
                      type="text"
                      disabled={loading}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="w-full rounded-full border border-cinema-charcoal bg-cinema-black/40 px-5 py-3 pl-11 text-sm text-cinema-popcorn placeholder-cinema-gray/80 outline-none transition-all duration-300 focus:border-cinema-red focus:bg-cinema-black/60 focus:ring-1 focus:ring-cinema-red/30"
                    />
                  </div>
                </div>
              )}

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
                    className="w-full rounded-full border border-cinema-charcoal bg-cinema-black/40 px-5 py-3 pl-11 text-sm text-cinema-popcorn placeholder-cinema-gray/80 outline-none transition-all duration-300 focus:border-cinema-red focus:bg-cinema-black/60 focus:ring-1 focus:ring-cinema-red/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-cinema-popcorn/60">
                    Senha de Acesso
                  </label>
                  {!isRegister && (
                    <span className="text-[10px] text-cinema-neon hover:underline cursor-pointer font-bold">
                      Esqueceu a senha?
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 h-4 w-4 text-cinema-gray" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha (mín. 6 caracteres)"
                    className="w-full rounded-full border border-cinema-charcoal bg-cinema-black/40 px-5 py-3 pl-11 pr-11 text-sm text-cinema-popcorn placeholder-cinema-gray/80 outline-none transition-all duration-300 focus:border-cinema-red focus:bg-cinema-black/60 focus:ring-1 focus:ring-cinema-red/30"
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

              {isRegister && (
                <div className="space-y-2 animate-fadeIn">
                  <label className="block text-xs font-bold uppercase tracking-wider text-cinema-popcorn/60">
                    Confirmar Senha
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 h-4 w-4 text-cinema-gray" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      disabled={loading}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua senha"
                      className="w-full rounded-full border border-cinema-charcoal bg-cinema-black/40 px-5 py-3 pl-11 pr-11 text-sm text-cinema-popcorn placeholder-cinema-gray/80 outline-none transition-all duration-300 focus:border-cinema-red focus:bg-cinema-black/60 focus:ring-1 focus:ring-cinema-red/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 text-cinema-gray hover:text-cinema-popcorn transition-colors"
                      aria-label={showConfirmPassword ? "Esconder senha" : "Mostrar senha"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {!isRegister && (
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
              )}

              {errorMsg && (
                <div className="flex items-start gap-2.5 rounded-xl bg-cinema-red/10 border border-cinema-red/30 p-3.5 text-xs text-red-400 animate-headShake">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-start gap-2.5 rounded-xl bg-green-500/10 border border-green-500/30 p-3.5 text-xs text-green-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full relative flex items-center justify-center gap-2 rounded-full bg-cinema-red py-3 px-4 text-sm font-bold text-cinema-popcorn hover:bg-red-700 transition-all duration-200 disabled:opacity-75 disabled:bg-cinema-red/60"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-cinema-popcorn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{isRegister ? 'Criando conta...' : 'Autenticando sessão...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isRegister ? 'Criar Minha Conta' : 'Entrar na Plataforma'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-cinema-popcorn/60 mt-6">
              {isRegister ? (
                <p>
                  Já possui uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(false);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-cinema-neon hover:underline font-bold focus:outline-none ml-1 transition-colors"
                  >
                    Faça login
                  </button>
                </p>
              ) : (
                <p>
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(true);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-cinema-neon hover:underline font-bold focus:outline-none ml-1 transition-colors"
                  >
                    Cadastre-se aqui
                  </button>
                </p>
              )}
            </div>


          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
